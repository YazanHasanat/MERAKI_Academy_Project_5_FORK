const pool = require("../models/db");

const createLocation = async (req: any, res: any) => {
  try {
    const { user_id, address, latitude, longitude, is_deleted } = req.body;
    const result = await pool.query(
      `
      INSERT INTO user_locations (user_id, address, latitude, longitude, is_deleted)
      VALUES ($1, $2, $3, $4,$5)
      RETURNING *;
    `,
      [user_id, address, latitude, longitude, is_deleted]
    );
    res.status(200).json({
      success: true,
      location: result.rows,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = { createLocation };
