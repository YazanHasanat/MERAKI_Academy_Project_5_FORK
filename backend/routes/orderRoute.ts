const express = require("express");
const orderRoute = express.Router();
const {createOrder,getAllOrders,getOrdersByUser,softDeleteOrder,updateOrderStatus}=require("../controllers/orderControllers")
const authentication=require("../middleware/authentication")


orderRoute.post("/",authentication, createOrder);
//path==>http://localhost:5000/orders


orderRoute.get("/", getAllOrders);
//path==>http://localhost:5000/orders

orderRoute.get("/userorders",authentication, getOrdersByUser);
//path==>http://localhost:5000/orders/userorders


orderRoute.put("/delete",softDeleteOrder)

//path==>http://localhost:5000/orders/delete

orderRoute.put("/status",updateOrderStatus)

//path==>http://localhost:5000/orders/status



















module.exports = orderRoute;