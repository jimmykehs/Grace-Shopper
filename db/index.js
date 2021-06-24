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

// USERS

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
        name: "UserNotFoundError",
        message: "Could not find a user with that user_id",
      };
    }

    const { rows: products } = await client.query(
      `
      SELECT products.*
      FROM products
      JOIN user_cart ON product.id=user_cart.product_id
      WHERE user_cart.user_id=$1;
    `,
      [user_id]
    );
    user.products = products;
    return user;
  } catch (error) {
    throw error;
  }
}

const createUser = async ({ username, password, email, name, cart = [] }) => {
  console.log(cart);
  try {
    const {
      rows: [users],
    } = await client.query(
      `
            INSERT INTO users(
              username, password, email, name, cart
              )
            VALUES($1, $2, $3, $4, $5)
            ON CONFLICT (username, email, name) DO NOTHING
            RETURNING *;
         `,
      [username, password, email, name, cart]
    );
    return users;
  } catch (err) {
    console.error("Could not create users in db/index.js");
    throw err;
  }
};

// USER CART

async function createUserCart(user_id, product_id) {
  try {
    await client.query(
      `
      INSERT INTO user_cart("user_id", "product_id") 
      VALUES ($1, $2)
      ON CONFLICT ("user_id", "product_id") DO NOTHING;
    `,
      [user_id, product_id]
    );
  } catch (error) {
    throw error;
  }
}

async function addProductToUserCart(user_id, productList = []) {
  try {
    const createUserCartPromises = productList.map((product) =>
      createUserCart(user_id, product.id)
    );

    await Promise.all(createUserCartPromises);

    return await getLinkById(linkId);
  } catch (error) {
    throw error;
  }
}
// export
module.exports = {
  client,
  createProduct,
  createUser,
  createUserCart,
  getAllProducts,
  // db methods
};
