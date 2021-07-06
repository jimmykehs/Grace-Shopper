const express = require("express");
const cartRouter = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(`${process.env.STRIPE_API_KEY}`);
const cors = require("cors");
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

cartRouter.post("/checkout", async (req, res) => {
  const cartItems = req.body;
  const line_items = [];
  cartItems.forEach((item) => {
    const { name, price, quantity } = item;
    const formatPrice = parseInt(price.replace(".", ""));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name,
        },
        unit_amount: formatPrice,
      },
      quantity,
    });
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/cart",
  });
  res.send(session.url);
});

module.exports = cartRouter;
