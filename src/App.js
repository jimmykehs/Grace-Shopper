import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { stack as Menu } from "react-burger-menu";

import {
  Cart,
  Product,
  Users,
  Login,
  Register,
  Keyboards,
  Mouse,
  Headsets,
  CreateProduct,
} from "./components";
import { clearToken, clearAdmin } from "./api";
import { Egg } from "./Img";
import "./app.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("Cart")) {
      setCart(JSON.parse(localStorage.getItem("Cart")));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem("admin")) {
      setAdmin(true);
    }
  });
  useEffect(() => {
    localStorage.setItem("Cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="App">
      <Router>
        <Menu right>
          <h1>Options:</h1>
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
          {admin ? (
            <Link className="userButtons" to="/create-product">
              Create Product
            </Link>
          ) : null}
          {admin ? (
            <Link className="userButtons" to="/users">
              View Users
            </Link>
          ) : null}
          {loggedIn ? (
            <Link
              className="userButtons"
              onClick={() => {
                clearToken();
                clearAdmin();
                setLoggedIn(false);
                setAdmin(false);
                alert("You have logged out");
              }}
              to="/"
            >
              Logout
            </Link>
          ) : null}
        </Menu>
        <div className="header">
          <div>
            <h1>UsedEgg</h1>
          </div>
          <div className="logo-container">
            <img className="logo" src={Egg} />
          </div>
        </div>
        <div className="sortProducts">
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
        </div>
        <main>
          <Switch>
            <Route exact path="/">
              <Product cart={cart} setCart={setCart} />
            </Route>
            <Route exact path="/cart">
              <Cart cart={cart} setCart={setCart} loggedIn={loggedIn} />
            </Route>
            <Route exact path="/keyboard">
              <Keyboards cart={cart} />
            </Route>
            <Route exact path="/mouse">
              <Mouse cart={cart} />
            </Route>
            <Route exact path="/headsets">
              <Headsets cart={cart} />
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
