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

  describe("getting all users", () => {
    test("test user is returned", async () => {
      const response = await api.get("/api/users");

      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe(testUser.username);
    });
  });

  describe("adding a new user", () => {
    test("adding user increases user count by one", async () => {
      const initialCount = await User.countDocuments({});

      const newUser = {
        username: "newuser",
        name: "New User",
        password: "newpassword",
      };

      await api.post("/api/users").send(newUser);

      const response = await api.get("/api/users");

      expect(response.body).toHaveLength(initialCount + 1);
    });

    test("adding user with invalid password returns 400 and error message", async () => {
      const newUser = {
        username: "newuser",
        name: "New User",
        password: "np",
      };

      const response = await api.post("/api/users").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Password must be at least three characters long"
      );
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
