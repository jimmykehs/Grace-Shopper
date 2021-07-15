import React, { useState, useEffect } from "react";
import { getProducts } from "../../api";
import EditProductCard from "./EditProductCard";
import "./EditProduct.css";

const EditProducts = () => {
  const [grabbedProducts, setGrabbedProducts] = useState([]);

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
    <>
      <h1 className="Title">Edit Products</h1>
      <div className="EditProductCard-Container">
        {grabbedProducts.map((product, index) => {
          return (
            <EditProductCard
              product={product}
              key={product.id}
              index={index}
              setGrabbedProducts={setGrabbedProducts}
              grabbedProducts={grabbedProducts}
            />
          );
        })}
      </div>
    </>
  );
};

export default EditProducts;
