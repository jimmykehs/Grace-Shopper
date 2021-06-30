import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import {
  Product,
  Users,
  Login,
  Register,
  Keyboards,
  Mouse,
  Headsets,
  CreateProduct,
} from "./components";
import { clearToken } from "./api";
import "./app.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

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
            Broken Keyboards
          </Link>
          <Link className="link" to="/headsets">
            Broken Headsets
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
            <Link
              className="userButtons"
              onClick={() => {
                clearToken();
                setLoggedIn(false);
                alert("You have logged out");
              }}
              to="/"
            >
              Logout
            </Link>
          ) : null}
          {admin ? (
            <Link className="userButtons" to="/users">
              View Users
            </Link>
          ) : null}
          {admin ? (
            <Link className="userButtons" to="/create-product">
              Create Product
            </Link>
          ) : null}
        </div>
        <main>
          <Switch>
            <Route exact path="/">
              <Product />
            </Route>
            <Route exact path="/keyboard">
              <Keyboards />
            </Route>
            <Route exact path="/mouse">
              <Mouse />
            </Route>
            <Route exact path="/headsets">
              <Headsets />
            </Route>
            <Route exact path="/users">
              <Users />
            </Route>
            <Route exact path="/create-product">
              <CreateProduct />
            </Route>
            <Route path="/login">
              <Login
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                setAdmin={setAdmin}
              />
            </Route>
            <Route path="/register">
              <Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export default App;
