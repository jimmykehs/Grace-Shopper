import React, { useState, useEffect } from "react";
import { getProducts } from "../api";
import ProductCard from "./Product/ProductCard";

const Headsets = ({ cart }) => {
  const [grabbedHeadsets, setGrabbedHeadsets] = useState();

  const getAllHeadsets = async () => {
    try {
      const products = await getProducts();
      let headsets = products.filter((product) => {
        return product.type.toLowerCase().includes("headset");
      });
      setGrabbedHeadsets(headsets);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllHeadsets();
  }, []);

  return (
    <div>
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedHeadsets?.map((product, index) => {
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

export default Headsets;
