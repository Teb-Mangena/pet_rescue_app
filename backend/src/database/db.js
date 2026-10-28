import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: ENV.HOST,
      user: ENV.USER,
      password: ENV.PASSWORD,
      multipleStatements: true,
    });

    console.log("⏳ Connecting to database server...");

    // FIXED: Used backticks (`) instead of single quotes (') for MySQL identifiers
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${ENV.DATABASE}\``);
    await connection.query(`USE \`${ENV.DATABASE}\``);

    // Reference the dump file verbatim as requested, located in this same folder
    const sqlFilePath = path.join(__dirname, "SQL Script.sql");
    const sqlDump = fs.readFileSync(sqlFilePath, "utf8");

    console.log("⏳ Reading and executing SQL Script.sql...");

    // Temporarily disable foreign key checks to prevent insertion order conflicts
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    // Execute the entire dump file
    await connection.query(sqlDump);

    // Re-enable foreign key checks
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Database seeded successfully with all tables and data!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed.");
    }
  }
}

// Run the seed function if this file is executed directly via the terminal
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
