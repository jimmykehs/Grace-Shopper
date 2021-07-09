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
  MyAccount,
  OrderSuccess,
  OrderHistory,
  AllOrders,
  EditProducts,
} from "./components";
import { clearToken, clearAdmin } from "./api";
import { Egg } from "./Img";
import "./app.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState("");
  const [isOpen, setIsOpen] = useState();

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
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("Cart", JSON.stringify(cart));
  }, [cart]);

  const onLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="App">
      <Router>
        <Menu
          isOpen={isOpen}
          onOpen={() => {
            setIsOpen(true);
          }}
          right
        >
          <h1>User Options:</h1>
          {loggedIn ? (
            <Link
              className="userButtons"
              to="/my-orders"
              onClick={() => {
                onLinkClick();
              }}
            >
              My Orders
            </Link>
          ) : null}
          {loggedIn ? (
            <Link
              className="userButtons"
              to="/my-account"
              onClick={() => {
                onLinkClick();
              }}
            >
              My Account
            </Link>
          ) : null}
          <Link
            className="userButtons"
            to="/cart"
            onClick={() => {
              onLinkClick();
            }}
          >
            View Cart
          </Link>

          {!loggedIn ? (
            <Link
              className="userButtons"
              to="/register"
              onClick={() => {
                onLinkClick();
              }}
            >
              Sign Up
            </Link>
          ) : null}
          {!loggedIn ? (
            <Link
              className="userButtons"
              to="/login"
              onClick={() => {
                onLinkClick();
              }}
            >
              Login
            </Link>
          ) : null}
          {admin && <h1>Admin Options</h1>}
          {admin && (
            <Link
              className="userButtons"
              to="/all-orders"
              onClick={() => {
                onLinkClick();
              }}
            >
              All Orders
            </Link>
          )}
          {admin ? (
            <Link
              className="userButtons"
              to="/create-product"
              onClick={() => {
                onLinkClick();
              }}
            >
              Create Product
            </Link>
          ) : null}
          {admin && (
            <Link className="userButtons" to="/edit-products">
              Edit Products
            </Link>
          )}
          {admin ? (
            <Link
              className="userButtons"
              to="/users"
              onClick={() => {
                onLinkClick();
              }}
            >
              View Users
            </Link>
          ) : null}
          {loggedIn && <hr></hr>}
          {loggedIn ? (
            <Link
              className="userButtons"
              onClick={() => {
                clearToken();
                clearAdmin();
                setLoggedIn(false);
                setAdmin(false);
                localStorage.removeItem("user");
                alert("You have logged out");
                onLinkClick();
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
              <Product cart={cart} setCart={setCart} loggedIn={loggedIn} />
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
            <Route exact path="/edit-products">
              <EditProducts />
            </Route>
            <Route path="/login">
              <Login
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                setAdmin={setAdmin}
                user={user}
                setUser={setUser}
              />
            </Route>
            <Route path="/register">
              <Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </Route>

            <Route path="/my-account">
              <MyAccount user={user} setUser={setUser} />
            </Route>
            <Route exact path="/orderSuccess">
              <OrderSuccess cart={cart} setCart={setCart} />
            </Route>
            <Route exact path="/my-orders">
              <OrderHistory />
            </Route>
            <Route exact path="/all-orders">
              <AllOrders />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export default App;
