"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require("../models/db");
const createRole = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const result = await pool.query(`INSERT INTO roles (name, permissions) VALUES ($1, $2) RETURNING *`, [name, permissions]);
        res.status(201).json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getAllRoles = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM roles`);
        res.status(200).json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { createRole, getAllRoles };
//# sourceMappingURL=rolesController.js.map