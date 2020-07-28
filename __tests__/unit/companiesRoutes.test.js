const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const Company = require("../../models/companies");
const { patch } = require("../../models/companies");

const data1 = {handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
const data2 = {handle: "compB", name: "CompanyB", num_employees: 25, description: "The Company", logo_url: ""};
const data3 = {handle: "compC", name: "CompanyC", num_employees: 75, description: "The Company", logo_url: ""};
const data4 = {handle: "compD", name: "CompanyD", num_employees: 100, description: "The Company", logo_url: ""};

describe("GET /companies/ search, min_employees, max_employees", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(data1);
    await Company.post(data2);
    await Company.post(data3);
    await Company.post(data4);
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/companies/`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(4);
  });

  it("test get search = b", async () => {
    let resp = await request(app)
      .get(`/companies/?search=b`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(1);
  });

  it("test get min_employees = 24", async () => {
    let resp = await request(app)
      .get(`/companies/?min_employees=24&max_employees=20000`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?max_employees=76`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(3);
  });

  it("test get search = c, min_employees = 24, max_employees = 76", async () => {
    let resp = await request(app)
      .get(`/companies/?search=c&min_employees=24&max_employees=76`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(2);
  });

});


describe("POST /companies/ data = {handle, name, num_employees, description, logo_url}", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
  });

  it("can add a new company", async () => {
    // can post to database
    const resp = await request(app)
      .post(`/companies/`)
      .send(data1);
    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/companies/`);
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.companies.length).toEqual(1);
  });  

});


describe("GET /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    await Company.post(data1);
  });

  it("can get by company handle", async () => {
    // can get from database
    const resp = await request(app)
      .get(`/companies/?handle=${data1.handle}`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.companies.length).toEqual(1);
    expect(resp.body.companies[0].companydata.handle).toEqual(data1.handle);
  });  

});


describe("PATCH /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(data1);
  });

  it("can update num_employees", async () => {
    const patchData = {"num_employees": 4440};
    const resp = await request(app)
      .patch(`/companies/?handle=${data1.handle}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.company.num_employees).toEqual(patchData.num_employees);
  });  

});

describe("DELETE /companies/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(data1);
  });

  it("can delete company by handle", async () => {
    const resp = await request(app)
      .delete(`/companies/?handle=${data1.handle}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("Company deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
