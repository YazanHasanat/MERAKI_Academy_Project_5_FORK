const pool = require("../models/db");
import type { Request, Response } from "express";

const createLocation = async (req: Request, res: Response) => {
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

const getLocationById=async(req:Request,res:Response)=>{
  const {user_id}=req.body
  try{
    const result=await pool.query("SELECT * FROM user_locations WHERE user_id=$1",[user_id])
    res.status(200).json({
      success: true,
      location: result.rows,
    });
  }
  catch(err:any){
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = { createLocation,getLocationById };
