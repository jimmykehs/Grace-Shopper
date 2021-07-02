import React, { useState, useEffect } from "react";
import { AddtoCart } from "../Img";
import { getProducts } from "../api";
import ProductCard from "./Product/ProductCard";

const Mouse = ({ cart }) => {
  const [grabbedMouse, setGrabbedMouse] = useState();

  const getAllMouse = async () => {
    try {
      const products = await getProducts();
      let mouse = products.filter((product) => {
        return product.type.toLowerCase().includes("mouse");
      });
      setGrabbedMouse(mouse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllMouse();
  }, []);

  return (
    <div>
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedMouse?.map((product, index) => {
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

export default Mouse;
