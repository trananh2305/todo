import mongoose from "mongoose";
// Menu Item Schema
const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: mongoose.Types.Decimal128, required: true },
    imageUrl: { type: String },
    category: {
      categoryId: {
        type: String,
        required: true,
      },
      categoryName: { type: String, default: "" },
    },
    estimatedTime: { type: Number },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true } // auto create createdAt, updatedAt);
);


const MenuItemModel = mongoose.model < IMenuItem > ("MenuItem", MenuItemSchema);

export default MenuItemModel;
