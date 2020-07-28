/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForGetCompanies = require("../helpers/getCompanies");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {

  static async get({search, min_employees, max_employees}) {
    if(min_employees > max_employees) 
      throw new ExpressError("min_employees greater than max_employees", 400);

    // query is complicated so we get query from a helper file
    const query = await sqlForGetCompanies({search, min_employees, max_employees});
    const resp = await db.query(query.query, query.values);
    return resp.rows;
  }

  static async post({handle, name, num_employees, description, logo_url}) {

    const query = `INSERT INTO companies (handle, name, num_employees, description, logo_url)
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING *`;
    const resp = await db.query(query, [handle, name, num_employees, description, logo_url]);
    return resp.rows[0];
  }

  static async getByHandle(handle) {
    const query = `SELECT handle, name, num_employees, description, logo_url
                  FROM companies
                  WHERE handle = $1`;
    const resp = await db.query(query, [handle]);
    return resp.rows[0];
  }

  static async patch(handle, data) {  
    // query is complicated so we get query from a helper file  
    const query = await sqlForPartialUpdate("companies", data, "handle", handle);
    const resp = await db.query(query.query, query.values);
    return resp.rows[0];
  }

  static async delete(handle) {
    const query = `DELETE FROM companies
                  WHERE handle = $1`;
    const resp = await db.query(query, [handle]);
    return {message: "Company deleted"};
  }
}

module.exports = Company;