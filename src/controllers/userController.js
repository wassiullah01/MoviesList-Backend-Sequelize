const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret';

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password" });
    }

    const existingUsers = await sequelize.query(
      `SELECT * FROM users WHERE email = ?`,
      { replacements: [email], type: QueryTypes.SELECT }
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists with that email" });
    }

    const roles = await sequelize.query(
      `SELECT * FROM roles WHERE name = ?`,
      { replacements: ['user'], type: QueryTypes.SELECT }
    );
    if (roles.length === 0) {
      return res.status(500).json({ message: "User role not found" });
    }
    const userRole = roles[0];

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [insertResult] = await sequelize.query(
      `INSERT INTO users (username, email, password, role_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      { replacements: [username, email, hashedPassword, userRole.id] }
    );

    const userId = insertResult;
    console.log('is of user is',userId)
    if (!userId) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    await sequelize.query(
      `INSERT INTO user_permissions (user_id, created_at, updated_at)
       VALUES (?, NOW(), NOW())`,
      { replacements: [userId] }
    );

    const users = await sequelize.query(
      `SELECT * FROM users WHERE id = ?`,
      { replacements: [userId], type: QueryTypes.SELECT }
    );
    const savedUser = users[0];

    const tokenPayload = {
      userId: savedUser.id,
      email: savedUser.email,
      role: userRole.name,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

    // Set token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: userRole.name,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "error", message: "Please provide both email and password" });
    }

    const users = await sequelize.query(
      `SELECT u.*, r.name AS roleName FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      { replacements: [email], type: QueryTypes.SELECT }
    );
    if (users.length === 0) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Create JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.roleName,
    };

    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Login Successfully into MovieList",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.roleName,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ status: "error", message: "Error while signing in" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: 'User logged out' });
};
