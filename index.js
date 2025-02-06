import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import passport from "passport"
import session  from "express-session"
import { localStrategy } from "./service/localStrategy.js";

// routes import
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import brandRouter from "./routes/brand.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
 

// server
const server = express();

dotenv.config({
  path: ".env",
});

//  middleware
server.use(express.json());
server.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate('session'));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);



// route declaration
server.use("/api/v1/products", productRouter);
server.use("/api/v1/user", userRouter);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/category", categoryRouter);
server.use("/api/v1/brand", brandRouter);
server.use("/api/v1/cart", cartRouter);
server.use("/api/v1/order", orderRouter);

// passport strategies
localStrategy(passport)


 

// DataBase Connection
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
