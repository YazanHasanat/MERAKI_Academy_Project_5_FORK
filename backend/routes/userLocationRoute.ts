const express = require("express");
const  locationRouter= express.Router();
const {createLocation,getLocationById}=require("../controllers/userLocation")
const authentication=require("../middleware/authentication")
locationRouter.post("/",authentication,createLocation)
locationRouter.get("/",authentication,getLocationById)






module.exports =locationRouter