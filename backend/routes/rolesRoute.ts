const express = require("express");
const {createRole,getAllRoles}=require("../controllers/rolesController")
const rolesRouter = express.Router();
rolesRouter.post("/",createRole)
rolesRouter.get("/allroles",getAllRoles)

module.exports = rolesRouter;






































module.exports = rolesRouter;