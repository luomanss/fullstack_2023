import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_WITH_GENRE, ALL_GENRES } from "../queries";

const Books = ({ show }) => {
  const books_query = useQuery(ALL_BOOKS);
  const genres_query = useQuery(ALL_GENRES);
  const [genre, setGenre] = useState(null);
  const [getBooks, books_with_genre_query] = useLazyQuery(
    ALL_BOOKS_WITH_GENRE,
    {
      variables: { genre },
    }
  );

  if (!show) {
    return null;
  }

  if (
    (!genre && books_query.loading) ||
    genres_query.loading ||
    (genre && books_with_genre_query.loading)
  ) {
    return <div>loading...</div>;
  }

  const books = genre
    ? books_with_genre_query.data.allBooks
    : books_query.data.allBooks;
  const genres = genres_query.data.allGenres;

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <strong>{genre}</strong>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              getBooks();
              setGenre(genre);
            }}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
