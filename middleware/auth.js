/** Middleware used to authenticate users */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// verify a user is authorized
const authenticateJWT = (req, res, next) => {
  try {
    const token = req.body._token;
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

// verify a user is currently logged in
const ensureLoggedIn = (req, res, next) => {
  if(!req.user) {
    next({ status: 401, message: "Unauthorized"});
  }
  next();
}

// validate correct username
const ensureCorrectUser = (req, res, next) => {
  try {
    if(req.user.user === req.params.username) {
      next();
    } else {
      next({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
}