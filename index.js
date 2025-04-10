import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import passport from "passport"
import crypto from "crypto";
import session  from "express-session"
import Stripe from "stripe";

// routes import
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.route.js";
import brandRouter from "./routes/brand.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import { User } from "./model/user.model.js";
import { isAuth, sanitizeUser } from "./service/common.js";
import { Strategy as localStrategy} from "passport-local";
 

// server
const server = express();

dotenv.config({
  path: ".env",
});

//  middleware
// server.use(express.raw({type: 'application/json'}));
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
server.use("/api/v1/products", productRouter); //we can also use jwt
server.use("/api/v1/user", userRouter);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/category", categoryRouter);
server.use("/api/v1/brand", brandRouter);
server.use("/api/v1/cart", cartRouter);
server.use("/api/v1/order", orderRouter);

// passport strategies
passport.use(
      "local",
      new localStrategy ({ usernameField: "email" }, async function (
        email,
        password,
        done
      ) {
        try {
          const user = await User.findOne({ email: email }).exec();
          if (!user) {
            return done(null, false, {
              message: "Invalid credentials",
              success: false,
            }); // for safety
          }
          crypto.pbkdf2(
            password,
            user.salt,
            310000,
            32,
            "sha256",
            async function (error, hashedPassword) {
              if (error) {
                done(error);
              }
              // Use timingSafeEqual to prevent timing attacks
              if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                done(null, false, {
                  message: "Invalid credentials",
                  success: false,
                });
              }
              // If the password is correct, sanitize the user object and pass it to the serializer
              done(null, sanitizeUser(user), { message: "Logged In successfuly", success: true}); // this lines sends to serializer
            }
          );
        } catch (error) {
          done(error, false, { message: error.message, success: false });
        }
      }))

//  this creates session variable req.user on being called from callbacks
  passport.serializeUser(function (user, cb) {
    console.log("serialize", user);
    process.nextTick(function () {
      return cb(null, { id: user.id, role: user.role });
    });
  });
// this changes session variable req.user when called from authorized request

  passport.deserializeUser(async function (obj, cb) {
    try {
        const user = await User.findById(obj.id).exec();
        console.log("deserialize", user);
      return cb(null, sanitizeUser(user));
    } catch (error) {
      cb(error);
    }
  });


//  payment integraion

// This is your test secret API key.
const stripe =  new Stripe('sk_test_51QpkZtEXx25K7ImwHQQHz30gtjmzsZXELSNN22uQ5PnYF7ZMZ5hiwBeBadmZLABfEKBNt7TI9gvK3qg8aoyNWXZ000vFqUNpWU');
server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100, // for decimal compensation
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
const endpointSecret = "whsec_0e1456a83b60b01b3133d4dbe06afa98f384c2837645c364ee0d5382f6fa3ca2";
server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

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
