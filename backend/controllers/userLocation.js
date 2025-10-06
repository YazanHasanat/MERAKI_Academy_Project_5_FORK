"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool = require("../models/db");
const createLocation = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { address, latitude, longitude } = req.body;
        const result = await pool.query(`
      INSERT INTO user_locations (user_id, address, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [user_id, address, latitude, longitude]);
        res.status(200).json({
            success: true,
            location: result.rows[0],
        });
    }
    catch (err) {
        console.error("Error fetching orders:", err.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
const getLocationById = async (req, res) => {
    const user_id = req.user.userId;
    try {
        const result = await pool.query("SELECT * FROM user_locations WHERE user_id=$1", [user_id]);
        res.status(200).json({
            success: true,
            location: result.rows[0],
        });
    }
    catch (err) {
        console.error("Error fetching orders:", err.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
const updateLocation = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { address, latitude, longitude } = req.body;
        const result = await pool.query(`
      UPDATE user_locations
      SET address = $1,
          latitude = $2,
          longitude = $3
      WHERE user_id = $4
      RETURNING *;
    `, [address, latitude, longitude, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Location not found" });
        }
        res.status(200).json({
            success: true,
            location: result.rows[0],
        });
    }
    catch (err) {
        console.error("Error updating location:", err.message);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
module.exports = { createLocation, getLocationById, updateLocation };
//# sourceMappingURL=userLocation.js.map