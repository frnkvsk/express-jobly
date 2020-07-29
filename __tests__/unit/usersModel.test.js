/** Test models/users.js */

const db = require("../../db");
const User = require("../../models/users");

const user1 = {username: "user1", password: "pw1", first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: false};
const user2 = {username: "user2", password: "pw2", first_name: "firstName2", last_name: "lastName2", email: "user2@user2.com", photo_url: "", is_admin: false};
const user3 = {username: "user3", password: "pw3", first_name: "firstName3", last_name: "lastName3", email: "user3@user3.com", photo_url: "", is_admin: false};
const user4 = {username: "user4", password: "pw4", first_name: "firstName4", last_name: "lastName4", email: "user4@user4.com", photo_url: "", is_admin: false};


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

describe("getByUsername( username )", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("test getByUsername( username )", async () => {
    const user = await User.post(user1);
    const result = await User.getByUsername(user.username);
    expect(result.username).toEqual(user.username);
  });  

});

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