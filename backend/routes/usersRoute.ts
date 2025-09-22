const express = require("express");

const authentication=require("../middleware/authentication")
const {register,login,getAllUsers,getUserById,googleLogin,updateUser}=require("../controllers/usersController")
const usersRouter = express.Router();
usersRouter.post("/register",register)
usersRouter.post("/login",login)
usersRouter.get("/get",getAllUsers)
usersRouter.get("/mypage",authentication,getUserById)
usersRouter.post("/google-login", googleLogin);
usersRouter.put("/:id",updateUser)





module.exports = usersRouter;





































module.exports = usersRouter;