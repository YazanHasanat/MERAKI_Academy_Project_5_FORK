const express = require("express");
const productRouter = express.Router();
const {
  getAllProduct,
  createProduct,
  updateProduct,
  softDeleteProduct,
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  createRating,
  
} = require("../controllers/ProductController");



// create path ===> POST http://localhost:5000/products
productRouter.post("/", createProduct);

// get path ===> GET http://localhost:5000/products
productRouter.get("/", getAllProduct);

// http://localhost:5000/products/featured
productRouter.get("/featured",getFeaturedProducts)

// update  path ===> put http://localhost:5000/products/:id
productRouter.put("/:id", updateProduct);

// softDeleted path ===> delete http://localhost:5000/products/:id
productRouter.delete("/:id", softDeleteProduct);

 // http://localhost:5000/products/category/:categoryId
productRouter.get( "/category/:categoryId",getProductsByCategory);

// http://localhost:5000/products/:id
productRouter.get("/:id", getProductById);

// http://localhost:5000/products/:id/ratings
productRouter.post("/products/:id/rating", createRating);



module.exports = productRouter;