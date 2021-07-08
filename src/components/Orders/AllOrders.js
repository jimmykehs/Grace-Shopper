import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../api";
import OrderCard from "./OrderCard.js";
import "./AllOrders.css";

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
      <h1 className="Title">All orders</h1>
      <div className="Orders-Container">
        {orders.map((order) => {
          return <OrderCard key={order.id} order={order} />;
        })}
      </div>
    </>
  );
};

export default AllOrders;
