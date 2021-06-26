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

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  patchProduct,
  getProductByName,
  getProductByType,
};
