// import { Strategy } from "passport-local";
// import { User } from "../model/user.model.js";
// import { sanitizeUser } from "./common.js";
// import crypto from "crypto";
// export const localStrategy = (passport) => {
//   passport.use(
//     "local",
//     new Strategy({ usernameField: "email" }, async function (
//       email,
//       password,
//       done
//     ) {
//       try {
//         const user = await User.findOne({ email: email }).exec();
//         // TODO: this is just temporary, we will use strong password auth
//         if (!user) {
//           return done(null, false, {
//             message: "invalid credentials",
//             success: false,
//           }); // for safety
//         }
//         crypto.pbkdf2(
//           password,
//           user.salt,
//           310000,
//           32,
//           "sha256",
//           async function (error, hashedPassword) {
//             if (error) {
//               done(error);
//             }
//             // Use timingSafeEqual to prevent timing attacks
//             if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
//               done(null, false, {
//                 message: "invalid credentials",
//                 success: false,
//               });
//             }
//             // If the password is correct, sanitize the user object and pass it to the serializer
//             done(null, sanitizeUser(user), { message: "Logged In successfuly", success: true}); // this lines sends to serializer
//           }
//         );
//       } catch (error) {
//         done(error, false, { message: error.message, success: false });
//       }
//     })
//   );

//   // this creates session variable req.user on being called from callbacks
//   passport.serializeUser(function (user, cb) {
//     console.log("serialize", user);
//     process.nextTick(function () {
//       return cb(null, { id: user.id, role: user.role });
//     });
//   });

//   // this changes session variable req.user when called from authorized request

//   passport.deserializeUser(async function (obj, cb) {
//     try {
//         const user = await User.findById(obj.id).exec();
//         console.log("deserialize", user);
//       cb(null, user);
//     } catch (error) {
//       cb(error);
//     }
//   });
// };
