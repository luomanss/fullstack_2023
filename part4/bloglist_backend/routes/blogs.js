import express from "express";
import Blog from "../models/blog.js";

const blogsRouter = express.Router();

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({});

  return response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  let savedBlog;

  try {
    savedBlog = await blog.save();
  } catch (error) {
    return next(error);
  }

  return response.status(201).json(savedBlog);
});

export default blogsRouter;
