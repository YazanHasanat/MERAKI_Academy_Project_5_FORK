import type e = require("express");
const pool = require("../models/db");

interface TheProduct {
  product_id: number;
  quantity: number;
}

interface AddToCartBody {
  user_id: number;
  product_id: number;
  quantity: number;
}

const addToCart = async (
  req: e.Request<{}, {}, AddToCartBody>,
  res: e.Response
) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    let updatedProducts: TheProduct[] = [];

    if (result.rows.length > 0) {
      const cart = result.rows[0];
      const products: TheProduct[] = JSON.parse(cart.products);

      const existingProduct = products.find((p) => p.product_id === product_id);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        products.push({ product_id, quantity });
      }

      updatedProducts = products;

      await pool.query(`UPDATE cart SET products = $1 WHERE user_id = $2`, [
        JSON.stringify(updatedProducts),
        user_id,
      ]);
    } else {
      updatedProducts = [{ product_id, quantity }];
      await pool.query(`INSERT INTO cart (user_id, products) VALUES ($1, $2)`, [
        user_id,
        JSON.stringify(updatedProducts),
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      products: updatedProducts,
    });
  } catch (err) {
    console.error("adding to cart failed", err);
    res.status(500).json({ success: false, error: "failed to add to cart" });
  }
};

const getCartByUser = async (
  req: e.Request<{}, {}, {}, { user_id: string }>,
  res: e.Response
) => {
  const user_id = Number(req.query.user_id);

  if (isNaN(user_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user_id",
    });
  }

  try {
    const result = await pool.query(
      `SELECT products FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const products: TheProduct[] = JSON.parse(result.rows[0].products);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({
      success: false,
      error: "Failed",
    });
  }
};
const softDeleteCartById = async (
  req: e.Request<{ id: string }, {}, {}>,
  res: e.Response
) => {
  const cartId = Number(req.params.id);

  if (isNaN(cartId)) {
    return res.status(400).json({
      success: false,
      message: "wrong cart id",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE cart SET is_deleted = 1 WHERE id = $1 RETURNING *`,
      [cartId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (err) {
    console.error("deleting failed:", err);
    res.status(500).json({
      success: false,
      error: "Failed delete cart",
    });
  }
};

module.exports = { addToCart, getCartByUser, softDeleteCartById };
