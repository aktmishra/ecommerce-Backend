import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js"; 
// import {createProduct} from "./controller/product.controller.js"
const server = express();
// routes import
import productRouter from "./routes/product.route.js"

dotenv.config({
  path: ".env"
});

//  middleware
server.use(express.json())
// route declaration
server.use("/api/v1/products", productRouter)
// server.post("/api/v1/products", createProduct)
connectDB()
.then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
