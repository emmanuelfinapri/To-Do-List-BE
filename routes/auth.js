const express = require("express");
const { login, register, logout } = require("../controllers/auth");
const { loginVerify, logoutVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to register a new user
routes.post("/user", logoutVerify, register);
// Route to log in a user
routes.post("/login", logoutVerify, login);
// Route to log out a user
routes.post("/logout", loginVerify, logout);

module.exports = routes;
