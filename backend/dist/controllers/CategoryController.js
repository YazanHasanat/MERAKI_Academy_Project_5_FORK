"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require("../models/db");
const createCategory = async (req, res) => {
    const { name, description, image_url } = req.body;
    try {
        const result = await pool.query("INSERT INTO category (name, description, image_url) VALUES ($1, $2, $3) RETURNING *", [name, description, image_url]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM category WHERE id=$1 AND is_deleted=0", [id]);
        if (!result.rows.length) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getAllCategory = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM category WHERE is_deleted=0");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    try {
        const result = await pool.query("UPDATE category SET name=$1, description=$2, image_url=$3 WHERE id=$4 RETURNING *", [name, description, image_url, id]);
        if (!result.rows.length) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("UPDATE category SET is_deleted=1 WHERE id=$1 RETURNING *", [id]);
        if (!result.rows.length) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { createCategory, getCategoryById, getAllCategory, updateCategory, deleteCategory };
//# sourceMappingURL=CategoryController.js.map