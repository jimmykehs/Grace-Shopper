const { client } = require("../index");

async function createCartItem(user_id, product_id) {
  try {
    const userCart = await getCartByUserId(user_id);
    if (userCart === null) {
      userCart = createCart(user_id);
    }
    return await client.query(
      `
        INSERT INTO cart_products(user_cart_id, product_id)
        VALUES ($1, $2);      `,
      [userCart.id, product_id]
    );
  } catch (error) {
    console.error("could not create cart item");
    throw error;
  }
}

async function createCart(user_id) {
  try {
    return await client.query(
      `
        INSERT INTO user_cart(user_id)
        VALUES ($1)
        ON CONFLICT (user_id) DO NOTHING;
      `,
      [user_id]
    );
  } catch (error) {
    console.error("could not create cart item");
    throw error;
  }
}

async function getCartByUserId(user_id) {
  try {
    return await client.query(
      `
        SELECT TOP(1)* FROM user_cart
        WHERE user_id=$1 AND active=true
        `,
      [user_id]
    );
  } catch (error) {
    console.error("Couldn't get cart by user id");
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

    user.cart = products;

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCart,
  createCartItem,
  getCartByUserId,
  addProductToCart,
  getUserById,
};
