import React, { useEffect, useState } from "react";
import { getCart } from "../../api";
import CartItem from "./CartItem";
import "./Cart.css";
const Cart = ({ cart, setCart }) => {
  const [forceUpdate, setForceUpdate] = useState(true);
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
        <button className="CheckoutBtn">Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
