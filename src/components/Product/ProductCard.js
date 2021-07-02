import React from "react";
import { addItemToCart } from "../../api";
import { AddtoCart } from "../../Img";

const ProductCard = ({ product, cart, setCart }) => {
  const token = localStorage.getItem("token");
  const handleAddtoCart = async () => {
    if (token) {
      await addItemToCart(product.id, 1, token);
    }
    product.quantity = 1;
    cart.push(product);
    alert(`${product.name} added to cart!`);
  };
  return (
    <div className="product">
      <img
        className="productImg"
        src={product.image_url}
        alt="Some broken computer part"
      ></img>
      <h1 className="name">{product.name}</h1>
      <p className="description">Description: {product.description}</p>
      <h3 className="price">Price: ${product.price}</h3>
      <img
        className="addToCart"
        src={AddtoCart}
        onClick={() => {
          handleAddtoCart();
        }}
      />
    </div>
  );
};
export default ProductCard;
