import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_MONGO);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
export default connectDb;


