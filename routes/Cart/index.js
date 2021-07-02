const express = require("express");
const cartRouter = express.Router();
const { requireUser } = require("../Utils/utils.js");
const {
  addProductToCart,
  createCartItem,
  deleteCartItem,
  updateProductQuantity,
} = require("../../db");

cartRouter.post("/", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { product_id, quantity } = req.body;
  const addedItem = await addProductToCart(id, product_id, quantity);
  console.log(addedItem);
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
  const updatedItem = await updateProductQuantity(id, productId, quantity);
  res.send(updatedItem);
});

module.exports = cartRouter;
