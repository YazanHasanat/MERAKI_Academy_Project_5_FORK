const express = require("express");
const pool = require("../models/db");
import type { Request, Response } from "express";

// 1. **Create*
const createProduct = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    image_urls,
    category_id,
    price,
    is_feature,
  }: {
    title: string;
    description: string;
    image_urls: string[]; 
    category_id: number;
    price: number;
    is_feature?: boolean;
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products 
        (title, description, image_urls, category_id, price, is_feature) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        title,
        description,
        image_urls, 
        category_id,
        price,
        is_feature || false,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created",
      product: result.rows,
    });
  } catch (err: any) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ success: false, error: "server error" });
  }
};

//2 -GET /products  -> list all products
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE is_deleted = 0;"
    );
    res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: " server error" });
  }
};

// 3- put /updateProducts
const updateProduct = async (req: Request, res: any): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    description,
    image_url,
    category_id,
    price,
    user_id,
    is_feature,
    is_deleted,
  }: {
    title?: string;
    description?: string;
    image_url?: string;
    category_id?: number;
    price?: number;
    user_id?: number;
    is_feature?: boolean;
    is_deleted?: boolean;
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE products SET title = $1, description = $2, image_url = $3, category_id = $4, price = $5, user_id = $6, is_feature = $7, is_deleted = $8 WHERE id = $9 RETURNING *",
      [
        title,
        description,
        image_url,
        category_id,
        price,
        user_id,
        is_feature,
        is_deleted,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated ",
      product: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ success: false, error: " server error" });
  }
};
// 4. **Soft Delete**
const softDeleteProduct = async (req: any, res: any): Promise<void> => {
  const { id }: { id: number } = req.params;

  try {
    const result = await pool.query(
      "UPDATE products SET is_deleted = 1 WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted",
      product: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ success: false, error: " server error" });
  }
};
// 5. **Get Products by Category**
const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        products.*,
        category.name AS category_name
      FROM products
      INNER JOIN category ON products.category_id = category.id
      WHERE products.is_deleted = 0
        AND products.category_id = $1
      `,
      [categoryId]
    );

    res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching products by category:", err.message);
    res.status(500).json({ success: false, error: "server error" });
  }
};
// 6. **Get Product by ID**
const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE is_deleted = 0
        AND id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product: result.rows[0],
    });
  } catch (err: any) {
    console.error("Error fetching product by id:", err.message);
    res.status(500).json({ success: false, error: "server error" });
  }
};
// 7. **Get Featured Products**
const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE is_feature = true AND is_deleted = 0"
    );

    res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching featured products:", err.message);
    res.status(500).json({ success: false, error: "server error" });
  }
};
// 8. ** Create Rating **
const createRating = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, userId }: { rating: number; userId: number } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 0 and 5",
    });
  }

  try {
    const existingRating = await pool.query(
      "SELECT * FROM ratings WHERE product_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (existingRating.rows.length > 0) {

      await pool.query(
        "UPDATE ratings SET rating = $1, created_at = CURRENT_TIMESTAMP WHERE product_id = $2 AND user_id = $3",
        [rating, id, userId]
      );
    } else {
   
      await pool.query(
        "INSERT INTO ratings (product_id, user_id, rating) VALUES ($1, $2, $3)",
        [id, userId, rating]
      );
    }

    res.status(201).json({
      success: true,
      message: " submitted successfully",
    });
  } catch (err: any) {
    console.error("Error creating rating:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 9. **Get product ratings**
const getProductRatings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.query; 

  try {
    const result = await pool.query(
      "SELECT rating FROM ratings WHERE product_id = $1",
      [id]
    );
    const ratings = result.rows;
    const averageRating = ratings.length
      ? ratings.reduce((acc: number, curr: { rating: string }) => acc + parseFloat(curr.rating), 0) / ratings.length
      : 0;

    let userRating = null;
    if (userId) {
      const userRes = await pool.query(
        "SELECT rating FROM ratings WHERE product_id = $1 AND user_id = $2",
        [id, userId]
      );
      if (userRes.rows.length > 0) {
        userRating = userRes.rows[0].rating;
      }
    }

    res.status(200).json({
      success: true,
      averageRating,
      userRating,
      ratingsCount: ratings.length
    });

  } catch (err: any) {
    console.error("Error ratings:", err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


module.exports = {
  createProduct,
  getAllProduct,
  updateProduct,
  softDeleteProduct,
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  createRating,
  getProductRatings
};
