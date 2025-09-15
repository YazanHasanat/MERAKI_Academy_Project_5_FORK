const express = require("express");
const router = express.Router();

const productController = require("../controllers/ProductController");


router.use("/", productController);

module.exports = router;
























