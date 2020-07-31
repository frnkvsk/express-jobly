const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/companies");
const Job = require("../../models/jobs");
const User = require("../../models/users");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTU5NjEyMzQ3MH0.FSt31q9RLpb6xDjtEmBNMeoi5Z8qjbQEJQp5AscXkHY";
const username = "user1";
const password = "password1";

const user1 = {"_token": token, username: "user1", password: password, first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: true};


const company1 = {"_token": token, "username": username, handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};

const job1 = {"_token": token, "username": username, title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
const job2 = {"_token": token, "username": username, title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
const job3 = {"_token": token, "username": username, title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
const job4 = {"_token": token, "username": username, title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};

describe("GET /jobs/ search, min_salary, min_equity", () => {

  beforeAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies"); 
    
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    await Company.post(Object.assign({},company1));
    await Job.post(Object.assign({},job1));
    await Job.post(Object.assign({},job2));
    await Job.post(Object.assign({},job3));
    await Job.post(Object.assign({},job4));
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/jobs/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(4);
  });

  it("test get search = b", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=b`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
  });

  it("test get min_salary = 3000", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_salary=3000`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get min_equity = 0.4", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_equity=0.4`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get search = c, min_salary = 3000, min_equity = 0.6", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=c&min_salary=3000&min_equity=0.6`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
  });

});


describe("POST /jobs/ ", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");   
    
    await Company.post(Object.assign({},company1));
  });

  it("can add a new job", async () => {
    // can post to database
    const resp = await request(app)
      .post(`/jobs/`)
      .send(job1);
    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/jobs/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.jobs.length).toEqual(1);
    expect(resp2.body.jobs[0].job.title).toEqual(job1.title)
  });  

});


describe("GET /jobs/:id", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    await Company.post(Object.assign({},company1));
    
  });

  it("can get by jobs handle", async () => {
    const job = await Job.post(Object.assign({},job1));
    // can get from database
    const resp = await request(app)
      .get(`/jobs/?id=${job.id}`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
    expect(resp.body.jobs[0].job.title).toEqual(job1.title);
  });  

});


describe("PATCH /jobs/:id", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({},company1));
  });

  it("can update salary", async () => {
    const job = await Job.post(Object.assign({},job1));
    const patchData = {"_token": token, "username": username, "salary": 100000.00};
    const resp = await request(app)
      .patch(`/jobs/?id=${job.id}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(+resp.body.jobs.salary).toBe(patchData.salary);
  });  

});

describe("DELETE /jobs/:id", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({},company1)); 
  });

  it("can delete company by handle", async () => {
    const job = await Job.post(Object.assign({},job1));
    const resp = await request(app)
      .delete(`/jobs/?id=${job.id}`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Job deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
