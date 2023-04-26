import { useEffect, useState } from "react";
import personService from "./services/persons";

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const updatedPerson = { ...person, number: newNumber };
        const updatedPersonWithId = await personService.update(
          person.id,
          updatedPerson
        );

        if (updatedPersonWithId) {
          setPersons(
            persons.map((person) =>
              person.id === updatedPersonWithId.id
                ? updatedPersonWithId
                : person
            )
          );
        }
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    const newPersonWithId = await personService.create(newPerson);

    if (newPersonWithId) {
      setPersons([...persons, newPersonWithId]);
    }
  };

  return (
    <form onSubmit={submit}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filter, persons, remove }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={(e) => remove(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const persons = await personService.getAll();

      setPersons(persons);
    })();
  }, []);

  const remove = async (id) => {
    const person = persons.find((person) => person.id === id);
    const shouldRemove = window.confirm(`Delete ${person.name}?`);

    if (shouldRemove) {
      const removed = await personService.remove(id);

      if (removed) {
        setPersons(persons.filter((person) => person.id !== id));
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} remove={remove} />
    </div>
  );
};

export default App;
