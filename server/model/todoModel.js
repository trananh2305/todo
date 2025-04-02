import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    isImportant: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Todo", TodoSchema);
