import React, { useState } from "react";
import { createProduct } from "../api";
import "./CreateProduct.css";

const CreateProduct = () => {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(null);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      await createProduct(name, description, price, image, type);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="form-container">
      <h1 className="form-header">CREATE NEW PRODUCT</h1>
      <div>
        <form
          className="create-product"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            placeholder="Name..."
            required
            onChange={(event) => setName(event.target.value)}
          />

          <input
            placeholder="Description"
            required
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            placeholder="Price"
            required
            onChange={(event) => setPrice(event.target.value)}
          />

          <input
            placeholder="Image URL"
            required
            onChange={(event) => setImage(event.target.value)}
          />

          <input
            placeholder="Type(mouse, keyboard, headset)"
            required
            onChange={(event) => setType(event.target.value)}
          />
          <button className="sub-btn" onClick={handleSubmit}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
