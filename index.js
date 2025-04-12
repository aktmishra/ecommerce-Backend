import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import passport from "passport";
import session from "express-session";
import { authStrategies } from "./service/authStrategies.js";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import path from "path"
import { fileURLToPath } from 'url';
 


// routes import
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import brandRouter from "./routes/brand.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import { isAuth } from "./service/common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({
  path: ".env",
});

// server
const server = express();

//  middleware
// server.use(express.raw({type: 'application/json'}));
server.use(express.static(path.resolve(__dirname, "dist")))
server.use(express.json());
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(cookieParser())
server.use(passport.authenticate("session"));
server.use(
  cors({
    // origin: "http://localhost:5173", //frontend url
    // credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

// route declaration
server.use("/api/v1/products", isAuth(), productRouter);
server.use("/api/v1/user", isAuth(), userRouter);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/category", isAuth(), categoryRouter);
server.use("/api/v1/brand", isAuth(), brandRouter);
server.use("/api/v1/cart", isAuth(), cartRouter);
server.use("/api/v1/order", isAuth(), orderRouter);
//this line added to make react router work in case of other routes does not match
server.get("*", (req, res)=>res.sendFile(path.resolve("dist", "index.html")))

// passport strategies
authStrategies(passport);

//  payment integraion

// This is your test secret API key.
const stripe = new Stripe(
  "sk_test_51QpkZtEXx25K7ImwHQQHz30gtjmzsZXELSNN22uQ5PnYF7ZMZ5hiwBeBadmZLABfEKBNt7TI9gvK3qg8aoyNWXZ000vFqUNpWU"
);
server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
// Webhook
// TODO: we will capture actual order after deploying out server live on public URL
const endpointSecret =
  "whsec_0e1456a83b60b01b3133d4dbe06afa98f384c2837645c364ee0d5382f6fa3ca2";
server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log({ paymentIntentSucceeded });
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

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
