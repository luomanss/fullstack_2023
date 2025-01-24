import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS_WITH_GENRE } from "../queries";

const Recommend = ({ show }) => {
  const me_query = useQuery(ME, {
    context: { show },
  });
  const favoriteGenre = me_query.data?.me?.favoriteGenre;
  const books_query = useQuery(ALL_BOOKS_WITH_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (!show) {
    return null;
  }

  if (me_query.loading || books_query.loading) {
    return <div>loading...</div>;
  }

  const books = books_query.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        {books.length > 0 ? "" : "no books"} in your favorite genre{" "}
        <strong>{favoriteGenre}</strong>
      </div>
      {books.length > 0 && (
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
      )}
    </div>
  );
};

export default Recommend;
