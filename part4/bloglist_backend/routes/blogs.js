import express from "express";
import Blog from "../models/blog.js";

const blogsRouter = express.Router();

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  return response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const user = request.user;
  const { title, author, url, likes } = request.body;
  const blog = new Blog({ title, author, url, likes, user: user._id });
  const savedBlog = await blog.save();

  user.blogs.push(savedBlog._id);
  await user.save();
  await savedBlog.populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  return response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const { id } = request.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({
      error: "only the creator of the blog can delete it",
    });
  }

  await Blog.findByIdAndDelete(id);

  return response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const { id } = request.params;
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({
      error: "only the creator of the blog can update it",
    });
  }

  blog.title = title || blog.title;
  blog.author = author || blog.author;
  blog.url = url || blog.url;
  blog.likes = likes || blog.likes;

  await blog.save();
  await blog.populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  return response.json(blog);
});

export default blogsRouter;
