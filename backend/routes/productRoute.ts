const express = require("express");
const  productRouter= express.Router();
const {getAllProduct, createProduct, updateProduct, softDeleteProduct}=require("../controllers/ProductController")


// create path ===> POST http://localhost:5000/products
productRouter.post("/", createProduct);

// get path ===> GET http://localhost:5000/products
productRouter.get("/",getAllProduct);

// update  path ===> put http://localhost:5000/products/:id
productRouter.put("/:id", updateProduct);

// softDeleted path ===> delete http://localhost:5000/products/:id
productRouter.delete("/:id", softDeleteProduct);

module.exports = productRouter;
























