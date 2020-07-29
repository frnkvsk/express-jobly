const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/companies");
const Job = require("../../models/jobs");

const company1 = {handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
const job1 = {title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
const job2 = {title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
const job3 = {title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
const job4 = {title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};
const data = {search:"", min_salary:0, min_equity:0};

describe("GET /jobs/ search, min_salary, min_equity", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(company1);
    await Job.post(job1);
    await Job.post(job2);
    await Job.post(job3);
    await Job.post(job4);
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/jobs/`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(4);
  });

  it("test get search = b", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=b`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
  });

  it("test get min_salary = 3000", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_salary=3000`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get min_equity = 0.4", async () => {
    let resp = await request(app)
      .get(`/jobs/?min_equity=0.4`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(2);
  });

  it("test get search = c, min_salary = 3000, min_equity = 0.6", async () => {
    let resp = await request(app)
      .get(`/jobs/?search=c&min_salary=3000&min_equity=0.6`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.jobs.length).toEqual(1);
  });

});


describe("POST /jobs/ ", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");   
    
    await Company.post(company1);
  });

  it("can add a new job", async () => {
    // can post to database
    const resp = await request(app)
      .post(`/jobs/`)
      .send(job1);
    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/jobs/`);
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
    await Company.post(company1);
    
  });

  it("can get by jobs handle", async () => {
    const job = await Job.post(job1);
    // can get from database
    const resp = await request(app)
      .get(`/jobs/?id=${job.id}`);
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
    
    await Company.post(company1);
  });

  it("can update salary", async () => {
    const job = await Job.post(job1);
    const patchData = {"salary": 100000.00};
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
    
    await Company.post(company1);    
  });

  it("can delete company by handle", async () => {
    const job = await Job.post(job1);
    const resp = await request(app)
      .delete(`/jobs/?id=${job.id}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Job deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
