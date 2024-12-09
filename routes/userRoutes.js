const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  updateUserInfo,
  getAllUsers,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Register a new user.
 */
router.post("/", registerUser);

/**
 * Get all users (admin only).
 */
router.get("/", authenticateJWT, getAllUsers);

/**
 * Update user information.
 */
router.put("/", authenticateJWT, updateUserInfo);

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await registerUser(req, res);
  }
);

module.exports = router;
