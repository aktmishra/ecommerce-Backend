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
    token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjRkZDBlNzU2MDE3YTMyOTEwZmU1ZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ0MzYxNjYzfQ._zz8YZeIadnIXeg6tPja-tB342odlt8R86T-DK75mOI";
  return token;
};
