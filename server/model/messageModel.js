import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: String,  // Người gửi
    message: String, // Nội dung
    reply: String, // Phản hồi từ AI
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
