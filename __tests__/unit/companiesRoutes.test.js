const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/companies");
const User = require("../../models/users");
const Job = require("../../models/jobs");
const TestData = require("../../helpers/testData");

const token = TestData.token;

const company1 = Object.assign({}, TestData.company1);
const company2 = Object.assign({}, TestData.company2);
const company3 = Object.assign({}, TestData.company3);
const company4 = Object.assign({}, TestData.company4);

const user1 = Object.assign({}, TestData.user1);

const job1 = Object.assign({}, TestData.job1);
const job2 = Object.assign({}, TestData.job2);
const job3 = Object.assign({}, TestData.job3);
const job4 = Object.assign({}, TestData.job4);

describe("GET /companies/ search, min_employees, max_employees", () => {

  beforeAll(async () => {

    await db.query("DELETE FROM users");     
    await db.query("DELETE FROM jobs");     
    await db.query("DELETE FROM applications");     
    await db.query("DELETE FROM companies");     
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({username: "user1", password: "password1"});
    await Company.post(Object.assign({},company1));
    await Company.post(company2);
    await Company.post(company3);
    await Company.post(company4);
  });

  it("should fail get all, no token", async () => {
    let resp = await request(app)
      .get(`/companies/`);
    expect(resp.statusCode).toEqual(401);
  });

  it("should get all", async () => {
    let resp = await request(app)
      .get(`/companies/`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(4);
  });

  it("test get search = b", async () => {    
    let resp = await request(app)
      .get(`/companies/?search=b`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(1);
    expect(true).toEqual(true)
  });

  it("test get min_employees = 24", async () => {
    let resp = await request(app)
      .get(`/companies/?min_employees=24&max_employees=20000`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?max_employees=76`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get search = c, min_employees = 24, max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?search=c&min_employees=24&max_employees=76`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(2);
  });

});


describe("POST /companies/ data = {handle, name, num_employees, description, logo_url}", () => {
  
  it("should fail add a new company, no token", async () => {
    await db.query("DELETE FROM companies"); 
    await db.query("DELETE FROM users");
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({username: "user1", password: "password1"});
    // can post to database
    const comp1 = Object.assign({}, company1);
    // erase token
    comp1._token = "";
    const resp = await request(app)
      .post(`/companies/`)
      .send(comp1);

    expect(resp.statusCode).toEqual(401);
  });  

  it("should add a new company", async () => {
    await db.query("DELETE FROM companies"); 
    await db.query("DELETE FROM users");
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({username: "user1", password: "password1"});
    // can post to database
    const resp = await request(app)
      .post(`/companies/`)
      .send(Object.assign({}, company1));

    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/companies/`)
      .send(token);
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.companies.length).toEqual(1);
    expect(resp2.body.companies[0].handle).toEqual(company1.handle);
  });  

});


describe("GET /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    await Company.post(Object.assign({}, company1));
    await Job.post(job1);
    await Job.post(job2);
    await Job.post(job3);
    await Job.post(job4);
  });

  it("should fail get by company handle, no token", async () => {
    // can get from database
    const resp = await request(app)
      .get(`/companies/handle?handle=${company1.handle}`);
    expect(resp.statusCode).toEqual(401);
  });  

  it("should get by company handle", async () => {
    // can get from database
    const resp = await request(app)
      .get(`/companies/handle?handle=${company1.handle}`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.company.handle).toEqual(company1.handle);
    expect(resp.body.company.jobs.length).toEqual(4);
    expect(resp.body.company.jobs[0].job.company_handle).toEqual(company1.handle);
    expect(resp.body.company.jobs[1].job.company_handle).toEqual(company1.handle);
    expect(resp.body.company.jobs[2].job.company_handle).toEqual(company1.handle);
    expect(resp.body.company.jobs[3].job.company_handle).toEqual(company1.handle);
  });  

});


describe("PATCH /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({}, company1));
  });

  it("should fail update num_employees, no token", async () => {
    const patchData = {"_token": "", "username": token.username, "num_employees": 4440};
    const resp = await request(app)
      .patch(`/companies/?handle=${company1.handle}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(401);
  });  

  it("should update num_employees", async () => {
    const patchData = {"_token": token._token, "username": token.username, "num_employees": 4440};
    const resp = await request(app)
      .patch(`/companies/?handle=${company1.handle}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.company.num_employees).toEqual(patchData.num_employees);
  });  

});

describe("DELETE /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({}, company1));
  });

  it("should fail delete company by handle, no token", async () => {
    const resp = await request(app)
      .delete(`/companies/?handle=${company1.handle}`);
    expect(resp.statusCode).toEqual(401);
  });

  it("should delete company by handle", async () => {
    const resp = await request(app)
      .delete(`/companies/?handle=${company1.handle}`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Company deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
