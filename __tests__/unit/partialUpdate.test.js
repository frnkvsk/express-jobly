const db = require("../../db");
const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  let testCompany, test1;
  beforeEach(async () => {

    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM companies");

    testCompany = await db.query(`INSERT INTO companies (handle, name, num_employees, description)
                    VALUES ('compA', 'CompanyA', 100, 'The test company')
                    RETURNING *`);

  });

  it("should generate a proper partial update query with just 1 field", () => {
    test1 = sqlForPartialUpdate("companies", {"num_employees": 41}, "handle", testCompany.rows[0].handle);
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
