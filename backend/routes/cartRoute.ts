const express = require("express");
const cartRouter = express.Router();
const {addToCart,getCartByUser,softDeleteCartById,updateCartItemQuantity} = require("../controllers/cartController")
const authentication=require("../middleware/authentication")

cartRouter.post("/add",authentication, addToCart);
cartRouter.get("/",authentication, getCartByUser);
cartRouter.delete("/delete/:id",authentication, softDeleteCartById);
cartRouter.put("/update",authentication, updateCartItemQuantity);
module.exports = cartRouter




































