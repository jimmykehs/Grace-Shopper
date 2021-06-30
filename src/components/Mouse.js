import React, { useState, useEffect } from "react";
import { getProducts } from "../api";

const Mouse = () => {
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
      <h1>Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedMouse?.map((product, index) => {
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

export default Mouse;
