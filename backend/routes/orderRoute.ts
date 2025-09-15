const express = require("express");
const orderRoute = express.Router();
const {createOrder,getAllOrders,getOrdersByUser,softDeleteOrder}=require("../controllers/orderControllers")



orderRoute.post("/", createOrder);
//path==>http://localhost:5000/orders


orderRoute.get("/", getAllOrders);
//path==>http://localhost:5000/orders

orderRoute.get("/userorders", getOrdersByUser);
//path==>http://localhost:5000/orders/userorders


orderRoute.delete("/delete",softDeleteOrder)

//path==>http://localhost:5000/orders/delete






















module.exports = orderRoute;