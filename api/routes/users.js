const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/users');

router.get("/", checkAuth, UserController.getUsers);

router.post("/signup", UserController.createUser);

router.post("/login", UserController.loginUser);

router.get("/:userId", checkAuth, UserController.getUser);

router.patch("/:userId", checkAuth, UserController.updateUser);

router.delete("/:userId", checkAuth, UserController.deleteUser);

module.exports = router;
