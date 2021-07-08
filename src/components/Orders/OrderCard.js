import React, { useState } from "react";
import { updateOrderStatus } from "../../api";

const OrderCard = ({ order }) => {
  const { id, status } = order;
  const [orderStatus, setOrderStatus] = useState(status);

  return (
    <div className="Order-Card">
      <h1>Order #{id}</h1>
      <div className="Status-Input">
        <label htmlFor="Order-status">Status</label>
        <select
          name="Order-status"
          value={orderStatus}
          onChange={(e) => {
            setOrderStatus(e.target.value);
          }}
          onBlur={async (e) => {
            await updateOrderStatus(id, orderStatus);
          }}
        >
          <option value="Created">Created</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {order.products.map((product) => {
        const { name, quantity } = product;
        return (
          <div className="Order-Item">
            <p className="Product-Quantity">{quantity} X</p>
            <p className="Product-Name">{name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCard;
