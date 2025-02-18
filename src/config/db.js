const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("moviedb_cli", "root", "ley6895@", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false, // Set to true if you want to see SQL queries in the console
}); 

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("moviedb_cli Database connected!");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };