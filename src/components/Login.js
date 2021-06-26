import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { userLogin } from "../api";

const Login = (props) => {
  const { setLoggedIn, message, setMessage } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="login" onSubmit={(event) => event.preventDefault()}>
      <h1>Login:</h1>
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder=""
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder=""
      />
      <button
        onClick={async (event) => {
          event.preventDefault();
          try {
            let submit = await userLogin(username, password);

            if (submit.error) {
              alert("There was an error logging in...");
            } else {
              setLoggedIn(true);
              return <Redirect to="/" />;
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Login
      </button>
    </form>
  );
};

export default Login;
