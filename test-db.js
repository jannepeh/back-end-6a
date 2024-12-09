const mysql = require("mysql2/promise");
require("dotenv").config();

const testDbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Database connection successful!");
    await connection.end();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

testDbConnection();
