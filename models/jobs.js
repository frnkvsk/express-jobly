/** Jobs class for jobly */

const db = require("../db");
const ExressError = require("../helpers/expressError");
const sqlGetWhere = require("../helpers/getWhere");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

const itemize = items => items.map((_,i) => '$'+(i+1)).join(",");

class Job {
  
  
  static async get({search, min_salary, min_equity}) {

    // query is complicated so we get query from a helper file
    const query = await sqlGetWhere({search, min_salary, min_equity});
    // console.log("query => ", query)
    const resp = await db.query(query.query, query.values);
    // console.log("JOB => ",resp.rows)
    return resp.rows;
  }

  
  static async getById(id) {
    // build query
    const query = `SELECT id, title, salary, equity, company_handle, date_posted FROM jobs WHERE id = $1`;

    const resp = await db.query(query, [id]);
    return resp.rows;
  }

  static async post(data) {
    let keys = Object.keys(data);
    let vals = Object.values(data);
    // build query
    const query = `INSERT INTO jobs (${keys.join(",")}) VALUES (${itemize(keys)}) RETURNING *`;
    // console.log("post query => ",query)
    const resp = await db.query(query, vals);
    return resp.rows[0];
  }

  // data = { fromValue: toValue, ... }
  static async patch(id, data) {
    // query is complicated so we get query from a helper file
    const query = await sqlForPartialUpdate("jobs", data, "id", id);
    const resp = await db.query(query.query, query.values);
    return resp.rows[0];
  }

  static async delete(id) {
    // build query
    const query = `DELETE FROM jobs WHERE id=$1`;

    const resp = await db.query(query, [id]);
    return {message: "Job deleted"};
  }
}

module.exports = Job;