import React, { useState, useEffect } from "react";
import { getProducts } from "../api";

const Headsets = () => {
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
      <h1>Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedHeadsets?.map((product, index) => {
          return (
            <div className="product" key={index}>
              <h2>Product:{product.name}</h2>
              <img
                src={product.image_url}
                alt="Some broken computer part"
              ></img>
              <p>Description: {product.description}</p>
              <p>Type: {product.type}</p>
              <h3>Price: {product.price}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Headsets;
