import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { userLogin, loggedAdmin } from "../../api";
import "./Login.css";

const Login = (props) => {
  const { setLoggedIn, setAdmin, setUser } = props;

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
            setAdmin(submit.user.admin);
            if (submit.user.admin === true) {
              loggedAdmin();
            }

            if (submit.name) {
              alert(submit.message);
            } else {
              setLoggedIn(true);
              setUser(username);
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
