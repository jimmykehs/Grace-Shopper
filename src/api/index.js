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
    console.log(data.users);
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
      // alert("You have successfully registered!");
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
    // let adminStatus = prompt(
    //   "What would you like to change the admin status to?",
    //   admin
    // );

    const { data } = await axios.patch(`/api/users/${id}`, updatedInfo);
    console.log(data);
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
    console.log(data);
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
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyAccount(username) {
  try {
    let myUsername = { username };
    console.log(myUsername);
    const { data } = await axios.post("/api/users/me", myUsername);
    console.log(data);
    console.log(data.user);
    return data.user;
  } catch (error) {
    throw error;
  }
}
