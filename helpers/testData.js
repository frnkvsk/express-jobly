
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTU5NjEyMzQ3MH0.FSt31q9RLpb6xDjtEmBNMeoi5Z8qjbQEJQp5AscXkHY";

class TestData {
  static token = {"_token": token};

  static user1 = {"_token": token, username: "user1", password: "password1", first_name: "firstName1", last_name: "lastName1", email: "user1@user1.com", photo_url: "", is_admin: true};
  static user2 = {"_token": token, username: "user2", password: "pw2", first_name: "firstName2", last_name: "lastName2", email: "user2@user2.com", photo_url: "", is_admin: false};
  static user3 = {"_token": token, username: "user3", password: "pw3", first_name: "firstName3", last_name: "lastName3", email: "user3@user3.com", photo_url: "", is_admin: false};
  static user4 = {"_token": token, username: "user4", password: "pw4", first_name: "firstName4", last_name: "lastName4", email: "user4@user4.com", photo_url: "", is_admin: false};

  static company1 = {"_token": token, username: "user1", handle: "compA", name: "CompanyA", num_employees: 1, description: "The Company", logo_url: ""};
  static company2 = {"_token": token, username: "user1", handle: "compB", name: "CompanyB", num_employees: 25, description: "The Company", logo_url: ""};
  static company3 = {"_token": token, username: "user1", handle: "compC", name: "CompanyC", num_employees: 75, description: "The Company", logo_url: ""};
  static company4 = {"_token": token, username: "user1", handle: "compD", name: "CompanyD", num_employees: 100, description: "The Company", logo_url: ""};
  
  static job1 = {"_token": token, username: "user1", title: "manager", salary: 1000, equity: 0.2, company_handle: "compA"};
  static job2 = {"_token": token, username: "user1", title: "boss", salary: 3000, equity: 0.4, company_handle: "compA"};
  static job3 = {"_token": token, username: "user1", title: "manager", salary: 7000, equity: 0.6, company_handle: "compA"};
  static job4 = {"_token": token, username: "user1", title: "manager", salary: 10000, equity: 0.9, company_handle: "compA"};
  
  
  // set job_id before use
  static application1 = {username: "user1", job_id: -1, state: "interested"};
  static application2 = {username: "user1", job_id: -1, state: "interested"};
  static application3 = {username: "user1", job_id: -1, state: "interested"};
  static application4 = {username: "user1", job_id: -1, state: "interested"};
}

module.exports = TestData;