import React, { useState, useEffect } from "react";
import { getProducts } from "../api";
import { AddtoCart } from "../Img";

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
      <h1 className="Title">Enjoy all the Broken:</h1>
      <div className="productCards">
        {grabbedHeadsets?.map((product, index) => {
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

export default Headsets;
