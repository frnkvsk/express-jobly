/** Test models/users.js */

const db = require("../../db");
const User = require("../../models/users");
const Job = require("../../models/jobs");
const Company = require("../../models/companies");
const TestData = require("../../helpers/testData");

const company1 = Object.assign({}, TestData.company1);
const company2 = Object.assign({}, TestData.company2);
const company3 = Object.assign({}, TestData.company3);
const company4 = Object.assign({}, TestData.company4);

const job1 = Object.assign({}, TestData.job1);
const job2 = Object.assign({}, TestData.job2);
const job3 = Object.assign({}, TestData.job3);
const job4 = Object.assign({}, TestData.job4);

const user1 = Object.assign({}, TestData.user1);
const user2 = Object.assign({}, TestData.user2);
const user3 = Object.assign({}, TestData.user3);
const user4 = Object.assign({}, TestData.user4);

const application1 = Object.assign({}, TestData.application1);
const application2 = Object.assign({}, TestData.application2);
const application3 = Object.assign({}, TestData.application3);
const application4 = Object.assign({}, TestData.application4);

describe("get()", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
    await User.post(user1);
    await User.post(user2);
    await User.post(user3);
    await User.post(user4);
  });

  it("test get all", async () => {    
    let result = await User.get();
    expect(result.length).toEqual(4);
  });
});

describe("post()", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("can post user", async () => {
    // can post to database
    const result = await User.post(user1);
    expect(result.username).toEqual(user1.username);

    // is data in database
    let result2 = await User.get(result.username);
    expect(result2.length).toEqual(1);
    expect(result2[0].username).toEqual(result.username);
  }); 

});

// describe("getByUsername( username )", () => {

//   beforeEach(async () => {
//     await db.query("DELETE FROM users");
//     await db.query("DELETE FROM applications");
//     await db.query("DELETE FROM jobs");
//     await db.query("DELETE FROM companies");
    
//     await Company.post(company1);
//     const job1 = await Job.post(job1);
//     const job2 = await Job.post(job2);
//     const job3 = await Job.post(job3);
//     const job4 = await Job.post(job4);
//     await User.post(user1);
//     await Job.post(id, state);

//   });

//   it("test getByUsername( username )", async () => {
//     const user = await User.post(user1);
//     const result = await User.getByUsername(user.username);
//     expect(result.username).toEqual(user.username);
//   });  

// });

describe("patch( username )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("test patch( username )", async () => {
    const user = await User.post(user1);
    // can patch
    const patchData = {email: "newemail@newemail.com"};
    const result = await User.patch(user.username, patchData);
    expect(result.email).toEqual(patchData.email);
  });  

});

describe("delete( id )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");    
  });

  it("test delete( handle )", async () => {
    const user = await User.post(user1);
    // can delete
    const result = await User.delete(user.username);
    expect(result.message).toEqual("User deleted");
    // is data deleted
    let result2 = await User.get();
    expect(result2.length).toEqual(0);
  });  

});

afterAll(async function() {
  await db.end();
});