import React, { useEffect, useState } from "react";
import { getAllUserOrders } from "../../api";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function getOrders() {
      const token = localStorage.getItem("token");
      const data = await getAllUserOrders(token);
      setOrders(data);
    }
    getOrders();
  }, []);

  return (
    <>
      <h1 className="Title">Order History</h1>
      <div id="All-Orders">
        {orders.map((item) => {
          const { id, status, products } = item;
          return (
            <>
              <div className="order">
                <h1>
                  Order ID: {id} ---- Status: {status}
                </h1>
                {products.map((product) => {
                  const { name, quantity } = product;
                  return (
                    <p>
                      {name} x {quantity}
                    </p>
                  );
                })}
              </div>
            </>
          );
        })}
        {/* {orders.map((item, index) => {
          const { id, name, quantity, status } = item;
          let newDiv = document.getElementById(item.id);
          if (newDiv === null) {
            newDiv = document.createElement("div");
            newDiv.setAttribute("id", id);
            newDiv.setAttribute("class", "order");
            const orderHeader = document.createElement("h1");
            const orderID = document.createTextNode(
              `Order ID: ${id} ---- Status: ${status}`
            );
            orderHeader.appendChild(orderID);
            newDiv.appendChild(orderHeader);
            document.getElementById("All-Orders").appendChild(newDiv);
          }
          const itemNameEl = document.createElement("p");
          const itemName = document.createTextNode(`${name} X ${quantity}`);
          itemNameEl.appendChild(itemName);

          document.getElementById(id).appendChild(itemNameEl);
        })} */}
      </div>
    </>
  );
};

export default OrderHistory;
