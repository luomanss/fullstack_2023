import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/user.js";
import { decrypt } from "../utils/password.js";
import { SECRET } from "../utils/config.js";

const loginRouter = express.Router();

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await decrypt(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  return response.json({ token, id: user.id, username: user.username, name: user.name });
});

export default loginRouter;
