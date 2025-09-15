const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/CategoryController")



categoryRouter.post("/", categoryController.createCategory);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.get("/", categoryController.getAllCategory);
categoryRouter.put("/:id", categoryController.updateCategory);
categoryRouter.delete("/:id",categoryController.deleteCategory);




module.exports = categoryRouter;