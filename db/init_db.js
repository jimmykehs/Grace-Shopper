// code to build and initialize DB goes here
const {
  client,
  createProduct,
  getAllProducts,
  getProductById,
  getProductByType,
  patchProduct,
  createUser,
  getAllUsers,
  patchUser,
  addProductToCart,
} = require("./index");
``;

async function buildTables() {
  try {
    // drop tables in correct order
    client.query(`
        DROP TABLE IF EXISTS user_cart;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;
      `);
    // build tables in correct order
    console.log("Starting to build tables...");
    // create all tables, in the correct order
    // products, users, user_carts **
    await client.query(`
      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        date_created DATE NOT NULL DEFAULT CURRENT_DATE,
        description VARCHAR(255) NOT NULL,
        price DECIMAL DEFAULT 0,
        image_url TEXT NOT NULL,
        type VARCHAR(255) NOT NULL,
        active boolean DEFAULT true
        
      );
       CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE,
        cart TEXT [],
        UNIQUE(username, email)
      );
      CREATE TABLE user_cart(
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        UNIQUE(user_id, product_id)
      );
      `);
    console.log("Finished building tables...");
  } catch (error) {
    throw error;
  }
}

const createInitialProducts = async () => {
  console.log("Starting to create initial products...");
  try {
    const productsToCreate = [
      {
        name: "product 1",
        date_created: "2020/08/31",
        description: "Link One Description.",
        price: 1.25,
        image_url: "https://picsum.photos/id/217/200/300",
        type: "one",
      },
      {
        name: "product 2",
        date_created: "2021/12/11",
        description: "Link Two Description.",
        price: 16.99,
        image_url: "https://picsum.photos/id/227/200/300",
        type: "two",
      },
      {
        name: "product 3",
        date_created: "2019/02/07",
        description: "Link Two Description.",
        price: 47.99,
        image_url: "https://picsum.photos/id/237/200/300",
        type: "three",
      },
    ];
    const products = await Promise.all(productsToCreate.map(createProduct));
    console.log("Products created:");
    console.log(products);
    console.log("Finished creating products!");
  } catch (err) {
    console.error("There was a problem creating PRODUCTS");
    throw err;
  }
};

const createInitialUsers = async () => {
  console.log("Starting to create initial users...");
  try {
    const usersToCreate = [
      {
        username: "BrianPython",
        password: "AjaxDestroyer44",
        email: "brian_p@gmail.com",
        name: "Brian Pollygren",
        // cart: ["product 1"],
      },
      {
        username: "Shyguy666",
        password: "appleBoy24",
        email: "shyguy666@yahoo.com",
        name: "Erin Naples",
        // cart: ["product 3"],
      },
      {
        username: "Jessica.Troy",
        password: "AriGorn7747",
        email: "jessica.troy@gmail.com",
        name: "Jessica Troy",
        // cart: [],
      },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));
    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (err) {
    console.error("There was a problem creating USERS");
    throw err;
  }
};

async function rebuildDB() {
  try {
    client.connect();
    await buildTables();
    await createInitialProducts();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling getProductByType");
    const productByType = await getProductByType("three");
    console.log("Result:", productByType);

    console.log("Calling addProductToCart");
    const userWithProduct = await addProductToCart(1, 2);
    console.log("Result:", userWithProduct);

    console.log("Calling addProductToCart");
    const userWithSecondProduct = await addProductToCart(1, 1);
    console.log("Result:", userWithSecondProduct);

    console.log("Calling patchProduct");
    const updatedProduct = await patchProduct(1, {
      name: "newest product",
    });
    console.log("Result:", updatedProduct);

    console.log("Calling patchUser");
    const updatedUser = await patchUser(1, {
      name: "Leeroy Jenkins",
      username: "LeeroyCodes",
    });
    console.log("Result:", updatedUser);
    // console.log("Calling addProductToUserCart");
    // const userWithSecondProduct = await addProductToUserCart(1, 3);
    // console.log("Result:", userWithSecondProduct);
    // console.log("Calling updateLink on links[0]");
    // const updateLinkResult = await updateLink(links[0].id, {
    //   name: "Instagram",
    //   link: "http://www.instagram.com",
    //   comment: "Photo sharing Social Network",
    //   tags: ["social", "photography"],
    // });
    // console.log("Result:", updateLinkResult);

    // console.log("Calling getLinkById with 1");
    // const linkById = await getLinkById(1);
    // console.log("Result:", linkById);

    // console.log("Calling updateLink on links[1], only updating tags");
    // const updateLinkTagsResult = await updateLink(links[1].id, {
    //   tags: ["social", "networking", "marketplace"],
    // });
    // console.log("Result:", updateLinkTagsResult);

    // console.log("Calling getPostsByTagName with #social");
    // const linksWithSocial = await getLinksByTagName("social");
    // console.log("Result:", linksWithSocial);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
