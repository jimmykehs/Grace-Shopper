const express = require("express");
const productsRouter = express.Router();

//Gets all products
productsRouter.get("/products", (req, res, next) => {});

//Used by admin to add products
productsRouter.post("/products", (req, res, next) => {});

module.exports = productsRouter;
