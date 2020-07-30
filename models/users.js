const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");

const itemize = items => items.map((_,i) => '$'+(i+1)).join(",");

class User {

  /*
  GET /users
    This should return the username, first_name, last_name and email of the user objects.

    This should return JSON: {users: [{username, first_name, last_name, email}, ...]}
  */
  static async get() {
    // build query
    const query = `SELECT username, first_name, last_name, email
                  FROM users`;
    
    const resp = await db.query(query, []);
    // console.log("USER => ", {users: resp.rows})
    return resp.rows;
  }

  /*
  GET /users/[username]
    This should return all the fields for a user excluding the password.

    This should return JSON: {user: {username, first_name, last_name, email, photo_url}}
  */
  static async getByUsername(username) {
    // build query
    const query = `SELECT username, first_name, last_name, email, photo_url 
                  FROM users 
                  WHERE username = $1`;

    const resp = await db.query(query, [username]);
    return resp.rows[0];
  }
  
  /*
    POST /users
      This should create a new user and return information on the newly created user.

      This should return JSON: {user: user}
    */
  static async post(data) {
    data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    let keys = Object.keys(data);
    let vals = Object.values(data);

    // build query
    const query = `INSERT INTO users (${keys.join(",")}) VALUES (${itemize(keys)}) RETURNING *`;
    const resp = await db.query(query, vals);
    return resp.rows[0];
  }

  /*
  PATCH /users/[username]
    This should update an existing user and return the updated user excluding the password.

    This should return JSON: {user: {username, first_name, last_name, email, photo_url}}
  */
  // data = { fromValue: toValue, ... }
  static async patch(username, data) {
    // query is complicated so we get query from a helper file
    const query = await sqlForPartialUpdate("users", data, "username", username);

    const resp = await db.query(query.query, query.values);
    return resp.rows[0];
  }

  /*
  DELETE /users/[username]
    This should remove an existing user and return a message.

    This should return JSON: { message: "User deleted" }
  */
  static async delete(username) {
    // build query
    const query = `DELETE FROM users WHERE username=$1`;

    const resp = await db.query(query, [username]);
    return {message: "User deleted"};
  }

  /*
  Authenticate: 
    is this username/password valid? Returns boolean. 
  */
  static async authenticate(username, password) { 
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const resp = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]
    );
    return resp.rows.length && bcrypt.compare(password, resp.rows[0].password)
  }

}

module.exports = User;