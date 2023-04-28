import supertest from "supertest";
import mongoose from "../utils/mongoose.js";
import app from "../app.js";
import Blog from "../models/blog.js";

const api = supertest(app);

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

    const notes = initialBlogs
      .map((blog) => new Blog(blog))
      .map((blog) => blog.save());

    await Promise.all(notes);
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
  });

  describe("adding a new blog", () => {
    test("adding blog increases blog count by 1", async () => {
      const newBlog = {
        title: "Test Blog",
        content: "Test Content",
        url: "http://testurl.com",
      };

      await api.post("/api/blogs").send(newBlog);

      const response = await api.get("/api/blogs");

      expect(response.body).toHaveLength(initialBlogs.length + 1);
    });

    test("blog defaults to 0 likes", async () => {
      const newBlog = {
        title: "Test Blog",
        content: "Test Content",
        url: "http://testurl.com",
      };

      const response = await api.post("/api/blogs").send(newBlog);

      expect(response.body.likes).toBe(0);
    });

    test("blog without title and url returns 400", async () => {
      let newBlog = {
        content: "Test Content",
        url: "http://testurl.com",
      };

      let response = await api.post("/api/blogs").send(newBlog);

      expect(response.status).toBe(400);

      newBlog = {
        title: "Test Blog",
        content: "Test Content",
      };

      response = await api.post("/api/blogs").send(newBlog);

      expect(response.status).toBe(400);
    });
  });

  describe("deleting a blog", () => {
    test("blog can be deleted", async () => {
      const blogs = await Blog.find({});

      const response = await api.delete(`/api/blogs/${blogs[0].id}`);

      expect(response.status).toBe(204);
    });

    test("deleting with non-existent id returns 404", async () => {
      // TODO: Make sure this id doesn't exist in the database
      const response = await api.delete("/api/blogs/507f1f77bcf86cd799439011");

      expect(response.status).toBe(404);
    });

    test("deleting with invalid id returns 400", async () => {
      const response = await api.delete("/api/blogs/1nv4l1d");

      expect(response.status).toBe(400);
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
        .send(updatedBlog);

      expect(response.body.title).toBe(updatedBlog.title);
    });

    test("updating with non-existent id returns 404", async () => {
      const response = await api.put("/api/blogs/507f1f77bcf86cd799439011");

      expect(response.status).toBe(404);
    });

    test("updating with invalid id returns 400", async () => {
      const response = await api.put("/api/blogs/1nv4l1d");

      expect(response.status).toBe(400);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
