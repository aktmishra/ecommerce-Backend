import passport from "passport";

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const isAuth = (req, res) => {
  return passport.authenticate("jwt");
};

export const cookiesExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  
  return token;
};
  