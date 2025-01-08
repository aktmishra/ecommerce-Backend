import mongoose from "mongoose";
import { DB_NAME } from "../utils/constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n Database connected !! DB Host: ${connectionInstance.connection.host}`
    );
    // console.log(connectionInstance)
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
