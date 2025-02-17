const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: User Signup
 *     description: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/signup", userController.signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user and return JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: User Logout
 *     description: Logs the user out by clearing the JWT cookie.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", userController.logout);

module.exports = router;