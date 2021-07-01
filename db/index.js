// Connect to DB
const { Client } = require("pg");
const DB_NAME = "localhost:5432/grace-shopper";
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;
const client = new Client(DB_URL);
const pgp = require("pg-promise")({
  /* initialization options */
  capSQL: true, // capitalize all generated SQL
});
const db = pgp(DB_URL);

//////////////////////////// FOR USE WHEN EXTERNAL FILES ARE GUCCI ///////////////////

// const {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   getProductByType,
//   patchProduct,
//   getProductByName,
// } = require("./products");

// const {
//   createUser,
//   getAllUsers,
//   getUserByUsername,
//   verifyUniqueUser,
//   patchUser,
// } = require("./users");

// const { addProductToCart } = require("./carts");

// const { addCartToUserOrders } = require("./orders");
// database methods
////////////////////////////////////////////////////////////////////////////////////

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

const createUser = async ({
  username,
  password,
  email,
  name,
  admin = false,
}) => {
  try {
    const {
      rows: [users],
    } = await client.query(
      `
            INSERT INTO users(
              username, password, email, name, admin
              )
            VALUES($1, $2, $3, $4, $5)
            ON CONFLICT (username, email) DO NOTHING
            RETURNING *;
         `,
      [username, password, email, name, admin]
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

async function verifyUniqueUser(username, email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE username = ($1)
    OR email = ($2);
  `,
      [username, email]
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

// GUESTS

const createGuest = async ({ email, name, cart = [] }) => {
  try {
    const {
      rows: [guests],
    } = await client.query(
      `
            INSERT INTO guests(
              email, name, cart
              )
            VALUES($1, $2, $3)
            ON CONFLICT (email) DO NOTHING
            RETURNING *;
         `,
      [email, name, cart]
    );

    return guests;
  } catch (err) {
    console.error("Could not create guests in db/index.js");
    throw err;
  }
};

// USER CART

//createPostTag
async function createCartItem(user_id, product_id, quantity) {
  try {
    let userCart = await getCartByUserId(user_id);
    if (userCart.length === 0) {
      userCart = await createCart(user_id);

      const {
        rows: [product],
      } = await client.query(
        `
        INSERT INTO cart_products(user_cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_cart_id, product_id) DO NOTHING
        RETURNING *;
      `,
        [userCart.id, product_id, quantity]
      );
      console.log(product);
      return product;
    }
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO cart_products(user_cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_cart_id, product_id) DO NOTHING

      RETURNING *;
    `,
      [userCart[0].id, product_id, quantity]
    );
    console.log(product);
    return product;
  } catch (error) {
    console.error("could not create cart item");
    throw error;
  }
}

async function updateCartItemQuantity(user_cart_id, product_id, quantity) {
  try {
    await client.query(
      `
      UPDATE cart_products
      SET $3
      WHERE id=$1 AND product_id=$2
      RETURNING *;
    `,
      [user_cart_id, product_id, quantity]
    );
  } catch (err) {
    throw err;
  }
}

async function createCart(user_id) {
  try {
    const {
      rows: [userCart],
    } = await client.query(
      `
      INSERT INTO user_cart(user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *
    `,
      [user_id]
    );
    return userCart;
  } catch (error) {
    console.error("could not create cart");
    throw error;
  }
}

async function getCartByUserId(user_id) {
  try {
    const { rows: userCart } = await client.query(
      `
      SELECT * FROM user_cart
      WHERE user_id=$1 AND active=true
      `,
      [user_id]
    );

    return userCart;
  } catch (error) {
    console.error("Couldn't get cart by user id");
    throw error;
  }
}

async function addProductToCart(user_id, product_id, quantity) {
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
    await createCartItem(user_id, product.id, quantity);

    return await getUserById(user_id);
  } catch (error) {
    console.error("could not add cart item to user");
    throw error;
  }
}

async function setCartInactive(cart_id) {
  try {
    return await client.query(
      `
      UPDATE user_cart SET active=false
      WHERE user_cart.user_id=$1
      `,
      [cart_id]
    );
  } catch (error) {}
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
      JOIN cart_products ON products.id=cart_products.product_id
      JOIN user_cart ON cart_products.user_cart_id=user_cart.id
      WHERE user_cart.user_id=$1
    `,
      [user_id]
    );
    console.log(products, "PRODUCCCCCCTS");
    user.cart = products;
    const { rows: orderProducts } = await client.query(
      `
      SELECT *
      FROM products
      INNER JOIN order_products ON products.id=order_products.product_id
      INNER JOIN user_orders ON order_products.order_id=user_orders.id
      WHERE user_orders.user_id=$1
    `,
      [user_id]
    );

    user.order = orderProducts;

    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteCartItem(user_id, product_id) {
  try {
    const userCart = await getCartByUserId(user_id);
    console.log("USER CART", userCart);
    const {
      rows: [deletedItem],
    } = await client.query(
      `
      DELETE FROM cart_products
      WHERE user_cart_id = ($1) AND
      product_id = ($2)
      RETURNING *;
      `,
      [userCart[0].id, product_id]
    );
    return deletedItem;
  } catch (error) {
    console.error("Can't delete cart item");
    throw error;
  }
}
async function updateProductQuantity(user_id, product_id, quantity) {
  try {
    const userCart = await getCartByUserId(user_id);
    const {
      rows: [updatedProduct],
    } = await client.query(
      `
      UPDATE cart_products
      SET quantity = ($1)
      WHERE user_cart_id = ($2) AND
      product_id = ($3)
      RETURNING *;
    `,
      [quantity, userCart[0].id, product_id]
    );
    return updatedProduct;
  } catch (error) {
    console.log(error);
    console.error("Couldn't update quantities");
    throw error;
  }
}
// ORDERS

async function createUserOrder(user_id) {
  try {
    const userCart = await getCartByUserId(user_id);
    if (userCart.length === 0) {
      console.error("Can't create user order without a user cart");
      throw error;
    }
    // console.log(userCart, "USER CART");
    const { rows: createdOrder } = await client.query(
      `
        INSERT INTO user_orders(user_id, user_cart_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, user_cart_id) DO NOTHING
        RETURNING *
      `,
      [user_id, userCart[0].id]
    );
    console.log(createdOrder, "CREATED ORDER");
    await setCartInactive(userCart[0].id);
    await addCartProductsToOrderProducts(userCart[0].id, createdOrder[0].id);
    return await getUserByIdForOrders(user_id);
  } catch (error) {
    console.error("could not create user order");
    throw error;
  }
}

async function addCartProductsToOrderProducts(cart_id, order_id) {
  // select all of the productIds that relate to the cart.
  // this is an array of productIds
  try {
    const { rows: cartProducts } = await client.query(
      `SELECT * FROM cart_products WHERE user_cart_id = $1`,
      [cart_id]
    );
    // console.log(cart_id, "CART ID");
    // console.log(cartProducts, "CART PRODUCTS");
    await bulkUpdateOrderProducts(order_id, cartProducts);
  } catch (err) {
    console.error("Can not add cart product to order product!");
    throw err;
  }
}

async function bulkUpdateOrderProducts(order_id, cartProducts) {
  const newCartProducts = cartProducts.map((cp) => {
    return { order_id, ...cp };
  });
  // console.log(newCartProducts, "NEW CART PRODUCTS");
  const cs = new pgp.helpers.ColumnSet(["order_id", "product_id", "quantity"], {
    table: "order_products",
  });
  const query = pgp.helpers.insert(newCartProducts, cs);
  await db.none(query);
}

async function getUserByIdForOrders(user_id) {
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
    console.log(user_id, "USER ID");
    const { rows: products } = await client.query(
      `
      SELECT *
      FROM products
      INNER JOIN order_products ON products.id=order_products.product_id
      INNER JOIN user_orders ON order_products.order_id=user_orders.id
      WHERE user_orders.user_id=$1
    `,
      [user_id]
    );

    user.order = products;
    console.log(products, "PRODUCTS");
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
  createGuest,
  addProductToCart,
  // addCartToUserOrders,
  createUserOrder,
  createCartItem,
  addCartProductsToOrderProducts,
  deleteCartItem,
  updateProductQuantity,
  // db methods
};
