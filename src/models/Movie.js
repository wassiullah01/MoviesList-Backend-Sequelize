const {sequelize} = require("../config/db");

sequelize.query(`
  CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imgURL VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    publishYear INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);
