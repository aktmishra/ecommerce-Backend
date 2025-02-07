// import { Strategy as JwtStrategy } from "passport-jwt";
// import { User } from "../model/user.model.js";
// import { cookieExtractor, sanitizeUser } from "./common.js";
// import { SECRET_KEY } from "../utils/constant.js";

 
// const opts = {};
// opts.jwtFromRequest = cookieExtractor;
// opts.secretOrKey = SECRET_KEY;

// export const jwtStrategy = (passport) => {
//   passport.use(
//     "jwt",
//     new JwtStrategy(opts, async function (jwt_payload, done) {
//       console.log({ jwt_payload });
//       try {
//         const user = await User.findById(jwt_payload.id);
//         if (user) {
//           return done(null, sanitizeUser(user)); // this calls serializer
//         } else {
//           return done(null, false);
//         }
//       } catch (error) {
//         return done(error, false, { message: error.message, success: false });
//       }
//     })
//   );
   
// };
