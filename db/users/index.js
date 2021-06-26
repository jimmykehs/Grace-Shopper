const { getUserById } = require("../carts");
const { client } = require("../index");

const createUser = async ({ username, password, email, name }) => {
  try {
    const {
      rows: [users],
    } = await client.query(
      `
              INSERT INTO users(
                username, password, email, name
                )
              VALUES($1, $2, $3, $4)
              ON CONFLICT (username, email) DO NOTHING
              RETURNING *;
           `,
      [username, password, email, name]
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

module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  verifyUniqueUser,
  patchUser,
};
