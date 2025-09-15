const express = require("express");


const {register,login,getAllUsers}=require("../controllers/usersController")
const usersRouter = express.Router();
usersRouter.post("/register",register)
usersRouter.post("/login",login)
usersRouter.get("/get",getAllUsers)





module.exports = usersRouter;





































module.exports = usersRouter;