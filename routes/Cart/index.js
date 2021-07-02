const express = require("express");
const cartRouter = express.Router();
const { requireUser } = require("../Utils/utils.js");
const {
  addProductToCart,
  createCartItem,
  deleteCartItem,
  updateProductQuantity,
  getUserById,
} = require("../../db");

cartRouter.get("/", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const user = await getUserById(id);
  res.send(user.cart);
});

cartRouter.post("/", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { product_id, quantity } = req.body;
  const addedItem = await addProductToCart(id, product_id, quantity);
  res.send(addedItem);
});

cartRouter.delete("/:productId", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;
  const removedItem = await deleteCartItem(id, productId);
  res.send(removedItem);
});

cartRouter.patch("/:productId", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;
  console.log(id, productId, quantity);
  const updatedItem = await updateProductQuantity(id, productId, quantity);
  res.send(updatedItem);
});

module.exports = cartRouter;
