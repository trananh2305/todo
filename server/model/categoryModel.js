import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
            require:true
        },

    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Category", CategorySchema)