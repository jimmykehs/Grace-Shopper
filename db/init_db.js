// code to build and initialize DB goes here
const bcrypt = require("bcrypt");
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
  createUserAddress,
  createGuest,
  addProductToCart,
  // addCartToUserOrders,
  createUserOrder,
  addCartProductsToOrderProducts,
} = require("./index");

async function buildTables() {
  try {
    // drop tables in correct order
    client.query(`
        DROP TABLE IF EXISTS order_products;
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS user_orders;
        DROP TABLE IF EXISTS user_cart;
        DROP TABLE IF EXISTS guests;
        DROP TABLE IF EXISTS user_address;
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
      in_stock BOOLEAN DEFAULT true,
      inventory INTEGER NOT NULL,
      active BOOLEAN DEFAULT true
      
  );
  
  CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT FALSE,
      UNIQUE(username, email)
  );

  CREATE TABLE user_address(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    street VARCHAR(255) NOT NULL,
    street_2 VARCHAR(255),
    state VARCHAR(2) NOT NULL,
    zip_code INTEGER NOT NULL,
    UNIQUE(user_id)

  );
  
  CREATE TABLE guests(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      UNIQUE(email)
  );
  
  CREATE TABLE user_cart(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      active BOOLEAN DEFAULT TRUE,
      UNIQUE(user_id)
  ); 
  
  CREATE TABLE user_orders(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_cart_id INTEGER REFERENCES user_cart(id),
    UNIQUE(user_id, user_cart_id)
);

  CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      "user_cart_id" INTEGER REFERENCES user_cart(id),
      "product_id" INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      UNIQUE("user_cart_id", "product_id")
  ); 
  CREATE TABLE order_products(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES user_orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL
    
  )

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
        name: "Logitech G502",
        date_created: "2020/08/31",
        description: "Logitech G502 Wireless Mouse. Missing scroll wheel.",
        price: 59.95,
        image_url:
          "https://c1.neweggimages.com/ProductImageCompressAll1280/26-197-336-V01.jpg",
        type: "mouse",
        in_stock: true,
        inventory: 3,
      },
      {
        name: "Anne Pro 2",
        date_created: "2021/12/11",
        description: "Anne Pro 2 60% Keyboard. Missing A/D/F keys.",
        price: 38.95,
        image_url:
          "https://c1.neweggimages.com/ProductImageCompressAll1280/AHB0_132107574488968021cmxMoW9s1f.jpg",
        type: "keyboard",
        in_stock: false,
        inventory: 0,
      },
      {
        name: "SteelSeries Rival 310 Gaming Mouse",
        date_created: "2019/02/07",
        description: "SteelSeries Rival 310 Gaming Mouse. RGB does not work.",
        price: 15.99,
        image_url:
          "https://c1.neweggimages.com/ProductImageCompressAll1280/26-249-223-V01.jpg",
        type: "mouse",
        in_stock: true,
        inventory: 17,
      },
      {
        name: "Razer Kraken X Gaming Headset",
        date_created: "2021/05/07",
        description:
          "Razer Kraken X Gaming Headset. Microphone attachment missing.",
        price: 25.99,
        image_url:
          "https://images-na.ssl-images-amazon.com/images/I/61QIMDB3YTL._AC_SL1500_.jpg",
        type: "headset",
        in_stock: true,
        inventory: 15,
      },
      {
        name: "Logitech G432 Wired Gaming Headset",
        date_created: "2021/12/12",
        description: "Logitech G432 Wired Gaming Headset. Minor audio issues.",
        price: 25.99,
        image_url:
          "https://images-na.ssl-images-amazon.com/images/I/61j6ey6mBpL._AC_SL1024_.jpg",
        type: "headset",
        in_stock: true,
        inventory: 84,
      },
      {
        name: "Razer Ornata Chroma Gaming Keyboard",
        date_created: "2021/08/11",
        description: "Razer Ornata Chroma Gaming Keyboard. RGB does not work.",
        price: 20.99,
        image_url:
          "https://images-na.ssl-images-amazon.com/images/I/8116DtW4WWL._AC_SL1500_.jpg",
        type: "keyboard",
        in_stock: true,
        inventory: 12,
      },
      {
        name: "SteelSeries Arctis 5",
        date_created: "2020/02/07",
        description: "SteelSeries Arctis 5 Headset. Microphone does not work.",
        price: 65.99,
        image_url:
          "https://images-na.ssl-images-amazon.com/images/I/81Y9BnR2%2BhL._AC_SL1500_.jpg",
        type: "headset",
        in_stock: false,
        inventory: 0,
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
    const adminUser = {
      username: "admin",
      password: await bcrypt.hash("password", 10),
      email: "test@example.com",
      name: "Admin",
      admin: true,
    };
    await createUser(adminUser);
    const usersToCreate = [
      {
        username: "BrianPython",
        password: bcrypt.hashSync("AjaxDestroyer44", 10),
        email: "brian_p@gmail.com",
        name: "Brian Pollygren",
        // cart: ["product 1"],
      },
      {
        username: "Shyguy666",
        password: bcrypt.hashSync("appleBoy24", 10),
        email: "shyguy666@yahoo.com",
        name: "Erin Naples",
        // cart: ["product 3"],
      },
      {
        username: "Jessica.Troy",
        password: bcrypt.hashSync("AriGorn7747", 10),
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

const createInitialGuests = async () => {
  console.log("Starting to create initial guests...");
  try {
    const guestsToCreate = [
      {
        email: "guest_shopper@yahoo.com",
        name: "Guest Oneington",
      },
      {
        email: "ilovepcparts@gmail.com",
        name: "Yoko Homoshito",
      },
      {
        email: "ripper_glover49@gmail.com",
        name: "Rodney West",
      },
    ];
    const guests = await Promise.all(guestsToCreate.map(createGuest));
    console.log("guests created:");
    console.log(guests);
    console.log("Finished creating guests!");
  } catch (err) {
    console.error("There was a problem creating GUESTS");
    throw err;
  }
};

async function rebuildDB() {
  try {
    client.connect();
    await buildTables();
    await createInitialProducts();
    await createInitialUsers();
    // await createInitialGuests();
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
    const userWithProduct = await addProductToCart(2, 3, 1);
    console.log("Result:", userWithProduct);

    console.log("Calling addProductToCart Again");
    const userWithSecondProduct = await addProductToCart(2, 1, 2);
    console.log("Result:", userWithSecondProduct);

    console.log("Calling addProductToCart For Different User");
    const secondUserWithProducts = await addProductToCart(3, 5, 2);
    console.log("Result:", secondUserWithProducts);

    console.log("Calling createUserOrder");
    const userOrder = await createUserOrder(2);
    console.log("Results:", userOrder);

    console.log("Calling createUserAddress");
    const userAddress = await createUserAddress({
      user_id: 1,
      street: "167 Milky Way Drive",
      street_2: null,
      state: "NY",
      zip_code: "21188",
    });
    console.log("Results:", userAddress);

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
