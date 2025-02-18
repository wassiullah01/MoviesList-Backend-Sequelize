// Creating seeders

// npx sequelize-cli seed:generate --name permission-seed
// npx sequelize-cli seed:generate --name role-seed
// npx sequelize-cli seed:generate --name user-seed

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { name: "view", createdAt: new Date(), updatedAt: new Date() },
      { name: "create", createdAt: new Date(), updatedAt: new Date() },
      { name: "update", createdAt: new Date(), updatedAt: new Date() },
      { name: "delete", createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
     return queryInterface.bulkDelete('permissions', null, {});
  }
};

// Run all seeders

// sequelize-cli db:seed:all