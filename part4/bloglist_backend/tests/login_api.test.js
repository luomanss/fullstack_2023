import supertest from "supertest";
import bcrypt from "bcrypt";
import mongoose from "../utils/mongoose.js";
import app from "../app.js";
import User from "../models/user.js";

const api = supertest(app);

describe("when there is initially one user saved", () => {
  const testPassword = "testpassword";
  const testUser = {
    username: "testuser",
    name: "Test User",
    passwordHash: bcrypt.hashSync(testPassword, 10),
  };

  beforeAll(async () => {
    await User.deleteMany({});

    const users = new User(testUser);

    await users.save();
  });

  describe("logging in", () => {
    test("logging in with valid username and password returns token", async () => {
      const response = await api
        .post("/api/login")
        .send({ username: testUser.username, password: testPassword });

      expect(response.body.token).toBeDefined();
    });

    test("logging in with invalid username and password returns 401", async () => {
      const response = await api
        .post("/api/login")
        .send({ username: testUser.username, password: "wrongpassword" });

      expect(response.status).toBe(401);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
