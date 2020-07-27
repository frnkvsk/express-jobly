/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {

  static async get(search="", min=0, max=0) {
    
    if(min > max) 
      throw new ExpressError("min_employees greater than max_employees", 400);
    
    let response, values = [];
    
    // if(min) values.push(min);
    // if(max) values.push(max);
    // if(search.length) {
    //   values.unshift(search);
    //   if(min && max)
    //   response = await db.query
    // }
  }

}