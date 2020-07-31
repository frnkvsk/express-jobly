const db = require("../db");
const ExpressError = require("../helpers/expressError");


class Application {

  /*
  GET /users/[username]
    This should show all the fields for a user excluding the password. It should also include a column of jobs which are all of the jobs that user is associated with as well as the status of that application.
    
    It should return JSON of:
    { 
      username, password, first_name, last_name, email, photo_url, is_admin, 
      jobs: { name, id, title, salary, equity, state, created_at }
    }
  */
  static async get(username) {
    // build query
    const query = `SELECT u.username, u.password, u.first_name, u.last_name, u.email, u.photo_url, 
                  u.is_admin, json_build_object('name': c.name, 'id': j.id, 'title': j.title, 'salary': j.salary, 
                  'equity': j.equity, 'state': j.state, 'created_at': j.created_at) jobs
                  
                  FROM users u, applications a, companies c, jobs j
                  WHERE a.username = $1
                  AND a.username = u.username 
                  AND a.job_id = j.id 
                  AND j.company_handle = c.handle`;
    const resp = await db.query(query, [username]);
    return { "user": resp.rows };
  }


  /*
  POST /jobs/[id]/apply
    This should take {state: string-of-application-state} and insert into the applications table. 
    
    It should return JSON of:
    {
      message: new-state
    }
  */
  static async post(id, state) {
    
  }

}
