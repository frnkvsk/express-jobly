const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const User = require("../../models/users");


const user1 = {username: "user1", password: "pw1", first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: false};
const user2 = {username: "user2", password: "pw2", first_name: "firstName2", last_name: "lastName2", email: "user2@user2.com", photo_url: "", is_admin: false};
const user3 = {username: "user3", password: "pw3", first_name: "firstName3", last_name: "lastName3", email: "user3@user3.com", photo_url: "", is_admin: false};
const user4 = {username: "user4", password: "pw4", first_name: "firstName4", last_name: "lastName4", email: "user4@user4.com", photo_url: "", is_admin: false};


describe("GET /users/", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
    
    await User.post(user1);
    await User.post(user2);
    await User.post(user3);
    await User.post(user4);
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/users/`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.users.length).toEqual(4);
  });

  
});


describe("POST /users/ ", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("can add a new user", async () => {
    // can post to database
    const resp = await request(app)
      .post(`/users/`)
      .send(user1);
    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/users/`);
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.users.length).toEqual(1);
    expect(resp2.body.users[0].username).toEqual(user1.username)
  });  

});


describe("GET /users/:handle", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");    
  });

  it("can get by user username", async () => {
    const user = await User.post(user1);
    // can get from database
    const resp = await request(app)
      .get(`/users/?username=${user.username}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.users.length).toEqual(1);
    expect(resp.body.users[0].username).toEqual(user1.username);
  });  

});


describe("PATCH /users/:username", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("can update email", async () => {
    const user = await User.post(user1);
    const patchData = {"email": "newemail1@newemail1.com"};
    const resp = await request(app)
      .patch(`/users/?username=${user.username}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user.email).toBe(patchData.email);
  });  

});

describe("DELETE /users/:username", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  it("can delete user by username", async () => {
    const user = await User.post(user1);
    const resp = await request(app)
      .delete(`/users/?username=${user.username}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("User deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
