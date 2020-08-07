/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const ExpressError = require("./helpers/expressError");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");

const app = express();

// allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// add logging system
app.use(morgan("tiny"));

// allow connections to all routes from any browser
app.use(cors());


const login = require("./routes/login");
app.use("/login", login);

// get auth token for all routes
app.use(authenticateJWT);

/** routes */
const companyRoutes = require("./routes/companiesRoutes");
const jobRoutes = require("./routes/jobsRoutes");
const userRoutes = require("./routes/usersRoutes");

app.use("/companies/", companyRoutes);
app.use("/jobs/", jobRoutes);
app.use("/users/", userRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
