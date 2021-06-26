const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { requireAdmin, requireUser } = require("../Utils/utils.js");

const {
  getAllUsers,
  createUser,
  getUserByUsername,
  verifyUniqueUser,
  client,
} = require("../../db");
const { patchUser } = require("../../db/users/index.js");

//Getting all users
usersRouter.get("/", async (_, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      message: "All Users Grabbed",
      users,
    });
  } catch ({ name, message }) {
    next({ name: "GetAllUsersError", message: "Unable to get all users!" });
  }
});

//Getting user for login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "InvalidInfo",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.id, username: user.username, isAdmin: user.admin },
          process.env.JWT_SECRET
        );
        res.send({ message: "You are now logged in!", token });
      } else {
        next({
          name: "InvalidInfo",
          message: "Invalid credentials, please check username and password",
        });
      }
    } else {
      next({
        name: "InvalidInfo",
        message: "Invalid credentials, please check username and password",
      });
    }
  } catch (err) {
    next(err);
  }
});
//Registering user
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, email, name } = req.body;

  try {
    const existingUser = await verifyUniqueUser(username, email, name);

    if (existingUser != undefined) {
      console.log("User exists");
      if (existingUser.username === username) {
        next({
          name: "DuplicateUsername",
          message: "This username is already in use",
        });
      }
      if (existingUser.email === email) {
        next({
          name: "DuplicateEmail",
          message: "This email is already in use!",
        });
      }
      if (existingUser.name === name) {
        next({
          name: "DuplicateName",
          message: "Someone already has your name. Get a new one",
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser({
        username,
        password: hashedPassword,
        email,
        name,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          isAdmin: newUser.admin,
        },
        process.env.JWT_SECRET
      );

      res.send({ message: "Thanks for signing up!", token });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//Used by admin to toggle isAdmin status
usersRouter.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { admin } = req.body;
    const fields = {
      admin,
    };
    const updatedUser = await patchUser(id, fields);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

//Used by users to update their information
usersRouter.patch("/me/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const fields = {};
  if (name) {
    fields.name = name;
  }
  if (email) {
    fields.email = email;
  }

  try {
    const updatedUser = await patchUser(id, fields);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
