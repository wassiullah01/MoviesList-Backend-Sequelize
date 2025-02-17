const { sequelize } = require('../config/db');

const seedData = async () => {
  try {
    await sequelize.query(
      `INSERT INTO permissions (name, created_at, updated_at)
       VALUES 
         ('view', NOW(), NOW()),
         ('create', NOW(), NOW()),
         ('update', NOW(), NOW()),
         ('delete', NOW(), NOW())`
    );
    console.log("Permissions added successfully");
  } catch (error) {
    console.error("Error while seeding permissions:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedData();
