const express = require("express");
const productsRouter = express.Router();
const { requireAdmin } = require("../Utils/utils.js");
const { createProduct, getAllProducts, getProductByName } = require("../../db");

//Gets all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    console.log(allProducts);
    res.send(allProducts);
  } catch (error) {
    next(error);
  }
});

//Used by admin to add products
productsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const existingProduct = await getProductByName(req.body.name);
    if (existingProduct) {
      next({
        name: "ExistingProduct",
        message: "Product already exists with this name!",
      });
    }

    const newProduct = await createProduct(req.body);
    res.send(newProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
