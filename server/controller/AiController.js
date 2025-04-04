import { OpenAI } from "openai";
import dotenv from "dotenv";
import Fuse from "fuse.js";
import redis from "../config/redisClient.js";
import getMenuItemsData from "../config/getDataToAi.js";
import { commonQuestions, stopWords } from "../libs/constants.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// 🟢 Lưu hội thoại vào Redis
async function saveConversation(userId, role, content) {
  const message = JSON.stringify({ role, content });
  await redis.lpush(`conversation:${userId}`, message);
  await redis.ltrim(`conversation:${userId}`, 0, 9);
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
    keys: ["name", "description", "category.categoryName"],
  });
  return fuse.search(query).map((result) => result.item);
}

const fuseCommon = new Fuse(commonQuestions, {
  keys: ["question"],
  threshold: 0.6,
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

// 🟢 Tách từ khóa cơ bản (từ câu nói)
function extractKeywords(text) {
  return text
    .toLowerCase()
    .split(" ")
    .filter((word) => !stopWords.includes(word))
    .join(" ");
}

// 🟢 Phân tích ý định người dùng bằng GPT
async function extractFoodContext(userMessage) {
  const prompt = `
Người dùng hỏi: "${userMessage}".
Bạn hãy phân tích xem người đó đang tìm món ăn theo tiêu chí gì (thời tiết, cảm xúc, dịp đặc biệt, loại món ăn...).
Hãy trả về từ khóa món ăn gợi ý phù hợp và gần đầy đủ nhất có thể. Ví dụ: "lẩu", "nướng", "lẩu, nướng", "súp", "kem","tôm", "cua", "hàu" v.v.

Chỉ trả về từ khóa, không giải thích.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Bạn là AI hiểu ngữ cảnh người dùng hỏi về món ăn",
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content.trim();
}

// 🟢 Kết hợp cả AI và keyword filter
function mergeKeywords(...sources) {
  const seen = new Set();
  return sources
    .flat()
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k && !seen.has(k) && seen.add(k)); // loại trùng
}

async function getAllRelevantKeywords(message) {
  const contextKeywordsRaw = await extractFoodContext(message);
  const contextKeywords = contextKeywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k);

  const keywordText = extractKeywords(message);
  const basicKeywords = keywordText
    .split(" ")
    .map((k) => k.trim())
    .filter((k) => k);

  return mergeKeywords(contextKeywords, basicKeywords);
}

// 🟢 Hàm chính xử lý phản hồi từ AI
export async function generateAIResponse(userId, message) {
  console.log("📩 Nhận yêu cầu từ user:", message);

  // 1️⃣ Kiểm tra câu hỏi phổ biến
  const commonAnswer = getCommonQuestionAnswer(message);
  if (commonAnswer) {
    return commonAnswer;
  }

  // 2️⃣ Kiểm tra trong Redis cache
  const cachedReply = await getSimilarQuestion(message);
  if (cachedReply) {
    console.log("✅ Lấy phản hồi từ Redis Cache");
    return cachedReply;
  }

  // 3️⃣ Tìm từ khóa từ AI + keyword lọc
  const keyWords = await getAllRelevantKeywords(message);
  console.log("🔍 Tổng hợp từ khóa:", keyWords);

  // 4️⃣ Tìm món ăn trong MongoDB theo từng keyword
  let matchedItems = [];
  for (const keyword of keyWords) {
    const results = await fuzzySearchData(keyword);
    matchedItems.push(...results);
  }

  // 5️⃣ Loại món ăn trùng
  matchedItems = matchedItems.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t._id.toString() === item._id.toString())
  );

  if (matchedItems.length === 0) {
    return "Xin lỗi, tôi không tìm thấy món ăn phù hợp trong menu.";
  }

  // 6️⃣ Format danh sách món ăn rõ ràng
  const formattedMenu = matchedItems
    .map((item, i) => {
      const name = item.name || "Không tên";
      const description = item.description || "Không có mô tả";
      const category = item.category?.categoryName || "Không rõ";
      return `${i + 1}. ${name} - ${description} (Phân loại: ${category})`;
    })
    .join("\n");

  // 7️⃣ Lấy lịch sử hội thoại
  const history = await getConversationHistory(userId);

  // 8️⃣ Gửi yêu cầu đến GPT với hướng dẫn chặt chẽ
  const messages = [
    {
      role: "system",
      content:
        "Bạn là chatbot chuyên tư vấn món ăn. Chỉ được sử dụng các món ăn có trong danh sách bên dưới. Không được gợi ý món khác ngoài danh sách.",
    },
    ...history,
    {
      role: "system",
      content: `Dưới đây là danh sách món ăn phù hợp từ menu:\n${formattedMenu}`,
    },
    { role: "user", content: message },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error("OpenAI không trả về phản hồi hợp lệ.");
  }

  const reply = response.choices[0].message.content;
  console.log("🤖 OpenAI phản hồi:", reply);

  // 9️⃣ Lưu lịch sử và cache
  await saveConversation(userId, "user", message);
  await saveConversation(userId, "assistant", reply);
  await redis.setex(message, 86400, reply);

  return reply;
}
