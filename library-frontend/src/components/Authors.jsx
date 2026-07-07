import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "./queries";
import { useState, useEffect } from "react";

const Authors = ({ show, token }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (result.data && result.data.allAuthors.length > 0 && name === "") {
      setName(result.data.allAuthors[0].name);
    }
  }, [result.data, name]);

  // useEffect runs after every render when `authors` or `name` changes.

  // if the authors have been loaded and no author is currently selected,

  // it automatically selects the first author so the dropdown and the

  // react state stays synchronized.

  if (!show) return null;
  if (result.loading) return <div>loading...</div>;

  const authors = result.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();
    await editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    });
    setBorn("");
  };

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
      {token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <select
                name="name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label>
              <input
                id="born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
