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
    next({ status: 401, message: "Unauthorized" });
  }
}

// verify a user is currently logged in
const ensureLoggedIn = (req, res, next) => {
  try {
    if(req.user) 
      next();
  } catch (error) {
    next({ status: 401, message: "Unauthorized" });
  }
}

// validate correct username
const ensureCorrectUser = (req, res, next) => {
  try {    
    if(req.user.username === req.query.username || 
      req.user.username === jwt.decode(req.body._token).username) {
      next();
    } else {
      next({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    next({ status: 401, message: "Unauthorized" });
  }
}

// verify if user is an administrator
const isAdmin = (req, res, next) => {
  try {    
    if(jwt.decode(req.body._token).is_admin) {
      next();
    } else {
      next({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    next({ status: 401, message: "Unauthorized" });
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  isAdmin
}