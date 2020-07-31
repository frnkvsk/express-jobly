const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

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
    delete data._token;
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

    data = { fromValue: toValue, ... }
  */
  static async patch(username, data) {
    delete data._token;
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
      `SELECT password, is_admin FROM users WHERE username = $1`,
      [username]
    );
    let is_auth = false, is_admin = false;
    if( resp.rows.length ) {
       is_auth = bcrypt.compare(hashedPassword, resp.rows[0].password);
       is_admin = resp.rows[0].is_admin;
    }
    return { "is_admin": is_admin, "is_auth": is_auth };
  }

}

module.exports = User;

/**
 * TODO:
 * Implement Further Study - Job Applications
 * 
 * It is unclear what the requirements are defining.
 */
/*
  GET /users/[username]
    This should show all the fields for a user excluding the password. It should also include a column of jobs which are all of the jobs that user is associated with as well as the status of that application.
    
    It should return JSON of:
    { 
      username, password, first_name, last_name, email, photo_url, is_admin, 
      jobs: { name, id, title, salary, equity, state, created_at }
    }
  */
  // static async getByUsername(username) {
  //   // build query
  //   const query = `SELECT u.username, u.password, u.first_name, u.last_name, u.email, u.photo_url, 
  //                 u.is_admin, json_build_object('name': c.name, 'id': j.id, 'title': j.title, 'salary': j.salary, 
  //                 'equity': j.equity, 'state': j.state, 'created_at': j.created_at) jobs
                  
  //                 FROM users u, applications a, companies c, jobs j
  //                 WHERE a.username = $1
  //                 AND a.username = u.username 
  //                 AND a.job_id = j.id 
  //                 AND j.company_handle = c.handle`;
  //   const resp = await db.query(query, [username]);
  //   return { "user": resp.rows };
  // }