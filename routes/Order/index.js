const express = require("express");
const orderRouter = express.Router();
const { requireUser } = require("../Utils/utils.js");
const { getUserById, createUserOrder } = require("../../db");

orderRouter.get("/recent", requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.send(user.order);
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/", requireUser, async (req, res, next) => {
  const data = await createUserOrder(req.user.id);
  res.send(data);
});

module.exports = orderRouter;
