import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "./queries";

const Recommendations = ({ show }) => {
  const bookResult = useQuery(ALL_BOOKS);
  const userResult = useQuery(ME);

  if (!show) {
    return null;
  }

  if (bookResult.loading || userResult.loading) {
    return <div>loading...</div>;
  }

  const books = bookResult.data.allBooks;
  const favoriteGenre = userResult.data.me.favoriteGenre;

  const recommendedBooks = books.filter((book) =>
    book.genres.includes(favoriteGenre),
  );

  return (
    <div>
      <h2>books</h2>
      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
