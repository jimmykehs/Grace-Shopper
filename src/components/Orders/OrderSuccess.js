import { useEffect } from "react";

const OrderSuccess = () => {
  useEffect(() => {
    async function getRecentOrder() {}
  }, []);
  return (
    <>
      <h1>Your order has been placed!</h1>
      <div className="Order-Container"></div>
    </>
  );
};

export default OrderSuccess;
