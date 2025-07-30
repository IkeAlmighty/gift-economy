const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Export your express app from server.js

const User = require("../models/User");
const Gift = require("../models/Gift");
const RequestModel = require("../models/Request");

let agent = null;

beforeAll(async () => {
  agent = request.agent(app);
});

afterEach(async () => {
  await User.deleteMany();
  await Gift.deleteMany();
  await RequestModel.deleteMany();
});

describe("Auth routes", () => {
  it("should sign up a new user", async () => {
    const res = await agent.post("/auth/signup").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User created");
  });

  it("should sign in a user and set a cookie", async () => {
    await agent
      .post("/auth/signup")
      .send({ username: "testuser", password: "password123" });
    const res = await agent
      .post("/auth/signin")
      .send({ username: "testuser", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should sign out the user", async () => {
    const res = await agent.post("/auth/signout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Signed out");
  });
});

describe("Gift and Request routes", () => {
  beforeEach(async () => {
    await agent
      .post("/auth/signup")
      .send({ username: "giftuser", password: "pass" });
    await agent
      .post("/auth/signin")
      .send({ username: "giftuser", password: "pass" });
  });

  it("should create a gift and return it", async () => {
    const res = await agent.post("/api/gifts").send({
      title: "Book",
      description: "A good read",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Book");
  });

  it("should create a request and return it", async () => {
    const res = await agent.post("/api/requests").send({
      title: "Need blanket",
      description: "For winter",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Need blanket");
  });

  it("should get all gifts", async () => {
    await agent
      .post("/api/gifts")
      .send({ title: "Chair", description: "Wooden" });
    const res = await agent.get("/api/gifts");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get all requests", async () => {
    await agent
      .post("/api/requests")
      .send({ title: "Coat", description: "Winter coat" });
    const res = await agent.get("/api/requests");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
