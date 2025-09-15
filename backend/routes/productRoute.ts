const express = require("express");
const  productRouter= express.Router();
const {getAllProduct, createProduct}=require("../controllers/ProductController")


// create path ===> POST http://localhost:5000/products
productRouter.post("/", createProduct);

// get path ===> GET http://localhost:5000/products
productRouter.get("/",getAllProduct);




module.exports = productRouter;
























