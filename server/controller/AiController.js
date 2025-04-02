import { OpenAI } from "openai";
import dotenv from "dotenv";
import Fuse from "fuse.js";
import redis from "../config/redisClient.js";
import getMenuItemsData from "../config/getDataToAi.js";
import { commonQuestions } from "../libs/constants.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// 🟢 Danh sách câu hỏi phổ biến & phản hồi có sẵn


// 🟢 Lưu hội thoại vào Redis
async function saveConversation(userId, role, content) {
  const message = JSON.stringify({ role, content });
  await redis.lpush(`conversation:${userId}`, message);
  await redis.ltrim(`conversation:${userId}`, 0, 9); // Giữ 10 tin nhắn gần nhất
}

// 🟢 Lấy lịch sử hội thoại từ Redis
async function getConversationHistory(userId) {
  const messages = await redis.lrange(`conversation:${userId}`, 0, -1);
  return messages.reverse().map((msg) => JSON.parse(msg));
}

// 🟢 Tìm câu hỏi gần giống trong Redis
async function getSimilarQuestion(userQuestion) {
  const keys = await redis.keys("*");
  const fuse = new Fuse(keys, { threshold: 0.3 });
  const result = fuse.search(userQuestion);

  if (result.length > 0) {
    console.log("✅ Tìm thấy câu hỏi gần giống:", result[0].item);
    return await redis.get(result[0].item);
  }
  return null;
}

// 🟢 Tìm món ăn gần đúng trong MongoDB
async function fuzzySearchData(query) {
  const menuItems = await getMenuItemsData();
  const fuse = new Fuse(menuItems, {
    threshold: 0.5,
    keys: ["Name", "Description", "Category"],
  });
  return fuse.search(query).map((result) => result.item);
}

const fuseCommon = new Fuse(commonQuestions, {
  keys: ["question"],
  threshold: 0.4,
});

// 🟢 Tìm câu hỏi gần giống trong danh sách `common_questions`
function getCommonQuestionAnswer(userQuestion) {
  const result = fuseCommon.search(userQuestion);
  if (result.length > 0) {
    console.log(
      "✅ Phản hồi từ danh sách câu hỏi phổ biến:",
      result[0].item.question
    );
    return result[0].item.answer;
  }
  return null;
}
function extractKeywords(text) {
  const stopWords = [
    "tôi",
    "muốn",
    "ăn",
    "có",
    "gợi ý",
    "cho",
    "về",
    "là",
    "xem",
  ];
  return text
    .toLowerCase()
    .split(" ")
    .filter((word) => !stopWords.includes(word)) // Loại bỏ từ không quan trọng
    .join(" ");
}

// 🟢 Xử lý câu hỏi của người dùng
export async function generateAIResponse(userId, message) {
  console.log("📩 Nhận yêu cầu từ user:", message);

  const keyWords = extractKeywords(message);
  // 1️⃣ Kiểm tra xem câu hỏi có trong danh sách `common_questions` không
  const commonAnswer = getCommonQuestionAnswer(message);
  if (commonAnswer) {
    return commonAnswer;
  }
  // 2️⃣ Kiểm tra câu hỏi gần giống trong Redis
  const cachedReply = await getSimilarQuestion(keyWords);
  if (cachedReply) {
    console.log("✅ Lấy phản hồi từ Redis Cache");
    return cachedReply;
  }

  // 3️⃣ Tìm món ăn trong MongoDB
  const matchedItems = await fuzzySearchData(keyWords);
  if (matchedItems.length === 0) {
    return "Xin lỗi, tôi không tìm thấy kết quả phù hợp.";
  }

  // 4️⃣ Lấy lịch sử hội thoại từ Redis
  const history = await getConversationHistory(userId);

  // 5️⃣ Chuẩn bị dữ liệu cho OpenAI API
  let messages = [
    { role: "system", content: "Bạn là chatbot tư vấn món ăn từ MongoDB." },
    ...history,
    {
      role: "system",
      content: `Món ăn liên quan:\n${JSON.stringify(matchedItems)}`,
    },
    { role: "user", content: keyWords },
  ];

  // 6️⃣ Gọi OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error("OpenAI không trả về phản hồi hợp lệ.");
  }

  const reply = response.choices[0].message.content;
  console.log("🤖 OpenAI phản hồi:", reply);

  // 7️⃣ Lưu câu hỏi + câu trả lời vào Redis
  await saveConversation(userId, "user", message);
  await saveConversation(userId, "assistant", reply);
  await redis.setex(message, 86400, reply);

  return reply;
}
