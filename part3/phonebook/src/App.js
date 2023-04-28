import { useEffect, useState } from "react";
import personService from "./services/persons";

const NotificationType = {
  SUCCESS: Symbol("success"),
  ERROR: Symbol("error"),
};

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const { message, type } = notification;
  const className = `notification ${
    type === NotificationType.SUCCESS ? "success" : "error"
  }`;

  return <div className={className}>{message}</div>;
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

const PersonForm = ({ persons, setPersons, onAddOrUpdate }) => {
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
        const response = await personService.update(person.id, updatedPerson);

        if (response.error) {
          await onAddOrUpdate(response.error, NotificationType.ERROR);
          return;
        }

        const updatedPersonWithId = response.person;

        if (updatedPersonWithId) {
          setPersons(
            persons.map((person) =>
              person.id === updatedPersonWithId.id
                ? updatedPersonWithId
                : person
            )
          );

          await onAddOrUpdate(
            `Updated ${updatedPersonWithId.name}`,
            NotificationType.SUCCESS
          );
        }
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    const response = await personService.create(newPerson);

    if (response.error) {
      await onAddOrUpdate(response.error, NotificationType.ERROR);
      return;
    }

    const newPersonWithId = response.person;

    if (newPersonWithId) {
      setPersons([...persons, newPersonWithId]);
      await onAddOrUpdate(
        `Added ${newPersonWithId.name}`,
        NotificationType.SUCCESS
      );
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = async (message, type) => {
    setNotification({ message, type });
    await sleep(2000);
    setNotification(null);
  };

  useEffect(() => {
    (async () => {
      const response = await personService.getAll();

      if (response.error) {
        await showNotification(response.error, NotificationType.ERROR);
        return;
      }

      const persons = response.persons;

      if (persons) {
        setPersons(persons);
      }
    })();
  }, []);

  const remove = async (id) => {
    const person = persons.find((person) => person.id === id);
    const shouldRemove = window.confirm(`Delete ${person.name}?`);

    if (shouldRemove) {
      const response = await personService.remove(id);

      if (response.error) {
        await showNotification(response.error, NotificationType.ERROR);
        return;
      }

      const success = response.success;

      setPersons(persons.filter((person) => person.id !== id));
      
      if (success) {
        await showNotification(
          `Deleted ${person.name}`,
          NotificationType.ERROR
        );
      } else {
        await showNotification(
          `Information of ${person.name} has already been removed from server`,
          NotificationType.ERROR
        );
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        onAddOrUpdate={showNotification}
      />
      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} remove={remove} />
    </div>
  );
};

export default App;
