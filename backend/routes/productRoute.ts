const express = require("express");
const  productRouter= express.Router();
const {getAllProduct}=require("../controllers/ProductController")

productRouter.get("/",getAllProduct);

module.exports = productRouter;
























