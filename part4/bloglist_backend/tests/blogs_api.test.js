import supertest from "supertest";
import mongoose from "../utils/mongoose.js";
import app from "../app.js";
import Blog from "../models/blog.js";

const api = supertest(app);

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

afterAll(() => {
  mongoose.connection.close();
});
