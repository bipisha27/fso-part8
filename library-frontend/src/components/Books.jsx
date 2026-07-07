import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "./queries";
import { useState } from "react";

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const allBooksResult = useQuery(ALL_BOOKS);

  const filteredResult = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
    fetchPolicy: "network-only",
  });

  if (!show) {
    return null;
  }

  if (allBooksResult.loading) {
    return <div>loading...</div>;
  }

  // const books = result.data.allBooks;
  // const filteredBooks =
  // selectedGenre === "all"
  // ? books
  // : books.filter((book) => book.genres.includes(selectedGenre));
  // const genres = [...new Set(books.flatMap((book) => book.genres))];

  const books = allBooksResult.data.allBooks;
  const genres = [...new Set(books.flatMap((book) => book.genres))]; //Set removes duplicates from the array, spread operator converts Set back into plain array

  const filteredBooks = selectedGenre
    ? (filteredResult.data?.allBooks ?? [])
    : books; //?. is used when query is still loading and data is undefined

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map((genre) => (
        <button key={genre} onClick={() => setSelectedGenre(genre)}>
          {genre}
        </button>
      ))}

      <button onClick={() => setSelectedGenre(null)}>all genres</button>
    </div>
  );
};

export default Books;
