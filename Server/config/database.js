const { Sequelize } = require("sequelize");
const { Client } = require("pg");
require("dotenv").config();

/* ================================
   1️⃣ SEQUELIZE INSTANCE
================================ */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

/* ================================
   2️⃣ AUTO-CREATE DATABASE
================================ */
const createDatabaseIfNotExists = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // ✅ must connect to default DB
  });

  try {
    await client.connect();

    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log("✅ Database created successfully");
    } else {
      console.log("✅ Database already exists");
    }

    await client.end();
  } catch (error) {
    console.error("❌ Database creation error:", error.message);
    process.exit(1);
  }
};

/* ================================
   3️⃣ CONNECT & AUTO-SYNC TABLES
================================ */
const connectDB = async () => {
  try {
    await createDatabaseIfNotExists();   // ✅ AUTO CREATE DB
    await sequelize.authenticate();     // ✅ CONNECT
    await sequelize.sync({ alter: true }); // ✅ AUTO CREATE TABLES

    console.log("✅ PostgreSQL connected successfully");
  } catch (error) {
    console.error("❌ PostgreSQL error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
