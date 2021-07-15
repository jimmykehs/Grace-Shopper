import axios from "axios";

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const loggedAdmin = () => {
  localStorage.setItem("admin", "isAdmin");
};

export const clearAdmin = () => {
  localStorage.removeItem("admin");
};

export async function getProducts() {
  try {
    const { data } = await axios.get("/api/products");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUsers() {
  try {
    const { data } = await axios.get("/api/users");
    return data.users;
  } catch (error) {
    throw error;
  }
}

export async function userLogin(username, password) {
  try {
    const { data } = await axios.post("/api/users/login", {
      username,
      password,
    });

    if (data.token) {
      alert("You have successfully logged in!");
      setToken(data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function userRegister(name, email, username, password) {
  try {
    const { data } = await axios.post("/api/users/register", {
      name,
      email,
      username,
      password,
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeAdmin(id, admin) {
  try {
    let updatedInfo = {
      admin,
    };

    const { data } = await axios.patch(`/api/users/${id}`, updatedInfo);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createProduct(name, description, price, image_url, type) {
  try {
    const { data } = await axios.post("/api/products", {
      name,
      description,
      price,
      image_url,
      type,
    });
    alert("Product successfully added");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCart(token) {
  try {
    const { data } = await axios.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting cart");
  }
}

export async function updateProductQuantity(product_id, quantity, token) {
  try {
    const { data } = await axios.patch(
      `/api/cart/${product_id}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating quantity");
  }
}

export async function removeItemFromCart(product_id, token) {
  try {
    const { data } = await axios.delete(`api/cart/${product_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error removing from cart");
  }
}

export async function addItemToCart(product_id, quantity, token) {
  try {
    const { data } = await axios.post(
      `api/cart`,
      { product_id, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error adding to cart");
  }
}

export async function editUser(id, name, email) {
  try {
    let updatedInfo = {};
    let newName = prompt("What would you like to change your name to?", name);
    let newEmail = prompt(
      "What would you like to change your Email to?",
      email
    );

    if (newName) {
      updatedInfo.name = newName;
    }
    if (newEmail) {
      updatedInfo.email = newEmail;
    }

    const { data } = await axios.patch(`/api/users/me/${id}`, updatedInfo);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyAccount(token) {
  try {
    const { data } = await axios.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
  } catch (error) {
    throw error;
  }
}

export async function checkoutUser(cart) {
  try {
    const { data } = await axios.post("api/cart/checkout", cart);
    return data;
  } catch (error) {
    console.error("Oops");
  }
}

export async function removeUser(id, token) {
  try {
    const { data } = await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Error removing user");
  }
}

export async function createUserOrder(token) {
  try {
    const order = await axios.post(
      "/api/order",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return order;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllUserOrders(token) {
  try {
    const { data } = await axios.get("/api/order", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orders = [];
    data.forEach((el, index) => {
      if (orders.some((order) => order.id === el.id)) {
        const orderIndx = orders.findIndex((e) => e.id === el.id);
        orders[orderIndx].products.push(el);
      } else {
        orders.push({
          id: el.id,
          status: el.status,
          products: [{ name: el.name, quantity: el.quantity }],
        });
      }
    });
    return orders;
  } catch (error) {
    console.error(error);
  }
}

export async function updateOrderStatus(order_id, status) {
  try {
    const updatedOrder = await axios.patch(`/api/order/${order_id}`, {
      status,
    });
    return updatedOrder;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllOrders() {
  try {
    const { data } = await axios.get("api/order/all");
    const orders = [];
    data.forEach((el, index) => {
      if (orders.some((order) => order.id === el.id)) {
        const orderIndx = orders.findIndex((e) => e.id === el.id);
        orders[orderIndx].products.push(el);
      } else {
        orders.push({
          id: el.id,
          status: el.status,
          products: [{ name: el.name, quantity: el.quantity }],
        });
      }
    });
    return orders;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(product_id, fields, token) {
  try {
    const updatedProduct = await axios.patch(
      `api/products/${product_id}`,
      fields,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Product has been updated!");
    return updatedProduct;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct(id, token) {
  try {
    const deletedProduct = await axios.delete(`api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return deletedProduct;
  } catch (error) {
    console.error(error);
  }
}
