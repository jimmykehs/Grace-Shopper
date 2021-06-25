import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import "./app.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);

  return (
    <div className="App">
      <Router>
        <div className="header">
          <h1>UsedEgg</h1>
          <hr></hr>
          <Link className="link" to="/">
            View All Products
          </Link>
          <Link className="link" to="/mouse">
            Broken Mice
          </Link>
          <Link className="link" to="/keyboard">
            Broken Keyboard
          </Link>
          <Link className="userButtons" to="/cart">
            View Cart
          </Link>
          {!loggedIn ? (
            <Link className="userButtons" to="/register">
              Sign Up
            </Link>
          ) : null}
          {!loggedIn ? (
            <Link className="userButtons" to="/login">
              Login
            </Link>
          ) : null}
          {loggedIn ? (
            <Link className="userButtons" to="/logout">
              Logout
            </Link>
          ) : null}
          {admin ? (
            <Link className="userButtons" to="/new-admin">
              Create a New Admin
            </Link>
          ) : null}
          {admin ? (
            <Link className="userButtons" to="/users">
              View Users
            </Link>
          ) : null}
        </div>
      </Router>
    </div>
  );
};

export default App;
