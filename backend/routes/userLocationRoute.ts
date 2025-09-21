const express = require("express");
const  locationRouter= express.Router();
const {createLocation,getLocationById,updateLocation}=require("../controllers/userLocation")
const authentication=require("../middleware/authentication")
locationRouter.post("/",authentication,createLocation)
locationRouter.get("/",authentication,getLocationById)
locationRouter.put("/",authentication,updateLocation)





module.exports =locationRouter