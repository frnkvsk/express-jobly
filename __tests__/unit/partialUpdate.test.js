const db = require("../../db");
const sqlForPartialUpdate = require("../../helpers/partialUpdate");
const Company = require("../../models/companies");

describe("partialUpdate()", () => {
  let testCompany, test1;
  const data1 = {handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");    
    testCompany = await Company.post(data1);
  });

  it("should generate a proper partial update query with just 1 field", async () => {
    test1 = await sqlForPartialUpdate("companies", {"num_employees": 41}, "handle", data1.handle);
    expect(test1.values).toContain(41);
    expect(test1.query).toMatch(/companies/);
    expect(test1.query).toMatch(/num_employees/);
  });

  it("does query work on database", async () => {
    const result = await db.query(test1.query, test1.values);
    expect(result.rows[0].num_employees).toEqual(41);
  });

});

afterAll(async function() {
  await db.end();
});
