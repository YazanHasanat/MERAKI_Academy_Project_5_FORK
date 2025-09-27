import type e = require("express");
import type { Request, Response } from "express";

const pool = require("../models/db");
export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role_id: number;
  };
}
const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user.userId;
  try {
    const {
      location_id,
      products,
      status,
      pay_method,
      total_price,
      full_name,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO orders (user_id,location_id, products, status, pay_method,total_price,full_name)
      VALUES ($1, $2, $3, $4,$5,$6,$7)
      RETURNING *;
    `,
      [
        user_id,
        location_id,
        JSON.stringify(products),
        status,
        pay_method,
        total_price,
        full_name,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error creating order:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAllOrders = async (req: any, res: e.Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE is_deleted = 0 ORDER BY created_at DESC`
    );
    res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const getOrdersByUser = async (req: any, res: e.Response) => {
  const user_id = req.user.userId;
  try {
    const result = await pool.query(
      `
    SELECT 
      orders.*, 
      locations.*
    FROM orders
    JOIN locations 
      ON orders.location_id = locations.id
    WHERE orders.user_id = $1
      AND orders.is_deleted = 0
  `,
      [user_id]
    );
    res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const softDeleteOrder = async (req: any, res: e.Response) => {
  const { order_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders SET is_deleted = 1 WHERE id = $1 RETURNING *`,
      [order_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error soft-deleting order:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const updateOrderStatus = async (req: any, res: e.Response) => {
  const { order_id, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, order_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  softDeleteOrder,
  updateOrderStatus,
};
