import { get } from "http";
import React, { useState, useEffect } from "react";
import { getProducts } from "../../api";
import "./Product.css";
import ProductCard from "./ProductCard";

const Products = ({ cart, setCart }) => {
  const [grabbedProducts, setGrabbedProducts] = useState();

  const getAllProducts = async () => {
    try {
      const products = await getProducts();
      setGrabbedProducts(products);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedProducts?.map((product) => {
          return (
            <ProductCard product={product} cart={cart} setCart={setCart} />
          );
        })}
      </div>
    </div>
  );
};

export default Products;
