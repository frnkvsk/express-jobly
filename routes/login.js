const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const ExpressError = require("../helpers/expressError");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

/*
POST /login
  This should authenticate a user and return a JSON Web Token which contains a payload with the username and is_admin values.

  This should return JSON: {token: token}
*/
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }

    const { is_admin, is_authorized } = await User.authenticate(username, password);

    if(is_authorized) {
      let token = jwt.sign({ "username": username, "is_admin": is_admin}, SECRET_KEY);
      return res.json({ token: token });
    }
    
    throw new ExpressError("Invalid username/password", 400);
  } catch (err) {
    next(err);
  }
});

module.exports = router;