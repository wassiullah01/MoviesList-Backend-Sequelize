// File: src/seeders/role.seed.js
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

const seedData = async () => {
  try {
    // Delete all records from roles table
    await sequelize.query(`DELETE FROM roles`, { type: QueryTypes.BULKDELETE });
    console.log("Roles deleted successfully");

    // Insert seed data
    await sequelize.query(
      `INSERT INTO roles (name, created_at, updated_at)
       VALUES 
         ('admin', NOW(), NOW()),
         ('user', NOW(), NOW())`
    );
    console.log("Roles added successfully");
  } catch (error) {
    console.error("Error while seeding roles:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedData();