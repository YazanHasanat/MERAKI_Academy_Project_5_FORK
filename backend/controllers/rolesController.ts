
const pool = require("../models/db");

type Req = { body: { name: string; permissions: string[] } };
type Res = { 
  status: (code: number) => Res; 
  json: (data: any) => void; 
};

const createRole = async (req: Req, res: Res): Promise<void> => {
  const { name, permissions } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO roles (name, permissions) VALUES ($1, $2) RETURNING *`,
      [name, permissions]
    );
    res.status(201).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
const getAllRoles = async (req: Req, res: Res): Promise<void> => {
    try {
      const result = await pool.query(`SELECT * FROM roles`);
      res.status(200).json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports ={ createRole,getAllRoles };