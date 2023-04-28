import express from "express";
import morgan from "morgan";

import _mongoose from "./mongo.js";
import Person from "./models/persons.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req, _res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/persons", async (_req, res) => {
  const persons = await Person.find({});

  return res.json(persons);
});

app.post("/persons", async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const existingPerson = await Person.findOne({ name }).exec();

  if (existingPerson) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = new Person({ name, number });

  try {
    await person.save();
  } catch (error) {
    return next(error);
  }

  return res.status(201).json(person);
});

app.get("/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  let person = null;

  try {
    person = await Person.findById(id);
  } catch (error) {
    return next(error);
  }

  if (!person) {
    return res.status(404).end();
  }
  return res.json(person);
});

app.put("/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  let person = null;

  try {
    person = await Person.findById(id);
  } catch (error) {
    return next(error);
  }

  if (!person) {
    return res.status(404).end();
  }

  const { name, number } = req.body;

  if (!name && !number) {
    return res.status(400).json({ error: "name and number missing" });
  }

  if (name && (await Person.findOne({ name, _id: { $ne: id } }))) {
    return res.status(400).json({ error: "name must be unique" });
  }

  person.name = name || person.name;
  person.number = number || person.number;

  try {
    await person.save();
  } catch (error) {
    return next(error);
  }

  return res.json(person);
});

app.delete("/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  let person = null;

  try {
    person = await Person.findByIdAndRemove(id);
  } catch (error) {
    return next(error);
  }

  if (!person) {
    return res.status(404).end();
  }

  return res.status(204).end();
});

app.get("/info", async (_req, res) => {
  let now = new Date();
  let personsLength = (await Person.find({})).length;

  res.send(
    `<p>Phonebook has info for ${personsLength} ${
      personsLength === 1 ? "person" : "people"
    }</p><p>${now.toString()}</p>`
  );
});

const errorHandler = (error, _req, res, next) => {
  console.log(error.message);

  switch (error.name) {
    case "CastError":
      return res.status(400).send({ error: "Malformatted id" });
    case "ValidationError":
      return res.status(400).json({ error: error.message });
    default:
      return next(error);
  }
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
