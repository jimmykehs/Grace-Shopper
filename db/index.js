// Connect to DB
const { Client } = require("pg");
const DB_NAME = "localhost:5432/grace-shopper";
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;
const client = new Client(DB_URL);

// database methods

// PRODUCTS

const createProduct = async ({
  name,
  date_created,
  description,
  price,
  image_url,
  type,
}) => {
  try {
    const {
      rows: [products],
    } = await client.query(
      `
            INSERT INTO products(
              name,
              date_created,
              description,
              price,
              image_url,
              type
              )
            VALUES($1, $2, $3, $4, $5, $6)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
         `,
      [name, date_created, description, price, image_url, type]
    );
    return products;
  } catch (err) {
    console.error("Could not create products in db/index.js");
    throw err;
  }
};

async function getProductById(product_id) {
  try {
    const {
      rows: [product],
    } = await client.query(`
        SELECT *
        FROM products
        WHERE id=${product_id};
      `);

    if (!product) {
      throw {
        name: "ProductNotFoundError",
        message: "Could not find a product with that product_id",
      };
    }

    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  // select and return an array of all routines, include their activities
  try {
    const { rows: id } = await client.query(`
    SELECT id 
    FROM products;
  `);

    const products = await Promise.all(
      id.map((product) => getProductById(product.id))
    );
    return products;
  } catch (error) {
    throw error;
  }
}

// USERS FUNCTIONS

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT *
        FROM users
        WHERE id=${user_id};
      `);
    console.log(user, "UUUUUSER");

    if (!user) {
      throw {
        name: "UserNotFoundError",
        message: "Could not find a user with that user_id",
      };
    }

    const { rows: products } = await client.query(
      `
      SELECT *
      FROM products
      JOIN user_cart ON products.id=user_cart.product_id
      WHERE user_cart.user.id=$1;
    `,
      [user_id]
    );
    user.cart = products;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT * FROM users
    WHERE username = ($1);
  `,
    [username]
  );

  return user;
}

async function verifyUniqueUser(username, email, name) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE username = ($1)
    OR email = ($2)
    OR name = ($3);
  `,
      [username, email, name]
    );

    return user;
  } catch (err) {
    throw err;
  }
}

const createUser = async ({ username, password, email, name, cart = [] }) => {
  try {
    const {
      rows: [users],
    } = await client.query(
      `
            INSERT INTO users(
              username, password, email, name
              )
            VALUES($1, $2, $3, $4)
            ON CONFLICT (username, email, name) DO NOTHING
            RETURNING *;
         `,
      [username, password, email, name]
    );
    const userCart = await createUserProduct(cart);
    const addedProduct = await addProductToUserCart(users.id, userCart);
    console.log(addedProduct, "THIS IS THE ADDED PRODUCT");
    return addedProduct;
  } catch (err) {
    console.error("Could not create users in db/index.js");
    throw err;
  }
};

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT *
        FROM users
        WHERE id=${user_id};
      `);

    if (!user) {
      throw {
        name: "UserErrorNotFound",
        message: "Could not find a user with that user_id",
      };
    }

    const { rows: products } = await client.query(
      `
      SELECT products.*
      FROM products
      JOIN user_cart ON products.id=user_cart.product_id
      WHERE user_cart.user_id=$1;
    `,
      [user_id]
    );
    user.cart = products;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows: id } = await client.query(`
    SELECT id 
    FROM users;
  `);

    const users = await Promise.all(id.map((user) => getUserById(user.id)));
    return users;
  } catch (error) {
    throw error;
  }
}

// USER CART

const createUserProduct = async (productList) => {
  if (productList.length === 0) {
    return;
  }
  const selectValues = productList
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  try {
    const { rows } = await client.query(
      `
     SELECT * FROM products
     WHERE name
     IN (${selectValues});
     `,
      productList
    );

    return rows;
  } catch (err) {
    console.error("Could not create tags in index.js [createTag()]");
  }
};

async function createUserCart(user_id, product_id) {
  try {
    await client.query(
      `
      INSERT INTO user_cart(user_id, product_id) 
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING;
    `,
      [user_id, product_id]
    );
  } catch (error) {
    throw error;
  }
}

async function addProductToUserCart(user_id, productList = []) {
  try {
    if (productList === undefined) {
      return;
    }
    const createUserCartPromises = productList.map((product) => {
      createUserCart(user_id, product.id);
    });

    await Promise.all(createUserCartPromises);

    return await getUserById(user_id);
  } catch (error) {
    throw error;
  }
}

async function getAllUserCarts() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM user_cart;
    `);

    return rows;
  } catch (err) {
    console.err("Could not get all user carts!");
    throw err;
  }
}
// export
module.exports = {
  client,
  createProduct,
  createUser,
  // createUserCart,
  getAllProducts,
  getAllUsers,
  getAllUserCarts,
  getUserByUsername,
  verifyUniqueUser,
  // db methods
};
