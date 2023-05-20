import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState(authors[0].name || "");
  const [born, setBorn] = useState(authors[0].born || 0);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target[0].value;
    const born = parseInt(event.target[1].value);

    editAuthor({ variables: { name, born } });
  };

  const handleChangeSelect = (event) => {
    event.preventDefault();

    const name = event.target.value;
    const author = authors.find((a) => a.name === name);

    setName(name);
    setBorn(author.born || 0);
  };

  return (
    <>
      <h2>Set birthday</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={handleChangeSelect} value={name}>
          {authors.map((a) => (
            <option key={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  );
};

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor authors={authors} />
    </div>
  );
};

export default Authors;
