/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForGetCompanies = require("../helpers/getCompanies");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

const itemize = items => items.map((_,i) => '$'+(i+1)).join(",");

class Company {

  static async get({search, min_employees, max_employees}) {
    if(min_employees > max_employees) 
      throw new ExpressError("min_employees greater than max_employees", 400);

    // query is complicated so we get query from a helper file
    const query = await sqlForGetCompanies({search, min_employees, max_employees});
    const resp = await db.query(query.query, query.values);
    return resp.rows;
  }

  static async getByHandle(handle) {
    //{company: {...companyData, jobs: [job, ...]}}
    const query = `SELECT handle, name, num_employees, description, logo_url
                  FROM companies
                  WHERE handle = $1`;
    const resp = await db.query(query, [handle]);
    const query2 = `SELECT json_build_object(
                      'id', id,
                      'title', title,
                      'salary', salary,
                      'equity', equity,
                      'company_handle', company_handle,
                      'date_posted', date_posted
                    ) job
                    FROM jobs
                    WHERE company_handle = $1`;
    const resp2 = await db.query(query2, [handle]);
    return {...resp.rows[0], jobs: resp2.rows};
  }
  
  static async post(data) {
    delete data._token;
    delete data.username;
    let keys = Object.keys(data);
    let vals = Object.values(data);
    // build query
    const query = `INSERT INTO companies (${keys.join(",")}) VALUES (${itemize(keys)}) RETURNING *`;
    const resp = await db.query(query, vals);
    return resp.rows[0];
  }

  // data = { column: newValue, ... }
  static async patch(handle, data) {  
    delete data._token;
    delete data.username;
    // query is complicated so we get query from a helper file  
    const query = await sqlForPartialUpdate("companies", data, "handle", handle);
    const resp = await db.query(query.query, query.values);
    return resp.rows[0];
  }

  static async delete(handle) {
    const query1 = `DELETE FROM jobs
                  WHERE company_handle = $1`;
    const resp1 = await db.query(query1, [handle]);
    const query2 = `DELETE FROM companies
                  WHERE handle = $1`;
    const resp2 = await db.query(query2, [handle]);
    return {message: "Company deleted"};
  }
}

module.exports = Company;