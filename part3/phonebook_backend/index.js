import express from "express";
import morgan from "morgan";

const PORT = 3001;
const app = express();

app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

let id = 5;

app.get("/persons", (req, res) => {
  res.json(persons);
});

app.post("/persons", (req, res) => {
  const { name, number } = req.body;

  if (name && number) {
    if (persons.find((person) => person.name === name)) {
      return res.status(400).json({ error: "name must be unique" });
    }

    const person = {
      id: id++,
      name,
      number,
    };

    persons.push(person);
    res.status(201).json(person);
  } else {
    res.status(400).json({ error: "name or number missing" });
  }
});

app.get("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = persons.findIndex((person) => person.id === id);

  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  let now = new Date();

  res.send(
    `<p>Phonebook has info for ${persons.length} ${
      persons.length == 1 ? "person" : "people"
    }</p><p>${now.toString()}</p>`
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
