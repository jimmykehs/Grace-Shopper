const apiRouter = require("express").Router();
const usersRouter = require("./Users");
const productsRouter = require("./Products");
require("dotenv").config();

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
