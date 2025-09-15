const express = require("express");
const  locationRouter= express.Router();
const {createLocation}=require("../controllers/userLocation")

locationRouter.post("/",createLocation)







module.exports =locationRouter