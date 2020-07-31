const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const User = require("../../models/users");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTU5NjEyMzQ3MH0.FSt31q9RLpb6xDjtEmBNMeoi5Z8qjbQEJQp5AscXkHY";
const username = "user1";
const password = "password1";

const user1 = {"_token": token, username: "user1", password: password, first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: true};
const user2 = {"_token": token, username: "user2", password: "pw2", first_name: "firstName2", last_name: "lastName2", email: "user2@user2.com", photo_url: "", is_admin: false};

describe("Test users", () => {
  beforeAll(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies"); 
    
    await User.post(user1);
    await request(app)
      .post(`/login/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
  });

  it("test get all", async () => {
    let resp = await request(app)
      .get(`/users/`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
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
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp2.statusCode).toEqual(200);
    expect(resp2.body.users.length).toEqual(2);
    expect(resp2.body.users[1].username).toEqual(user2.username)
  });  

  it("can get by user username", async () => {
    // can get from database
    const resp = await request(app)
      .get(`/users/username?username=${user1.username}`)
      .send({
        "_token": token,
        "username": username,
        "password": password
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user.username).toEqual(user1.username);
  });  

  it("can update email", async () => {
    const patchData = {"_token": token, "email": "newemail1@newemail1.com"};
    const resp = await request(app)
      .patch(`/users/?username=${user1.username}`)
      .send(patchData);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user.email).toBe(patchData.email);
  });  

  it("can delete user by username", async () => {
    const resp = await request(app)
      .delete(`/users/?username=${user2.username}`)
      .send({
        "_token": token,
        "username": username
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.message).toEqual("User deleted");
  });  

});


afterAll(async function () {
  await db.end();
});
