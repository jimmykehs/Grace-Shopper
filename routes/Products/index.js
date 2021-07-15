const express = require("express");
const productsRouter = express.Router();
const { requireAdmin } = require("../Utils/utils.js");
const {
  createProduct,
  getAllProducts,
  getProductByName,
  patchProduct,
  deleteProduct,
} = require("../../db");

//Gets all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts);
  } catch (error) {
    next(error);
  }
});

//Used by admin to add products
productsRouter.post("/", async (req, res, next) => {
  try {
    const existingProduct = await getProductByName(req.body.name);
    if (existingProduct) {
      next({
        name: "ExistingProduct",
        message: "Product already exists with this name!",
      });
    }
    const { name, description, price, image_url, type } = req.body;
    const newProduct = await createProduct(req.body);
    res.send(newProduct);
  } catch (error) {
    next(error);
  }
});
//Used by admin to edit products
productsRouter.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedProduct = await patchProduct(id, req.body);
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);
    res.send(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
