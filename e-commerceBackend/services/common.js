const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt', { session: false });
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // This reads the ACTUAL cookie from the browser
  }
  return token; // Returns null if no cookie is found, which is correct
};