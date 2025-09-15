const express = require("express");
const router = express.Router();
const pool = require("../models/db");


// GET /products  -> list all products ( filters: category_id, user_id, is_feature, q search)
router.get("/", async (req: any, res: any) => {
  const { category_id, user_id, is_feature, q, limit, offset } = req.query;
  const params: any[] = [];
  const where: string[] = [];

  if (category_id) { params.push(Number(category_id)); where.push(`category_id = $${params.length}`); }
  if (user_id) { params.push(Number(user_id)); where.push(`user_id = $${params.length}`); }
  if (typeof is_feature !== "undefined") { 
    params.push(String(is_feature)); 
    where.push(`is_feature = $${params.length}`); 
  }
  if (q) {
    params.push(`%${q}%`);
    where.push(`(title  $${params.length} OR description $${params.length})`);
  }

  const limitClause = typeof limit !== "undefined" ? ` LIMIT ${Number(limit)}` : "";
  const offsetClause = typeof offset !== "undefined" ? ` OFFSET ${Number(offset)}` : "";
  const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

  const sql = `
    SELECT id, title, description, image_url, category_id, price, user_id, is_feature, created_at
    FROM products
    ${whereClause}
    ORDER BY created_at DESC, id DESC
    ${limitClause} ${offsetClause};
  `;

  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err: any) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
module.exports = router;