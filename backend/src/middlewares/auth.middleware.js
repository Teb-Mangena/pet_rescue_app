import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import pool from "../config/db.js";

export const protectAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const [rows] = await pool.query(
      `
      SELECT
        p.person_id,
        p.email,
        p.first_name,
        p.last_name,
        p.role,
        p.image_url,
        p.location_id,
        p.is_onboarded, 

        COALESCE(
          ia.npo_spca_id,
          m.npo_spca_id
        ) AS npo_spca_id

      FROM person p

      LEFT JOIN itadmin ia
        ON ia.person_id = p.person_id

      LEFT JOIN manager m
        ON m.person_id = p.person_id

      WHERE p.person_id = ?
      `,
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    req.user = user;

    next();
  } catch (error) {
    console.error("protectAuth error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};