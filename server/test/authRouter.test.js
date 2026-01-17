import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.dropDatabase();
});

describe("signup", () => {
  it("creates user in db", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "testuser",
      screenName: "Test User",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(mongoose.connection.db.collection("users")
      .findOne({ username: "testuser" })).resolves.toBeTruthy();
  });

  it("fails if user already exists", async () => {
    await mongoose.connection.db.collection("users").insertOne({
      username: "testuser",
      screenName: "Test User",
      password: "hashedpassword", // Assume password is hashed
    });

    const response = await request(app).post("/api/auth/signup").send({
      username: "testuser",
      screenName: "Test User",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
  });
});


