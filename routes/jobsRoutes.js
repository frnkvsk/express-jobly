const express = require("express");
const router = new express.Router();
const Job = require("../models/jobs");
const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema.json");
const ExpressError = require("../helpers/expressError");
const { ensureCorrectUser, ensureLoggedIn, isAdmin } = require("../middleware/auth");


/*
GET /jobs
  This route should list all the titles and company handles for all jobs, ordered by the most recently posted jobs. It should also allow for the following query string parameters

  search: If the query string parameter is passed, a filtered list of titles and company handles should be displayed based on the search term and if the job title includes it.

  min_salary: If the query string parameter is passed, titles and company handles should be displayed that have a salary greater than the value of the query string parameter.

  min_equity: If the query string parameter is passed, a list of titles and company handles should be displayed that have an equity greater than the value of the query string parameter.
  It should return JSON of {jobs: [job, ...]}
*/
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const data = {
      search: "",
      min_salary: 0,
      min_equity: 0
    }
    if(req.query.hasOwnProperty("search")) data["search"] = req.query.search;
    if(req.query.hasOwnProperty("min_salary")) data["min_salary"] = +req.query.min_salary;
    if(req.query.hasOwnProperty("min_equity")) data["min_equity"] = +req.query.min_equity;
    const results = await Job.get(data);
    return res.json({ jobs: results });
  } catch (error) {
    next(error);
  }
});


/*
GET /jobs/[id]
  This route should show information about a specific job including a key of company which is an object that contains all of the information about the company associated with it.

  It should return JSON of {job: jobData}
*/
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const result = await Job.getById(req.params.id);
    return res.json({ jobs: result});
  } catch (error) {
    next(error);
  }
});

/*
POST /jobs
  This route creates a new job and returns a new job.

  It should return JSON of {job: jobData}
*/
router.post("/", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  try {   
    const result = jsonschema.validate(req.body, jobSchema); 
    if(result.valid) {
      const job = await Job.post(req.body);
      return res.json({ "job": job })
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);    
  } catch (error) {
    next(error);
  }
});

/*
PATCH /jobs/[id]
  This route updates a job by its ID and returns an the newly updated job.

  It should return JSON of {job: jobData}
*/
router.patch("/:id", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  let patchSchema = Object.assign({}, jobSchema);
  patchSchema["required"] = [];
  try {    
    const valid = jsonschema.validate(req.body, patchSchema); 
    if(valid.valid) {
      const result = await Job.patch(req.params.id, req.body);
      return res.json({ jobs: result })
    }
    let listOfErrors = result.errors.map(e => e.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  } catch (error) {
    next(error);
  }
});

/*
DELETE /jobs/[id]
  This route deletes a job and returns a message.

  It should return JSON of { message: "Job deleted" }
*/
router.delete("/:id", ensureLoggedIn, ensureCorrectUser, isAdmin, async (req, res, next) => {
  try {
    const result = await Job.delete(req.params.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
