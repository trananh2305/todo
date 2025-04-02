import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import { Server } from "socket.io";
import cors from "cors";
import { generateAIResponse } from "./controller/AiController.js";

dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

// 🛠 Routes API
app.use("/api", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/todo", todoRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`🟢 Client ${socket.id} đã kết nối`);

  socket.on("user_message", async (data) => {
    console.log(`📩 Nhận tin nhắn từ ${data.user}:`, data.message);

    try {
      // Gọi hàm AI
      const reply = await generateAIResponse(data.user, data.message);

      console.log(`🤖 AI phản hồi: ${reply || "Không có phản hồi"}`);

      // Gửi phản hồi về client
      io.emit("ai_reply", {
        user: "AI",
        message: reply || "Xin lỗi, tôi không hiểu.",
      });
    } catch (error) {
      console.error("❌ Lỗi AI:", error.message);
      io.emit("ai_reply", {
        user: "AI",
        message: "Xin lỗi, hệ thống đang gặp lỗi!",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client ${socket.id} đã ngắt kết nối`);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${port}`);
});
