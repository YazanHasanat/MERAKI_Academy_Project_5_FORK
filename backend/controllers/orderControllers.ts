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
      `
    SELECT 
      orders.id,
      orders.user_id,
      orders.products,
      orders.status,
      orders.pay_method,
      orders.created_at,
      orders.total_price,
      orders.full_name,
      orders.is_deleted,
      orders.location_id AS order_location_id,
      user_locations.id AS location_id,
      user_locations.address,
      user_locations.latitude,
      user_locations.longitude
      FROM orders
      JOIN user_locations 
      ON orders.location_id = user_locations.id
      WHERE orders.is_deleted = 0
      AND orders.status = 'pending'
  `
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
      orders.id,
      orders.user_id,
      orders.products,
      orders.status,
      orders.pay_method,
      orders.created_at,
      orders.total_price,
      orders.full_name,
      orders.is_deleted,
      orders.location_id AS order_location_id,
      user_locations.id AS location_id,
      user_locations.address,
      user_locations.latitude,
      user_locations.longitude
    FROM orders
    JOIN user_locations 
      ON orders.location_id = user_locations.id
    WHERE orders.user_id = $1
      AND orders.is_deleted = 0
       ORDER BY orders.created_at DESC
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
const getOrdersInfo = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
          o.id AS order_id,
          o.user_id,
          u.firstname,
          p.id AS product_id,
          p.title,
          p.image_urls[1] AS image_url,
          pr.quantity,
          p.price,
          p.category_id,
          o.status,
          o.pay_method,
          o.created_at
      FROM orders o
      JOIN users u ON u.id = o.user_id
      CROSS JOIN LATERAL jsonb_to_recordset(o.products) AS pr(product_id INT, quantity INT)
      JOIN products p ON p.id = pr.product_id
      WHERE o.is_deleted = 0
      ORDER BY o.id DESC;
    `;

    const result = await pool.query(query);

    const ordersMap: any = {};

    result.rows.forEach((row: any) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          full_name: row.full_name,
          status: row.status,
          pay_method: row.pay_method,
          created_at: row.created_at,
          products: [],
        };
      }

      ordersMap[row.order_id].products.push({
        product_id: row.product_id,
        title: row.title, 
        quantity: row.quantity,
        price: row.price,
        categoryId: row.category_id,
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  softDeleteOrder,
  updateOrderStatus,
  getOrdersInfo,
};
