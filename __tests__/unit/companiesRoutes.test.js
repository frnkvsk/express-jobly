const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/companies");
const User = require("../../models/users");
const Job = require("../../models/jobs");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTU5NjEyMzQ3MH0.FSt31q9RLpb6xDjtEmBNMeoi5Z8qjbQEJQp5AscXkHY";
const username = "user1";
const password = "password1";

const user1 = {"_token": token, username: "user1", password: password, first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: true};

const company1 = {"_token": token, "username": username, handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
const company2 = {"_token": token, "username": username, handle: "compB", name: "CompanyB", num_employees: 25, description: "The Company", logo_url: ""};
const company3 = {"_token": token, "username": username, handle: "compC", name: "CompanyC", num_employees: 75, description: "The Company", logo_url: ""};
const company4 = {"_token": token, "username": username, handle: "compD", name: "CompanyD", num_employees: 100, description: "The Company", logo_url: ""};

const job1 = {"_token": token, title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
const job2 = {"_token": token, title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
const job3 = {"_token": token, title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
const job4 = {"_token": token, title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};


describe("GET /companies/ search, min_employees, max_employees", () => {

  beforeAll(async () => {
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
    await Company.post(company2);
    await Company.post(company3);
    await Company.post(company4);
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/companies/`)
      .send({
        "_token": token
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(4);
  });

  it("test get search = b", async () => {    
    let resp = await request(app)
      .get(`/companies/?search=b`)
      .send({
        "_token": token
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(1);
    expect(true).toEqual(true)
  });

  it("test get min_employees = 24", async () => {
    let resp = await request(app)
      .get(`/companies/?min_employees=24&max_employees=20000`)
      .send({
        "_token": token
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?max_employees=76`)
      .send({
        "_token": token
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get search = c, min_employees = 24, max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?search=c&min_employees=24&max_employees=76`)
      .send({
        "_token": token
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(2);
  });

});


describe("POST /companies/ data = {handle, name, num_employees, description, logo_url}", () => {
  
  it("can add a new company", async () => {
    await db.query("DELETE FROM companies"); 
    await db.query("DELETE FROM users");
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    // can post to database
    const resp = await request(app)
      .post(`/companies/`)
      .send(Object.assign({}, company1));

    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/companies/`)
      .send({
        "_token": token
      });
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

  it("can get by company handle", async () => {
    // can get from database
    const resp = await request(app)
      .get(`/companies/handle?handle=${company1.handle}`)
      .send({
        "_token": token
      });
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
    // await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({}, company1));
  });

  it("can update num_employees", async () => {
    const patchData = {"_token": token, "username": username, "num_employees": 4440};
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
    // await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(Object.assign({}, company1));
  });

  it("can delete company by handle", async () => {
    const resp = await request(app)
      .delete(`/companies/?handle=${company1.handle}`)
      .send({
        "_token": token,
        "username": username
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Company deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
