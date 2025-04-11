import mongoose from "mongoose";
// import { DB_NAME } from "../utils/constant.js";
import dotenv from "dotenv"
dotenv.config({
  path: ".env",
});

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
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
