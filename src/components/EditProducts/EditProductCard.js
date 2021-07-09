import React, { useState } from "react";
import { updateProduct } from "../../api";

const EditProductCard = ({ product }) => {
  console.log(product);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [in_stock, setIn_Stock] = useState(product.in_stock);
  const [image_url, setImage_Url] = useState(product.image_url);

  return (
    <div className="EditProductCard">
      <img className="productImage" src={image_url} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const token = localStorage.getItem("token");
          await updateProduct(
            product.id,
            {
              name,
              description,
              price,
              in_stock,
              image_url,
            },
            token
          );
        }}
      >
        <label htmlFor="ProductName">Product Name</label>
        <input
          name="ProductName"
          placeholder="Product Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <label htmlFor="ProductDesc">Product Description</label>

        <textarea
          name="ProductDesc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label htmlFor="ProductPrice">Price</label>
        <input
          name="ProductPrice"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>

        <div className="inStock-Container">
          <label htmlFor="inStock">In stock</label>{" "}
          <input
            name="inStock"
            type="checkbox"
            checked={in_stock}
            onChange={() => {
              setIn_Stock(!in_stock);
            }}
          ></input>
        </div>
        <button type="submit">Submit Changes</button>
      </form>
    </div>
  );
};

export default EditProductCard;
