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
    console.log(data.token);
    if (data.token) {
      alert("You have successfully registered!");
      setToken(data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeAdmin(id, admin) {
  try {
    let updatedInfo = {};
    let adminStatus = prompt(
      "What would you like to change the admin status to?",
      admin
    );

    if (adminStatus) {
      updatedInfo.admin = adminStatus;
    }
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
