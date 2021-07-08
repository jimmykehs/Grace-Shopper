import React from "react";
import Products from "../Product/Product";

const OrderCard = ({ order }) => {
  console.log(order);
  const { id, status } = order;
  return (
    <>
      <h1>Order #{id}</h1>
      <h3>Status -- {status}</h3>
      {order.products.map((product) => {
        const { name, quantity } = product;
        return (
          <>
            <p>
              {name} X {quantity}
            </p>
          </>
        );
      })}
    </>
  );
};

export default OrderCard;
