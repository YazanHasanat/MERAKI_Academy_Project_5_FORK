const express = require("express");

const authentication = require("../middleware/authentication");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  googleLogin,
  updateUser,
  updateAvatar,
} = require("../controllers/usersController");
const usersRouter = express.Router();
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/get", getAllUsers);
usersRouter.get("/mypage", authentication, getUserById);
usersRouter.post("/google-login", googleLogin);
usersRouter.put("/:id", updateUser);

usersRouter.put("/avatar/:id", updateAvatar);

module.exports = usersRouter;

module.exports = usersRouter;
