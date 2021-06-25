// Connect to DB
const { Client } = require("pg");
const DB_NAME = "localhost:5432/grace-shopper";
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;
const client = new Client(DB_URL);

// database methods

// PRODUCTS

const createProduct = async ({ name, description, price, image_url, type }) => {
  try {
    const {
      rows: [products],
    } = await client.query(
      `
            INSERT INTO products(
              name,
              description,
              price,
              image_url,
              type
              )
            VALUES($1, $2, $3, $4, $5)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
         `,
      [name, description, price, image_url, type]
    );
    return products;
  } catch (err) {
    console.error("Could not create products in db/index.js @ createProduct()");
    throw err;
  }
};

async function getProductById(product_id) {
  try {
    const {
      rows: [products],
    } = await client.query(`
        SELECT *
        FROM products
        WHERE id=${product_id};
      `);

    if (!products) {
      throw {
        name: "ProductNotFoundError",
        message: "Could not find a product with that product_id",
      };
    }

    return products;
  } catch (error) {
    console.error(
      "Could not grab product by id in db/index.js @ getProductById()"
    );
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM products;`);
    return rows;
  } catch (err) {
    console.error("Could not get all products in db/index.js @ getAllProducts");
    throw error;
  }
}

async function getProductByName(name) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      SELECT * FROM products
      WHERE name = ($1);
    
    
    `,
      [name]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

// USERS FUNCTIONS

const createUser = async ({ username, password, email, name, cart = [] }) => {
  try {
    const {
      rows: [users],
    } = await client.query(
      `
            INSERT INTO users(
              username, password, email, name, cart
              )
            VALUES($1, $2, $3, $4, $5)
            ON CONFLICT (username, email) DO NOTHING
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

async function getAllUsers() {
  try {
    const { rows: id } = await client.query(`
    SELECT id 
    FROM users;
  `);

    const users = await Promise.all(id.map((user) => getUserById(user.id)));
    return users;
  } catch (err) {
    throw err;
  }
}

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

    return user;
  } catch (err) {
    console.error("Could not get user by id in db/index.js @ getProductById");
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
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
  } catch (error) {
    console.error(
      "Could not grab user by username in db/index.js @ getUserByUsername"
    );
    throw error;
  }
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

// USER CART

// const createUserProduct = async (productList) => {
//   if (productList.length === 0) {
//     return;
//   }
//   const selectValues = productList
//     .map((_, index) => `$${index + 1}`)
//     .join(", ");
//   try {
//     const { rows } = await client.query(
//       `
//      SELECT * FROM products
//      WHERE name
//      IN (${selectValues});
//      `,
//       productList
//     );

//     return rows;
//   } catch (err) {
//     console.error(
//       "Could not create user product in db/index.js createUserProduct"
//     );
//   }
// };

// async function addToUserCart(user_id, product_id) {
//   try {
//     await client.query(
//       `
//       INSERT INTO user_cart(user_id, product_id)
//       VALUES ($1, $2)
//     `,
//       [user_id, product_id]
//     );
//   } catch (err) {
//     console.error("Could not create user cart");
//     throw err;
//   }
// }

async function addProductToUserCart(user_id, product_id) {
  try {
    const currentUser = await getUserById(user_id);
    const product = await getProductById(product_id);

    await client.query(
      `
      UPDATE users
      SET cart=ARRAY [$2]
      WHERE users.id = $1
      RETURNING *
    `,
      [user_id, product]
    );
    // const updatedUser =
    return await getUserById(user_id);
    // updatedUser.cart = [JSON.parse(updatedUser.cart)];
    // if (currentUser.cart.length >= 1) {
    //   const currentCart = JSON.parse(currentUser.cart);
    //   updatedUser.cart.push(currentCart);
    //   return updatedUser;
    // }

    // return updatedUser;

    // return await getUserById(user_id);
  } catch (error) {
    console.error(
      "Could not add product to user cart in db/index.js addProductToUserCart"
    );
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
    console.error("Could not get all user carts!");
    throw err;
  }
}
// export
module.exports = {
  client,
  createProduct,
  createUser,
  getAllProducts,
  getAllUsers,
  getAllUserCarts,
  getProductByName,
  getUserById,
  getUserByUsername,
  verifyUniqueUser,
  addProductToUserCart,
  // db methods
};
