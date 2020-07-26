/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 3000;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'jobly-test'
// - else: 'jobly'

// database username
const databaseUserName = "postgres";

// database user password
const databaseUserPassword = "springboard";

// port
const port = "5432";

let DB_URI = `postgres://${ databaseUserName }:${ databaseUserPassword }@localhost:${ port }/`;

if (process.env.NODE_ENV === "test") {
  DB_URI += "jobly_test";
} else {
  DB_URI += process.env.DATABASE_URL || "jobly";
}

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URI
};
