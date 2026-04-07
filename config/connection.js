require("dotenv").config();

const Sequelize = require("sequelize");

if (process.env.DB_PASSWORD === "ChangeMe!") {
  console.error("Please update the .env file with your database password.");
  process.exit(1);
}

// replacing JAWSDB_URL with DATABASE_URL
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
      }
    );

module.exports = sequelize;
