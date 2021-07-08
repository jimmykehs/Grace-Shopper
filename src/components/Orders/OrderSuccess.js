import React, { useEffect } from "react";
import { createUserOrder, createGuestOrder } from "../../api";

const OrderSuccess = ({ setCart, cart }) => {
  useEffect(() => {
    async function createOrder() {
      const token = localStorage.getItem("token");
      if (token) {
        await createUserOrder(token);
      }
      setCart([]);
    }

    createOrder();
  }, []);
  return (
    <>
      <h1 className="Title">Your order has been placed!</h1>
    </>
  );
};

export default OrderSuccess;
