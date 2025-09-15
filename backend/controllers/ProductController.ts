const express = require("express");
const pool = require("../models/db");

// GET /products  -> list all products
const getAllProduct = async (req: any, res: any) => {
try{
const result = await pool.query ('SELECT * FROM products WHERE is_deleted = 0;')
    res.status(200).json({
    success: true,
    products: result.rows,
    });
}
catch (err:any){
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
}
};

module.exports = { getAllProduct };
