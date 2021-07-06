const express = require("express");
const orderRouter = express.Router();
const { requireUser } = require("../Utils/utils.js");
const { getUserById, createUserOrder } = require("../../db");

orderRouter.get("/", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const data = await getUserById(id);
  res.send(data.order);
});

orderRouter.post("/", requireUser, async (req, res, next) => {
  const data = await createUserOrder(req.user.id);
  res.send(data);
});

module.exports = orderRouter;
