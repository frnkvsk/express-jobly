const express = require("express");
const router = new express.Router();
const User = require("../models/users");
const jsonschema = require("jsonschema");
const userSchema = require("../schemas/userSchema.json");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

/*
GET /users
  This should return the username, first_name, last_name and email of the user objects.

  This should return JSON: {users: [{username, first_name, last_name, email}, ...]}
*/
router.get("/", async (req, res, next) => {
  try {
    const results = await User.get();
    return res.json({ "users": results })
  } catch (error) {
    next(error);
  }
});

/*
GET /users/[username]
  This should return all the fields for a user excluding the password.

  This should return JSON: {user: {username, first_name, last_name, email, photo_url}}
*/
router.get("/:username", async (req, res, next) => {
  try {
    const result = await User.getByUsername(req.query.username);
    return res.json({ "user": result});
  } catch (error) {
    next(error);
  }
});

/*
POST /users
  This should create a new user and return information on the newly created user.

  This should return JSON: {user: user}
*/
router.post("/", async (req, res, next) => {
  try {   
    const result = jsonschema.validate(req.body, userSchema); 
    if(result.valid) {
      const { username, is_admin } = await User.post(req.body);
      let token = jwt.sign({ "username": username, "is_admin": is_admin}, SECRET_KEY);
      return res.json({ "token": token });
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);    
  } catch (error) {
    next(error);
  }
});


/*
PATCH /users/[username]
  This should update an existing user and return the updated user excluding the password.

  This should return JSON: {user: {username, first_name, last_name, email, photo_url}}
*/
router.patch("/", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  let patchSchema = Object.assign({}, userSchema);
  patchSchema["required"] = [];
  try {    
    const result = jsonschema.validate(req.body, patchSchema); 
    if(result.valid) {
      const user = await User.patch(req.query.username, req.body);
      return res.json({ "user": user })
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  } catch (error) {
    next(error);
  }
});


/*
DELETE /users/[username]
  This should remove an existing user and return a message.

  This should return JSON: { message: "User deleted" }
*/
router.delete("/", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const result = await User.delete(req.query.usernames);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});


module.exports = router;