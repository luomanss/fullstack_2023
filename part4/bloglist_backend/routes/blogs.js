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

blogsRouter.post("/", async (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const user = request.user;
  const { title, author, url, likes } = request.body;
  const blog = new Blog({ title, author, url, likes, user: user._id });

  try {
    const savedBlog = await blog.save();

    user.blogs.push(savedBlog._id);

    await user.save();
    await savedBlog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });

    return response.status(201).json(savedBlog);
  } catch (error) {
    return next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  try {
    const { id } = request.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).end();
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: "only the creator of the blog can delete it",
      });
    }

    await Blog.findByIdAndDelete(id);

    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

blogsRouter.patch("/:id", async (request, response, next) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const { title, author, url, likes } = request.body;

  if (!title && !author && !url && !likes) {
    return response.status(400).json({
      error: "no fields to update",
    });
  }

  const { id } = request.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).end();
    }

    if (author || title || url) {
      if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({
          error: "only the creator of the blog can update these fields",
        });
      }
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
  } catch (error) {
    return next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const { title, author, url, likes, user } = request.body;

  if (!title || !author || !url || !likes || !user) {
    return response.status(400).json({
      error: "missing fields",
    });
  }

  const { id } = request.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).end();
    }

    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(401).json({
        error: "only the creator of the blog can update it",
      });
    }

    blog.title = title;
    blog.author = author;
    blog.url = url;
    blog.likes = likes;
    blog.user = user;

    await blog.save();
    await blog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });

    return response.json(blog);
  } catch (error) {
    return next(error);
  }
});

blogsRouter.post("/:id/comments", async (request, response, next) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({
      error: "missing id",
    });
  }

  const { comment } = request.body;

  if (!comment) {
    return response.status(400).json({
      error: "missing comment",
    });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).end();
    }

    blog.comments.push(comment);

    await blog.save();
    await blog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });

    return response.status(201).json(blog);
  } catch (error) {
    return next(error);
  }
});

export default blogsRouter;
