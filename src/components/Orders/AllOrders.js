import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api";
import OrderCard from "./OrderCard.js";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await getAllOrders();
      setOrders(data);
    })();
  }, []);

  return (
    <>
      <h1>All orders</h1>
      {orders.map((order) => {
        return <OrderCard order={order} />;
      })}
    </>
  );
};

export default AllOrders;
