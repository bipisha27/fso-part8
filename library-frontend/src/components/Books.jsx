import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "./queries";
import { useState } from "react";

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const result = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((book) => book.genres.includes(selectedGenre));

  const genres = [...new Set(books.flatMap((book) => book.genres))];

  return (
    <div>
      <h2>books</h2>

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

      <button onClick={() => setSelectedGenre("all")}>all genres</button>
    </div>
  );
};

export default Books;
