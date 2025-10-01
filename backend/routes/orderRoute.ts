const express = require("express");
const orderRoute = express.Router();
const {createOrder,getAllOrders,getOrdersByUser,softDeleteOrder,updateOrderStatus,getOrdersInfo}=require("../controllers/orderControllers")
const authentication=require("../middleware/authentication")


orderRoute.post("/",authentication, createOrder);
//path==>http://localhost:5000/orders


orderRoute.get("/", getAllOrders);
//path==>http://localhost:5000/orders

orderRoute.get("/userorders",authentication, getOrdersByUser);
//path==>http://localhost:5000/orders/userorders


orderRoute.put("/delete",softDeleteOrder)

//path==>http://localhost:5000/orders/delete

orderRoute.put("/status",authentication,updateOrderStatus)

//path==>http://localhost:5000/orders/status


orderRoute.get("/info",getOrdersInfo)
//path==>http://localhost:5000/orders/info

















module.exports = orderRoute;