/** Test models/companies.js */

const db = require("../../db");
const Company = require("../../models/companies");
const Job = require("../../models/jobs");

const data1 = {handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
const data2 = {handle: "compB", name: "CompanyB", num_employees: 25, description: "The Company", logo_url: ""};
const data3 = {handle: "compC", name: "CompanyC", num_employees: 75, description: "The Company", logo_url: ""};
const data4 = {handle: "compD", name: "CompanyD", num_employees: 100, description: "The Company", logo_url: ""};

const job1 = {title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
const job2 = {title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
const job3 = {title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
const job4 = {title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};

describe("get( { search, min_employees, max_employees } )", () => {

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
    let data = {search:"", min_employees:0, max_employees:0};
    let result = await Company.get(data);
    expect(result.length).toEqual(4);
    expect(true).toEqual(true)
  });

  it("test get search = b", async () => {
    let data = {search:"b", min_employees:0, max_employees:0};
    let result = await Company.get(data);
    expect(result.length).toEqual(1);
    expect(result[0].companydata.handle).toMatch(/b/i);
  });

  it("test get min_employees = 24", async () => {
    let data = {search:"", min_employees:24, max_employees:200};
    let result = await Company.get(data);
    expect(result.length).toEqual(3);
  });

  it("test get max_employees = 76", async () => {
    let data = {search:"", min_employees:0, max_employees:76};
    let result = await Company.get(data);
    expect(result.length).toEqual(3);
  });

});

describe("post( {handle, name, num_employees, description, logo_url} )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
  });

  it("test post companyData", async () => {
    // can post to database
    const result = await Company.post(data1);
    expect(result.handle).toEqual("compA");

    // is data in database
    let data2 = {search:"", min_employees:0, max_employees:0};
    let result2 = await Company.get(data2);
    expect(result2.length).toEqual(1);
  });  

});

describe("getByHandle( handle )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    await Company.post(data1);
    await Job.post(job1);
    await Job.post(job2);
    await Job.post(job3);
    await Job.post(job4);
  });

  it("test getByHandle( handle )", async () => {
    // can get from database
    const result = await Company.getByHandle(data1.handle);
    expect(result.handle).toEqual(data1.handle);
    expect(result.jobs.length).toEqual(4);
    expect(result.jobs[0].job.company_handle).toEqual(data1.handle);
    expect(result.jobs[1].job.company_handle).toEqual(data1.handle);
    expect(result.jobs[2].job.company_handle).toEqual(data1.handle);
    expect(result.jobs[3].job.company_handle).toEqual(data1.handle);
  });  

});

describe("patch( handle )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(data1);
  });

  it("test patch( handle )", async () => {
    // can patch
    const patchData = {num_employees: 44};
    const result = await Company.patch(data1.handle, patchData);
    expect(result.num_employees).toEqual(patchData.num_employees);
  });  

});

describe("delete( handle )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(data1);
  });

  it("test delete( handle )", async () => {
    // can delete
    const result = await Company.delete(data1.handle);
    expect(result.message).toEqual("Company deleted");
    // is data deleted
    let data2 = {search:"", min_employees:0, max_employees:0};
    let result2 = await Company.get(data2);
    expect(result2.length).toEqual(0);
  });  

});

afterAll(async function() {
  await db.end();
});