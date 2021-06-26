import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { userRegister } from "../api";

const Register = (props) => {
  const { setLoggedIn } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form className="register" onSubmit={(event) => event.preventDefault()}>
      <h1>Register:</h1>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder=""
      />
      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder=""
      />
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
            let submit = await userRegister(name, email, username, password);

            if (submit.error) {
              alert("There was an error registering...");
            } else {
              setLoggedIn(true);
              return <Redirect to="/" />;
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Register
      </button>
    </form>
  );
};

export default Register;
