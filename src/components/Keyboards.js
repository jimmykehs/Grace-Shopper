import React, { useState, useEffect } from "react";
import { AddtoCart } from "../Img";
import { getProducts } from "../api";
import ProductCard from "./Product/ProductCard";

const Keyboards = ({ cart }) => {
  const [grabbedKeyboards, setGrabbedKeyboards] = useState();

  const getAllKeyboards = async () => {
    try {
      const products = await getProducts();
      let keyboards = products.filter((product) => {
        return product.type.toLowerCase().includes("keyboard");
      });
      setGrabbedKeyboards(keyboards);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllKeyboards();
  }, []);

  return (
    <div>
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedKeyboards?.map((product, index) => {
          return (
            <ProductCard
              key={index}
              product={product}
              index={index}
              cart={cart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Keyboards;
