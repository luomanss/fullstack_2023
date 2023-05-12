import express from "express";
import User from "../models/user.js";
import { encrypt } from "../utils/password.js";

const userRouter = express.Router();

userRouter.get("/", async (_request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });

  return response.json(users);
});

userRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "Password must be at least three characters long",
    });
  }

  const passwordHash = await encrypt(password);
  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();

    return response.json(savedUser);
  } catch (error) {
    return next(error);
  }
});

export default userRouter;
