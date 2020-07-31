const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const User = require("../../models/users");
const TestData = require("../../helpers/testData");



const token = TestData.token;
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTU5NjEyMzQ3MH0.FSt31q9RLpb6xDjtEmBNMeoi5Z8qjbQEJQp5AscXkHY";

// const username = "user1";
// const password = "password1";

const user1 = Object.assign({}, TestData.user1);
const user2 = Object.assign({}, TestData.user2);

describe("Test users", () => {
  beforeAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies"); 
    
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({username: "user1", password: "password1"});
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/users/`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.users.length).toEqual(1);
  });

  it("can add a new user", async () => {
    // can post to database
    const resp = await request(app)
      .post(`/users/`)
      .send(user2);
    expect(resp.statusCode).toEqual(200);

    // is data in database
    const resp2 = await request(app)
      .get(`/users/`)
      .send(token);
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.users.length).toEqual(2);
    expect(resp2.body.users[1].username).toEqual(user2.username)
  });  

  // it("can get by user username", async () => {
  //   // can get from database
  //   const resp = await request(app)
  //     .get(`/users/username?username=${user1.username}`)
  //     .send({
  //       "_token": token,
  //       "username": username,
  //       "password": password
  //     });
  //   expect(resp.statusCode).toEqual(200);
  //   expect(resp.body.user.username).toEqual(user1.username);
  // });  

  it("can update email", async () => {
    const patchData = {"_token": token._token, "email": "newemail1@newemail1.com"};
    const resp = await request(app)
      .patch(`/users/?username=${user1.username}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user.email).toBe(patchData.email);
  });  

  it("can delete user by username", async () => {
    const resp = await request(app)
      .delete(`/users/?username=${user2.username}`)
      .send(token);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("User deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
