const express = require("express");
const  locationRouter= express.Router();
const {createLocation,getLocationById}=require("../controllers/userLocation")

locationRouter.post("/",createLocation)
locationRouter.get("/",getLocationById)






module.exports =locationRouter