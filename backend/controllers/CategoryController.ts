const pool = require("../models/db");
import type { Request, Response } from "express";

const createCategory = async (req: Request, res: Response) => {
  const { name, description, image_url } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO category (name, description, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {createCategory};