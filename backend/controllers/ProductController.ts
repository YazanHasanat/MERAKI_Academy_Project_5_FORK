const express = require("express");
const pool = require("../models/db");




// 1. **Create*
const createProduct = async (req: any, res: any): Promise<void> => {
  const { title, description, image_url, category_id, price, user_id, is_feature }: { 
    title: string; 
    description: string; 
    image_url: string; 
    category_id: number; 
    price: number; 
    user_id: number; 
    is_feature?: boolean; 
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO products (title, description, image_url, category_id, price, user_id, is_feature) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, image_url, category_id, price, user_id, is_feature || false] // الافتراضي يكون false إذا لم يتم تحديده
    );
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result.rows, 
    });
  } catch (err: any) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ success: false, error: "server error" });
  }
};
//2 -GET /products  -> list all products
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
}};


const updateProduct = async (req: any, res: any): Promise<void> => {
  const { id } = req.params; 
  const { title, description, image_url, category_id, price, user_id, is_feature, is_deleted }: {
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
      [title, description, image_url, category_id, price, user_id, is_feature, is_deleted, id]
    );

  
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0], 
    });
  } catch (err: any) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ success: false, error: " server error" });
  }
};



module.exports ={ createProduct,getAllProduct,updateProduct};



