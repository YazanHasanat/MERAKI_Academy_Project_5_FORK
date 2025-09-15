const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/CategoryController")



categoryRouter.post("/", categoryController.createCategory);





module.exports = categoryRouter;