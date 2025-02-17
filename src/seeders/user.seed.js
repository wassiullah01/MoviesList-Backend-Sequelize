// File: src/seeders/user.seed.js
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    const admins = await sequelize.query(
      `SELECT u.* 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE r.name = 'admin'`,
      { type: QueryTypes.SELECT }
    );

    if (admins.length > 0) {
      console.log("Admin already exists:", admins[0]);
      return;
    }

    const roles = await sequelize.query(
      `SELECT * FROM roles WHERE name = 'admin'`,
      { type: QueryTypes.SELECT }
    );
    if (roles.length === 0) {
      console.log("Admin role not found");
      return;
    }
    const adminRole = roles[0];

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash('54321', salt);

    await sequelize.query(
      `INSERT INTO users (username, email, password, role_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      { replacements: ['admin', 'admin@gmail.com', hashedPassword, adminRole.id] }
    );
    console.log("Admin added successfully");
  } catch (error) {
    console.error("Error while seeding admin user:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedData();