const bcrypt = require("bcryptjs");
const db = require("../db");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const [result] = await db.query(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, role || "user"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user information
const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, name } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // Update the user in the database
    const [result] = await db.query(
      "UPDATE users SET email = ?, name = ? WHERE id = ?",
      [email, name, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "User not found or update failed" });
    }

    res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Only allow admins to access this route
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    const [users] = await db.query("SELECT id, email, name, role FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Export functions
module.exports = { registerUser, updateUserInfo, getAllUsers };
