import supertest from "supertest";
import mongoose from "../utils/mongoose.js";
import app from "../app.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import { encrypt } from "../utils/password.js";

const api = supertest(app);
const testUsers = [
  {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
    passwordHash: await encrypt("testpassword"),
  },
  {
    username: "testuser2",
    name: "Test User 2",
    password: "testpassword2",
    passwordHash: await encrypt("testpassword2"),
  },
];

beforeAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  for (const testUser of testUsers) {
    const user = new User(testUser);
    const savedUser = await user.save();

    testUser.id = savedUser._id;
  }
});

describe("when there are initially some blogs saved", () => {
  const initialBlogs = [
    {
      title: "Test Blog 1",
      author: "Test Author 1",
      url: "http://testurl1.com",
      likes: 1,
    },
    {
      title: "Test Blog 2",
      author: "Test Author 2",
      url: "http://testurl2.com",
      likes: 2,
    },
  ];

  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogs = initialBlogs
      .map((blog, index) => new Blog({ ...blog, user: testUsers[index].id }))
      .map((blog) => blog.save());

    await Promise.all(blogs);
  });

  describe("getting all blogs", () => {
    test("all blogs are returned", async () => {
      const response = await api.get("/api/blogs");

      expect(response.body).toHaveLength(initialBlogs.length);
    });

    test("all blogs have an id property", async () => {
      const response = await api.get("/api/blogs");

      response.body.forEach((blog) => {
        expect(blog.id).toBeDefined();
      });
    });

    test("all blogs have a user property", async () => {
      const response = await api.get("/api/blogs");

      response.body.forEach((blog) => {
        expect(blog.user).toBeDefined();
      });
    });
  });

  describe("without authentication", () => {
    describe("adding a new blog", () => {
      test("adding blog returns 401", async () => {
        const newBlog = {
          title: "Test Blog",
          content: "Test Content",
          url: "http://testurl.com",
        };

        const response = await api.post("/api/blogs").send(newBlog);

        expect(response.status).toBe(401);
      });
    });

    describe("deleting a blog", () => {
      test("deleting blog returns 401", async () => {
        const response = await api.delete(`/api/blogs/${initialBlogs[0].id}`);

        expect(response.status).toBe(401);
      });
    });

    describe("updating a blog", () => {
      test("updating blog returns 401", async () => {
        const response = await api.put(`/api/blogs/${initialBlogs[0].id}`);

        expect(response.status).toBe(401);
      });
    });
  });

  describe("with authentication", () => {
    let token = null;

    beforeAll(async () => {
      const response = await api.post("/api/login").send({
        username: testUsers[0].username,
        password: testUsers[0].password,
      });

      token = response.body.token;
    });

    describe("adding a new blog", () => {
      test("adding blog increases blog count by 1", async () => {
        const newBlog = {
          title: "Test Blog",
          content: "Test Content",
          url: "http://testurl.com",
        };

        await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog);

        const response = await api.get("/api/blogs");

        expect(response.body).toHaveLength(initialBlogs.length + 1);
      });

      test("blog defaults to 0 likes", async () => {
        const newBlog = {
          title: "Test Blog",
          content: "Test Content",
          url: "http://testurl.com",
        };

        const response = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog);

        expect(response.body.likes).toBe(0);
      });

      test("blog without title and url returns 400", async () => {
        let newBlog = {
          content: "Test Content",
          url: "http://testurl.com",
        };

        let response = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog);

        expect(response.status).toBe(400);

        newBlog = {
          title: "Test Blog",
          content: "Test Content",
        };

        response = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog);

        expect(response.status).toBe(400);
      });

      test("adding a blog also adds it to the user's blogs", async () => {
        const newBlog = {
          title: "Test Blog",
          content: "Test Content",
          url: "http://testurl.com",
        };

        const result = await api
          .post("/api/blogs")
          .set("Authorization", `Bearer ${token}`)
          .send(newBlog);

        const user = await User.findById(testUsers[0].id);

        expect(user.blogs.map((id) => id.toString())).toContainEqual(
          result.body.id
        );
      });
    });

    describe("deleting a blog", () => {
      test("blog can be deleted", async () => {
        const blogs = await Blog.find({});

        const response = await api
          .delete(`/api/blogs/${blogs[0].id}`)
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(204);
      });

      test("deleting with non-existent id returns 404", async () => {
        // TODO: Make sure this id doesn't exist in the database
        const response = await api
          .delete("/api/blogs/507f1f77bcf86cd799439011")
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(404);
      });

      test("deleting with invalid id returns 400", async () => {
        const response = await api
          .delete("/api/blogs/1nv4l1d")
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(400);
      });

      test("deleting other user's blog returns 401", async () => {
        const blogs = await Blog.find({});

        const response = await api
          .delete(`/api/blogs/${blogs[1].id}`)
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(401);
      });
    });

    describe("updating a blog", () => {
      test("blog can be updated", async () => {
        const blogs = await Blog.find({});

        const updatedBlog = {
          title: "Updated Blog",
        };

        const response = await api
          .put(`/api/blogs/${blogs[0].id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(updatedBlog);

        expect(response.body.title).toBe(updatedBlog.title);
      });

      test("updating with non-existent id returns 404", async () => {
        const response = await api
          .put("/api/blogs/507f1f77bcf86cd799439011")
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(404);
      });

      test("updating with invalid id returns 400", async () => {
        const response = await api
          .put("/api/blogs/1nv4l1d")
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.status).toBe(400);
      });

      test("updating a blog populates user when returning", async () => {
        const blogs = await Blog.find({});

        const response = await api
          .put(`/api/blogs/${blogs[0].id}`)
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe(testUsers[0].username);
        expect(response.body.user.name).toBe(testUsers[0].name);
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
