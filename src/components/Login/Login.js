import React, { useState } from "react";
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

            if (submit.name) {
              alert(submit.message);
            } else {
              if (submit.user.admin === true) {
                loggedAdmin();
              }
              setAdmin(submit.user.admin);
              setLoggedIn(true);
              setUser(username);
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
