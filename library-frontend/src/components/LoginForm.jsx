import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "./queries";

const LoginForm = ({ show, setToken, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    },
    onError: (error) => {
      setError("login failed: " + error.message);
    },
  });

  if (!show) return null;

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
