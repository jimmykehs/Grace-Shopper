import React, { useEffect } from "react";
import { getCart } from "../../api";
import CartItem from "./CartItem";
import "./Cart.css";
import { checkoutUser } from "../../api";
const Cart = ({ cart, setCart, loggedIn }) => {
  const token = localStorage.getItem("token");
  let total = 0.0;

  useEffect(() => {
    async function fetchCart(token) {
      const fetchedCart = await getCart(token);
      setCart(fetchedCart);
    }
    if (token) {
      fetchCart(token);
    }
  }, []);

  const checkout = async () => {
    const url = await checkoutUser(cart);
    window.location = url;
  };

  return (
    <div className="CartCards">
      {cart.map((item, index) => {
        total += item.price * item.quantity;
        return (
          <CartItem
            key={index}
            index={index}
            item={item}
            token={token}
            setCart={setCart}
            cart={cart}
          />
        );
      })}
      <div className="Checkout-Container">
        <h1 className="TotalPrice">TOTAL: ${total.toFixed(2)}</h1>
        <button
          className="CheckoutBtn"
          onClick={() => {
            if (loggedIn) {
              checkout();
            } else {
              alert("Please log in or register to checkout");
            }
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
