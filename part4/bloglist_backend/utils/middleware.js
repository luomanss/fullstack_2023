import jwt from "jsonwebtoken";
import logger from "./logger.js";
import User from "../models/user.js";
import { SECRET } from "./config.js";

export const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  return next(error);
};

export const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const requestLogger = (request, _response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  return next();
};

export const tokenExtractor = (request, _response, next) => {
  const authorization = request.get("authorization");

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer") {
    return next();
  }

  request.token = token;

  return next();
};

export const userExtractor = async (request, _response, next) => {
  if (!request.token) {
    return next();
  }

  const decoded = jwt.verify(request.token, SECRET);

  if (!decoded.id) {
    logger.info("Found token, but it was invalid.");
    return next();
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    logger.info("Found id, but it returned no user");
    return next();
  }

  request.user = user;

  return next();
};
