const express = require("express");
const { getAdminPermissions, getUserPermissions, updateUserPermissions } = require("../controllers/adminController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API endpoints for admin permissions management
 */

/**
 * @swagger
 * /api/permissions/admin-permissions:
 *   get:
 *     summary: Get all admin permissions
 *     description: Retrieve all users and their assigned permissions.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched admin permissions
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.get("/admin-permissions", authMiddleware, getAdminPermissions);

/**
 * @swagger
 * /api/permissions/user-permissions:
 *   get:
 *     summary: Get user permissions
 *     description: Retrieve the permissions of the logged-in user.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user permissions
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.get("/user-permissions", authMiddleware, getUserPermissions);

/**
 * @swagger
 * /api/permissions/update-user-permissions:
 *   post:
 *     summary: Update user permissions
 *     description: Assign or remove permissions for a specific user.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
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
 *               permissionType:
 *                 type: string
 *                 example: "view"
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/update-user-permissions", authMiddleware, updateUserPermissions);

module.exports = router;
