const express = require("express");
const cartRouter = express.Router();
const {addToCart,getCartByUser,softDeleteCartById} = require("../controllers/cartController")


cartRouter.post("/add", addToCart);
cartRouter.get("/", getCartByUser);
cartRouter.delete("/delete/:id", softDeleteCartById);

module.exports = cartRouter




































