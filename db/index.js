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
  }
}

async function patchProduct(product_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE products
        SET ${setString}
        WHERE id=${product_id}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    return await getProductById(product_id);
  } catch (error) {
    console.error("Could not patch product in db/index.js @ patchProduct");
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

async function getProductByType(type) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM products
      WHERE type=$1;
    `,
      [type]
    );

    return rows;
  } catch (error) {
    console.error(
      "Could not get product by type in db/index.js @ getProductByType()"
    );
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

async function patchUser(user_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE users
        SET ${setString}
        WHERE id=${user_id}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    return await getUserById(user_id);
  } catch (error) {
    console.error("Could not patch product in db/index.js @ patchProduct");
    throw error;
  }
}

// USER CART

//createPostTag
async function createCartItem(user_id, product_id) {
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
    console.error("could not create cart item");
    throw error;
  }
}
//addTagsToPost
async function addProductToCart(user_id, product_id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
     SELECT *
     FROM products
     WHERE id=$1;
     `,
      [product_id]
    );
    await createCartItem(user_id, product.id);

    return await getUserById(user_id);
  } catch (error) {
    console.error("could not add cart item to user");
    throw error;
  }
}

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id=$1;
    `,
      [user_id]
    );

    if (!user) {
      throw {
        name: "UserNotFoundError",
        message: "Could not find a User with that user_id",
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

    // const { rows: [author] } = await client.query(`
    //   SELECT id, username, name, location
    //   FROM users
    //   WHERE id=$1;
    // `, [post.authorId])

    user.cart = products;

    return user;
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  createProduct,
  getAllProducts,
  getProductById,
  getProductByType,
  patchProduct,
  createUser,
  getAllUsers,
  getProductByName,
  getUserById,
  getUserByUsername,
  verifyUniqueUser,
  patchUser,
  addProductToCart,
  // db methods
};
