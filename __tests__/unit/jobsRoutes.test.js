const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/companies");
const Job = require("../../models/jobs");
const User = require("../../models/users");

const TestData = require("../../helpers/testData");

const token = TestData.token;

const company1 = Object.assign({}, TestData.company1);

const user1 = Object.assign({}, TestData.user1);

const job1 = Object.assign({}, TestData.job1);
const job2 = Object.assign({}, TestData.job2);
const job3 = Object.assign({}, TestData.job3);
const job4 = Object.assign({}, TestData.job4);

describe("GET /jobs/ search, min_salary, min_equity", () => {

  beforeAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies"); 
    
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({username: "user1", password: "password1"});
    await Company.post(Object.assign({},company1));
    await Job.post(Object.assign({},job1));
    await Job.post(Object.assign({},job2));
    await Job.post(Object.assign({},job3));
    await Job.post(Object.assign({},job4));
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/jobs/`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(4);
  });

  it("test get search = b", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=b`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
  });

  it("test get min_salary = 3000", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_salary=3000`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get min_equity = 0.4", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_equity=0.4`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get search = c, min_salary = 3000, min_equity = 0.6", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=c&min_salary=3000&min_equity=0.6`)
      .send(token);
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
      .send(token);
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
      .send(token);
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
    const patchData = {"_token": token._token, "username": token.username, "salary": 100000.00};
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
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Job deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
