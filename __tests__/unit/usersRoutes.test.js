const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const User = require("../../models/users");
const TestData = require("../../helpers/testData");

const token = TestData.token;

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

  describe("Test GET /users/ get all users", () => {

    it("should fail without sending token", async () => {
      let resp = await request(app)
      .get(`/users/`);
      expect(resp.statusCode).toEqual(401);
    });

    it("should successfully get all", async () => {
      let resp = await request(app)
        .get(`/users/`)
        .send(token);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.users.length).toEqual(1);
    });
  });

  describe("Test GET /users/[username]", () => {
    const user1 = Object.assign({}, TestData.user1);
    it("should fail to get user by username without token", async () => {
      const resp = await request(app)
        .get(`/users/${user1.username}`);
      expect(resp.statusCode).toEqual(401);
    }); 

    it("should get user by username", async () => {
      const user1 = Object.assign({}, TestData.user1);
      const resp = await request(app)
        .get(`/users/${user1.username}`)
        .send(user1);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.user.username).toEqual(user1.username);
    }); 
  });
  


  describe("Test POST /users/ add new user", () => {
    it("should fail add a new user, without sending a token", async () => {
      // can post to database
      let testUser = Object.assign({}, user2);
      // remove token value
      testUser._token = "";
      const resp = await request(app)
        .post(`/users/`)
        .send(testUser);
      expect(resp.statusCode).toEqual(401);
    }); 

    it("should successfully add a new user", async () => {
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
  });
   
  describe("Test PATCH /users/[username]", () => {
    it("should fail update email, with no token", async () => {
      const patchData = {"email": "newemail1@newemail1.com"};
      const resp = await request(app)
        .patch(`/users/${user1.username}`)
        .send(patchData);
      expect(resp.statusCode).toEqual(401);
    }); 

    it("should update email", async () => {
      const patchData = {"_token": token._token, "email": "newemail1@newemail1.com"};
      const resp = await request(app)
        .patch(`/users/${user1.username}`)
        .send(patchData);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.user.email).toBe(patchData.email);
    }); 
  });
   
  describe("Test DELETE /users/[username]", () => {
    it("can fail delete user by username, with no token", async () => {
      const resp = await request(app)
        .delete(`/users/${user2.username}`);
      expect(resp.statusCode).toEqual(401);
    });

    it("should delete user by username", async () => {
      const resp = await request(app)
        .delete(`/users/${user2.username}`)
        .send(token);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.message).toEqual("User deleted");
    });
  });
    

});


afterAll(async function () {
  await db.end();
});
