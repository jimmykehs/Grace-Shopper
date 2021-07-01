import React, { useState, useEffect } from "react";
import { AddtoCart } from "../Img";
import { getProducts } from "../api";

const Keyboards = () => {
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

export default Keyboards;
