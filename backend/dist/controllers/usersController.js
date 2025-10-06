"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const JWT_SECRET = process.env.JWT_SECRET;
const register = async (req, res) => {
    const { firstName, lastName, country, email, password, age, role_id } = req.body;
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`INSERT INTO users (firstName, lastName, country, email, password, age, role_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`, [firstName, lastName, country, email, hashedPassword, age, role_id]);
        res
            .status(201)
            .json({ message: "User registered successfully", user: result.rows[0] });
    }
    catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required" });
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1 AND is_deleted = 0", [email]);
        if (userResult.rows.length === 0)
            return res.status(400).json({ error: "Invalid email or password" });
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid email or password" });
        const token = jwt.sign({ userId: user.id, email: user.email, role_id: user.role_id }, JWT_SECRET, { expiresIn: "6d" });
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
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, firstName, lastName, email, country, age, role_id, created_at 
       FROM users 
       WHERE is_deleted = 0`);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("GetAllUsers Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getUserById = async (req, res) => {
    const user_id = req.user.userId;
    try {
        const result = await pool.query("SELECT * FROM users where  users.id=$1", [
            user_id,
        ]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("GetAllUsers Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const googleLogin = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }
    try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
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
            const insert = await pool.query(`INSERT INTO users (firstname, lastname, email, password, country, age, role_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *`, [given_name, family_name, email, null, "N/A", 0, 1]);
            user = insert.rows[0];
        }
        else {
            user = userResult.rows[0];
        }
        const appToken = jwt.sign({ userId: user.id, email: user.email, role_id: user.role_id }, JWT_SECRET, { expiresIn: "6d" });
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
    }
    catch (err) {
        console.error("Google Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, country, email } = req.body;
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const emailExists = await pool.query("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: "Email is already in use by another user" });
        }
        const result = await pool.query(`UPDATE users
       SET firstName = $1, lastName = $2, country = $3, email = $4
       WHERE id = $5
       RETURNING *`, [firstName, lastName, country, email, id]);
        res.status(200).json({ message: "User updated successfully", user: result.rows[0] });
    }
    catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
const updateAvatar = async (req, res) => {
    const { id } = req.params;
    const { avatar } = req.body; // رابط الصورة الجديد
    if (!avatar) {
        return res.status(400).json({ error: "Avatar URL is required" });
    }
    try {
        // تأكد إن المستخدم موجود
        const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        // حدث الـ avatar فقط
        const result = await pool.query(`UPDATE users
       SET avatar = $1
       WHERE id = $2
       RETURNING *`, [avatar, id]);
        res.status(200).json({
            message: "Avatar updated successfully",
            user: result.rows[0],
        });
    }
    catch (err) {
        console.error("Update Avatar Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    googleLogin,
    updateUser,
    updateAvatar
};
//# sourceMappingURL=usersController.js.map