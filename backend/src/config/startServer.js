import pool from "./db.js";
import { ENV } from "./env.js";

export const startServer = async (app) => {
  const { PORT } = ENV;

  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MySQL database connection failed:", error);
    process.exit(1);
  }
};
