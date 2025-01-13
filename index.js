import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";

const server = express();

dotenv.config({
  path: ".env",
});

//  middleware
server.use(express.json());
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

// routes import
import productRouter from "./routes/product.route.js";

// route declaration
server.use("/api/v1/products", productRouter);

// DataBase Connection
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
