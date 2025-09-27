import type { Request, Response } from "express";
const pool = require("../models/db");

interface AuthRequest extends Request {
  user?: { userId: number };
}

const addToCart = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.userId;
  const { product_id, quantity } = req.body as {
    product_id: number;
    quantity: number;
  };

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "You have to login" });
  }

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be > 0" });
  }

  try {
    let cart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    let cart_id: number;
    if (cart.rows.length === 0) {
      const newCart = await pool.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING id`,
        [user_id]
      );
      cart_id = newCart.rows[0].id;
    } else {
      cart_id = cart.rows[0].id;
    }

    const existingItem = await pool.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cart_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
        [quantity, cart_id, product_id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [cart_id, product_id, quantity]
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to add to cart" });
  }
};

const getCartByUser = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.userId;

  if (!user_id) {
    return res.status(401).json({ success: false, message: "Invalid user_id" });
  }

  try {
    const result = await pool.query(
      `SELECT cart_items.product_id,
              cart_items.quantity,
              products.title,
              products.price,
              products.image_urls
       FROM cart
       JOIN cart_items ON cart.id = cart_items.cart_id
       JOIN products ON cart_items.product_id = products.id
       WHERE cart.user_id = $1
         AND cart.is_deleted = 0`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found or empty" });
    }

    return res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch cart" });
  }
};

const softDeleteCartById = async (req: Request, res: Response) => {
  const cartId = Number(req.params.id);

  if (isNaN(cartId)) {
    return res.status(400).json({ success: false, message: "Wrong cart id" });
  }

  try {
    const result = await pool.query(
      `UPDATE cart SET is_deleted = 1 WHERE id = $1 RETURNING *`,
      [cartId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting cart:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed delete cart" });
  }
};
const updateCartItemQuantity = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.userId;
  const { product_id, quantity } = req.body as {
    product_id: number;
    quantity: number;
  };

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "You have to login" });
  }

  if (!product_id || quantity == null) {
    return res.status(400).json({
      success: false,
      message: "product_id and quantity are required",
    });
  }

  try {
    const cartResult = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cart_id = cartResult.rows[0].id;

    if (quantity <= 0) {
      await pool.query(
        `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cart_id, product_id]
      );
      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
      });
    }

    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1 
       WHERE cart_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, cart_id, product_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating quantity:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update quantity" });
  }
};
const deleteCartItem = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.userId;
  const { product_id } = req.params; // product id from URL

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "You have to login" });
  }

  try {
    // Get cart id for this user
    const cartResult = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cart_id = cartResult.rows[0].id;

    // Delete the item from cart_items
    const result = await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
      [cart_id, product_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (err) {
    console.error("Error deleting product from cart:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete product from cart" });
  }
};
const clearCart = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?.userId;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "You have to login" });
  }

  try {
    const cartResult = await pool.query(
      `SELECT id FROM cart WHERE user_id = $1 AND is_deleted = 0`,
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cart_id = cartResult.rows[0].id;

    await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id]);

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to clear cart" });
  }
};
module.exports = {
  addToCart,
  getCartByUser,
  softDeleteCartById,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};
