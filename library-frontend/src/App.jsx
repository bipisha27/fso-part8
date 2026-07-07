import { useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { ME } from "./components/queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const userResult = useQuery(ME, { skip: !token });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>logout</button>

            <button onClick={() => setPage("recommend")}>recommend</button>
          </>
        )}

        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add" && token} />

      <LoginForm
        show={page === "login"}
        setToken={(t) => {
          setToken(t);
          setPage("authors");
        }}
        setError={notify}
      />

      <Recommendations
        show={page === "recommend"}
        favoriteGenre={userResult.data?.me?.favoriteGenre}
      />
    </div>
  );
};

export default App;
