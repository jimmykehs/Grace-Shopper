import React, { useEffect, useState } from "react";
import { getAllUserOrders } from "../../api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function getOrders() {
      const token = localStorage.getItem("token");
      const { data } = await getAllUserOrders(token);
      setOrders(data);
    }
    getOrders();
  }, []);
  return (
    <>
      <h1>Order History</h1>
    </>
  );
};

export default OrderHistory;
