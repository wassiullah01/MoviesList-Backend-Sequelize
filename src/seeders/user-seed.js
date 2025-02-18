"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const admins = await queryInterface.sequelize.query(
      `SELECT u.* 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE r.name = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (admins.length > 0) {
      console.log("Admin already exists:", admins[0]);
      return;
    }

    const roles = await queryInterface.sequelize.query(
      `SELECT * FROM roles WHERE name = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (roles.length === 0) {
      console.log("Admin role not found");
      return;
    }
    const adminRole = roles[0];

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash("54321", salt);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role_id: adminRole.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", { email: "admin@gmail.com" }, {});
  },
};