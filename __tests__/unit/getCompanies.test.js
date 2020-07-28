const db = require("../../db");
const sqlForGetCompanies = require("../../helpers/getCompanies");

let testCompany1, testCompany2, testCompany3, testCompany4;
describe("getCompanies()", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");

    testCompany1 = await db.query(`INSERT INTO companies (handle, name, num_employees, description)
                    VALUES ('compA', 'CompanyA', 1, 'The test company')
                    RETURNING *`);
    testCompany2 = await db.query(`INSERT INTO companies (handle, name, num_employees, description)
                    VALUES ('compB', 'CompanyB', 25, 'The test company')
                    RETURNING *`);
    testCompany3 = await db.query(`INSERT INTO companies (handle, name, num_employees, description)
                    VALUES ('compC', 'CompanyC', 75, 'The test company')
                    RETURNING *`);
    testCompany4 = await db.query(`INSERT INTO companies (handle, name, num_employees, description)
                    VALUES ('compD', 'CompanyD', 100, 'The test company')
                    RETURNING *`);
  });

  it("test get all", async () => {
    let data = {search:"", min_employees:0, max_employees:0};
    let query1 = await sqlForGetCompanies(data);
    const result = await db.query(query1.query, query1.values);
    expect(result.rows.length).toEqual(4);
  });

  it("test get search = b", async () => {
    let data = {search:"b", min_employees:0, max_employees:0};
    let query1 = await sqlForGetCompanies(data);
    const result = await db.query(query1.query, query1.values);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].companydata.handle).toMatch(/b/i);
  });

  it("test get min_employees = 24", async () => {
    let data = {search:"", min_employees:24, max_employees:200};
    let query1 = await sqlForGetCompanies(data);
    const result = await db.query(query1.query, query1.values);
    expect(result.rows.length).toEqual(3);
  });

  it("test get max_employees = 76", async () => {
    let data = {search:"", min_employees:0, max_employees:76};
    let query1 = await sqlForGetCompanies(data);
    const result = await db.query(query1.query, query1.values);
    expect(result.rows.length).toEqual(3);
  });

});

afterAll(async function() {
  await db.end();
});