"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const categoryRouter = express.Router();
const authntication = require("../middleware/authentication");
const categoryController = require("../controllers/CategoryController");
categoryRouter.post("/", authntication, categoryController.createCategory);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.get("/", categoryController.getAllCategory);
categoryRouter.put("/:id", categoryController.updateCategory);
categoryRouter.delete("/:id", categoryController.deleteCategory);
module.exports = categoryRouter;
//# sourceMappingURL=CategoryRoute.js.map