import express from "express";
import Blog from "../models/blog.js";

const blogsRouter = express.Router();

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({});

  return response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog= await blog.save();

  return response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return response.status(404).end();
  }

  return response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true }
  );

  if (!updatedBlog) {
    return response.status(404).end();
  }

  return response.json(updatedBlog);
});

export default blogsRouter;
