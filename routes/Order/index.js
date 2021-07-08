const express = require("express");
const orderRouter = express.Router();
const { requireUser } = require("../Utils/utils.js");
const {
  getUserById,
  createUserOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../../db");

orderRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = await getUserById(id);
    res.send(data.order);
  } catch (error) {
    next({ name: "OrderErr", message: "Could get user orders" });
  }
});

orderRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const data = await createUserOrder(req.user.id);
    await updateOrderStatus(data, {
      status: "Created",
    });
    res.send({ message: "Order created!" });
  } catch (error) {
    next({ name: "OrderErr", message: "Could not create order" });
  }
});

orderRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateOrderStatus(id, req.body);
    res.send(data);
  } catch (error) {
    next({ name: "OrderErr", message: "Could not update order status" });
  }
});

orderRouter.get("/all", async (req, res, next) => {
  try {
    const data = await getAllOrders();
    console.log(data);
    res.send(data);
  } catch (error) {
    next({ name: "OrderErr", message: "Could not get all orders" });
  }
});

module.exports = orderRouter;
