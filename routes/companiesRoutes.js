const express = require("express");
const router = new express.Router();
const Company = require("../models/companies");
const jsonschema = require("jsonschema");
const companySchema = require("../helpers/companySchema.json");
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser, isAdmin  } = require("../middleware/auth");

/**
 GET /companies
  This should return the handle and name for all of the company objects. It should also allow for the following query string parameters

  (search): If the query string parameter is passed, a filtered list of handles and names should be displayed based on the search term and if the name includes it.
  
  (min_employees): If the query string parameter is passed, titles and company handles should be displayed that have a number of employees greater than the value of the query string parameter.
  
  (max_employees): If the query string parameter is passed, a list of titles and company handles should be displayed that have a number of employees less than the value of the query string parameter.
  
  If the min_employees parameter is greater than the max_employees parameter, respond with a 400 status and a message notifying that the parameters are incorrect.
  
  This should return JSON of {companies: [companyData, ...]}
 */
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const data = {
      search: "",
      min_employees: 0,
      max_employees: 0
    }
    if(req.query.search) data["search"] = req.query.search;
    if(req.query.min_employees) data["min_employees"] = +req.query.min_employees;
    if(req.query.max_employees) data["max_employees"] = +req.query.max_employees;
    const results = await Company.get(data);
    return res.json({ companies: results });
  } catch (error) {
    next(error);
  }
});

/**
GET /companies/[handle]
  This should return a single company found by its id.

  This should return JSON of {company: companyData}
*/
router.get("/:handle", ensureLoggedIn, async (req, res, next) => {
  try {
    const result = await Company.getByHandle(req.query.handle);
    return res.json({ company: result});
  } catch (error) {
    next(error);
  }
});

/**
POST /companies
  This should create a new company and return the newly created company.

  This should return JSON of {company: companyData} 
*/
router.post("/", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  try { 
    const result = jsonschema.validate(req.body, companySchema); 
    if(result.valid) {
      const comp = await Company.post(req.body);
      return res.json({ company: comp })
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);    
  } catch (error) {
    next(error);
  }
});

/**
PATCH /companies/[handle]
  This should update an existing company and return the updated company.

  This should return JSON of {company: companyData} 
*/
router.patch("/", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  let patchSchema = Object.assign({}, companySchema);
  patchSchema["required"] = [];
  try {    
    const result = jsonschema.validate(req.body, patchSchema); 
    if(result.valid) {
      const comp = await Company.patch(req.query.handle, req.body);
      return res.json({ company: comp })
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  } catch (error) {
    next(error);
  }
});

/**
DELETE /companies/[handle]
  This should remove an existing company and return a message.

  This should return JSON of {message: "Company deleted"} 
 */
router.delete("/", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  try {
    const result = await Company.delete(req.query.handle);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});


 module.exports = router;