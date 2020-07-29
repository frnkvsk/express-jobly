/** Test models/jobs.js */

const db = require("../../db");
const Job = require("../../models/jobs");
const Company = require("../../models/companies");

const company1 = {handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
const job1 = {title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
const job2 = {title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
const job3 = {title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
const job4 = {title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};
const data = {search:"", min_salary:0, min_equity:0};

describe("get( table, items, objName, {search, min_salary, min_equity} )", () => {

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
    let result = await Job.get(data);
    expect(result.length).toEqual(4);
  });

  it("test get search = b", async () => {
    data.search = "b";
    let result = await Job.get(data);
    expect(result.length).toEqual(1);
    data.search = "";
  });

  it("test get min_salary = 3000", async () => {
    data.min_salary = 3000;
    let result = await Job.get(data);
    expect(result.length).toEqual(2);
    data.min_salary = 0;
  });

  it("test get min_equity = 0.4", async () => {
    data.min_equity = 0.4;
    let result = await Job.get(data);
    expect(result.length).toEqual(2);
    data.min_equity = 0;
  });

  it("test get min_salary = 7000 min_equity = 0.4", async () => {
    data.min_salary = 7000;
    data.min_equity = 0.4;
    let result = await Job.get(data);
    expect(result.length).toEqual(1);
    data.min_salary = 0;
    data.min_equity = 0;
  });

  it("test get search = b min_salary = 7000 min_equity = 0.4", async () => {
    data.search = "b";
    data.min_salary = 7000;
    data.min_equity = 0.4;
    let result = await Job.get(data);
    expect(result.length).toEqual(0);
    data.search = "";
    data.min_salary = 0;
    data.min_equity = 0;
  });

});

describe("post()", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(company1);
  });

  it("can post job", async () => {
    // can post to database
    const result = await Job.post(job1);
    expect(result.company_handle).toEqual("compA");

    // is data in database
    let result2 = await Job.get(data);
    expect(result2.length).toEqual(1);
  }); 

});

describe("getById( id )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    await Company.post(company1);    
  });

  it("test getById( id )", async () => {
    const job = await Job.post(job1);
    const result = await Job.getById(job.id);
    expect(result[0].id).toEqual(job.id);
  });  

});

describe("patch( id )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(company1);
  });

  it("test patch( id )", async () => {
    const job = await Job.post(job1);
    // can patch
    const patchData = {salary: 44};
    const result = await Job.patch(job.id, patchData);
    expect(+result.salary).toEqual(patchData.salary);
  });  

});

describe("delete( id )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");
    
    await Company.post(company1);
    
  });

  it("test delete( handle )", async () => {
    const job = await Job.post(job1);
    // can delete
    const result = await Job.delete(job.id);
    expect(result.message).toEqual("Job deleted");
    // is data deleted
    let result2 = await Job.get(data);
    expect(result2.length).toEqual(0);
  });  

});

afterAll(async function() {
  await db.end();
});