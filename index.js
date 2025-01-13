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
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import brandRouter from "./routes/brand.route.js";

// route declaration
server.use("/api/v1/products", productRouter);
server.use("/api/v1/user", userRouter);
server.use("/api/v1/category", categoryRouter);
server.use("/api/v1/brand", brandRouter);

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
