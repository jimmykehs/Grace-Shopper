const { client } = require("../index");

async function createUserOrder(user_id, product_id) {
  try {
    await client.query(
      `
        INSERT INTO user_orders(user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO NOTHING;
      `,
      [user_id, product_id]
    );
  } catch (error) {
    console.error("could not create user order");
    throw error;
  }
}
//addTagsToPost
async function addCartToUserOrders(user_id, product_id) {
  try {
    const { rows: product } = await client.query(
      `
       SELECT *
       FROM products
       WHERE id=$1;
       `,
      [product_id]
    );
    await createUserOrder(user_id, product_id);
    return await getUserByIdForOrders(user_id);
  } catch (error) {
    console.error("could not add cart item to user");
    throw error;
  }
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

    const { rows: order } = await client.query(
      `
        SELECT users.cart
        FROM users
        JOIN user_orders ON users.id=user_orders.user_id
        WHERE user_orders.user_id=$1;
      `,
      [user_id]
    );

    user.orders = order;

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUserOrder,
  addCartToUserOrders,
  getUserByIdForOrders,
};
