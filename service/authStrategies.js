import { Strategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../model/user.model.js";
import { sanitizeUser } from "./common.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export const authStrategies = (passport) => {
  //local
  passport.use(
    "local",
    new Strategy({ usernameField: "email" }, async function (
      email,
      password,
      done
    ) {
      try {
        const user = await User.findOne({ email: email }).exec();
        // TODO: this is just temporary, we will use strong password auth
        if (!user) {
          return done(null, false, {
            message: "invalid credentials",
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
                message: "invalid credentials",
                success: false,
              });
            }
            //token
            const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET);

            // If the password is correct, sanitize the user object and pass it to the serializer
            done(
              null,
              { id: user.id, role: user.role, token },
              {
                message: "Logged In successfuly",
                success: true,
              }
            ); // this lines sends to serializer
          }
        );
      } catch (error) {
        done(error, false, { message: error.message, success: false });
      }
    })
  );

  //jwt
  passport.use(
    "jwt",
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log({ jwt_payload });
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, sanitizeUser(user)); // this calls serializer
        } else {
          return done(null, false, { message: "Unauthorised" });
        }
      } catch (error) {
        return done(error, false, { message: error.message, success: false });
      }
    })
  );

  // this creates session variable req.user on being called from callbacks
  passport.serializeUser(function (user, cb) {
    console.log("serialize", user);
    process.nextTick(function () {
      return cb(null, { id: user.id, role: user.role });
    });
  });

//   // this changes session variable req.user when called from authorized request

  passport.deserializeUser(async function (obj, cb) {
    try {
      const user = await User.findById(obj.id).exec();
      console.log("deserialize", user);
      cb(null, user);
    } catch (error) {
      cb(error);
    }
  });
};
