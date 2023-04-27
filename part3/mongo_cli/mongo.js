import mongoose from "mongoose";

if (process.env.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.yllyb4t.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  const persons = await Person.find({});

  console.log("phonebook:");
  persons.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  try {
    await person.save();
    console.log(`added ${name} number ${number} to phonebook`);
  } catch (error) {
    console.log(error);
  }
}

mongoose.connection.close();
