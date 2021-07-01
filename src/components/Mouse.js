import React, { useState, useEffect } from "react";
import { AddtoCart } from "../Img";
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
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedMouse?.map((product, index) => {
          return (
            <div className="product" key={index}>
              <img
                className="productImg"
                src={product.image_url}
                alt="Some broken computer part"
              ></img>
              <h1 className="name">{product.name}</h1>
              <p className="description">Description: {product.description}</p>
              <h3 className="price">Price: ${product.price}</h3>
              <img className="addToCart" src={AddtoCart} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mouse;
