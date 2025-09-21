const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const JWT_SECRET = process.env.JWT_SECRET;
type Register = {
  body: {
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    password: string;
    age: number;
    role_id?: number;
  };
};

type Login = {
  body: {
    email: string;
    password: string;
  };
};

type Res = {
  status: (code: number) => Res;
  json: (data: any) => void;
};

const register = async (req: Register, res: Res) => {
  const { firstName, lastName, country, email, password, age, role_id } =
    req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (firstName, lastName, country, email, password, age, role_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
      [firstName, lastName, country, email, hashedPassword, age, role_id]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const login = async (req: Login, res: Res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_deleted = 0",
      [email]
    );

    if (userResult.rows.length === 0)
      return res.status(400).json({ error: "Invalid email or password" });

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: "6d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllUsers = async (req: any, res: Res): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, firstName, lastName, email, country, age, role_id, created_at 
       FROM users 
       WHERE is_deleted = 0`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetAllUsers Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req: any, res: Res): Promise<void> => {
  const user_id = req.user.userId;
  try {
    const result = await pool.query("SELECT * FROM users where  users.id=$1", [
      user_id,
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetAllUsers Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const googleLogin = async (req: any, res: Res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    const googleUser = await response.json();

    if (googleUser.error_description) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const { email, given_name, family_name, picture, sub } = googleUser;

    let userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    let user;
    if (userResult.rows.length === 0) {
      const insert = await pool.query(
        `INSERT INTO users (firstname, lastname, email, password, country, age, role_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *`,
        [given_name, family_name, email, null, "N/A", 0, 2]
      );
      user = insert.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const appToken = jwt.sign(
      { userId: user.id, email: user.email, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: "6d" }
    );

    return res.status(200).json({
      message: "Google login successful",
      token: appToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        picture,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  googleLogin,
};
