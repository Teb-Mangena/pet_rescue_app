import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { genToken } from "../config/genToken.js";
import { isValidEmail } from "../utils/validateEmail.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  // --- VALIDATION ---
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const [existingUsers] = await pool.query(
      `SELECT email FROM person WHERE email = ?`,
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [personResult] = await pool.query(
      `INSERT INTO person (email, password, is_onboarded, created_at) VALUES (?, ?, FALSE, CURRENT_DATE())`,
      [email, hashedPassword],
    );

    const personId = personResult.insertId;

    genToken(res, personId);

    res.status(201).json({
      message: "Account created successfully. Please complete onboarding.",
      person_id: personId,
      is_onboarded: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

export const onboard = async (req, res) => {
  const personId = req.user.person_id;

  const {
    first_name,
    last_name,
    username,
    phone,
    contact_pref_id,
    location_id,
    role,
  } = req.body;

  // --- VALIDATION ---
  if (
    !first_name ||
    !last_name ||
    !username ||
    !phone ||
    // !contact_pref_id ||
    // !location_id ||
    !role
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required to complete onboarding." });
  }
  if (!["pet_owner", "community_member"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Role must be 'pet_owner' or 'community_member'." });
  }
  // ------------------

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsernames] = await connection.query(
      `SELECT username FROM person WHERE username = ? AND person_id != ?`,
      [username, personId],
    );

    if (existingUsernames.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "Username is already taken." });
    }

    const profileImage = `https://ui-avatars.com/api/?name=${first_name}+${last_name}&background=random`;

    await connection.query(
      `UPDATE person 
       SET first_name = ?, last_name = ?, username = ?, phone = ?, contact_pref_id = ?, location_id = ?, image_url = ?, role = ?, is_onboarded = TRUE 
       WHERE person_id = ?`,
      [
        first_name,
        last_name,
        username,
        phone,
        contact_pref_id,
        location_id,
        profileImage,
        role,
        personId,
      ],
    );

    if (role === "pet_owner") {
      await connection.query(`INSERT INTO pet_owner (person_id) VALUES (?)`, [
        personId,
      ]);
    } else if (role === "community_member") {
      await connection.query(
        `INSERT INTO community_member (person_id) VALUES (?)`,
        [personId],
      );
    }

    await connection.commit();

    res.status(200).json({
      message: "Onboarding complete.",
      person_id: personId,
      role,
      image_url: profileImage,
      is_onboarded: true,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      message: "Server error during onboarding.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  // --- VALIDATION ---
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username/Email and password are required." });
  }
  // ------------------

  try {
    const [users] = await pool.query(
      `SELECT person_id, password FROM person WHERE email = ? OR username = ?`,
      [identifier, identifier],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const [roles] = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM pet_owner WHERE person_id = ?) AS is_owner,
        (SELECT COUNT(*) FROM community_member WHERE person_id = ?) AS is_member,
        (SELECT COUNT(*) FROM manager WHERE person_id = ?) AS is_manager,
        (SELECT COUNT(*) FROM itadmin WHERE person_id = ?) AS is_itadmin`,
      [user.person_id, user.person_id, user.person_id, user.person_id],
    );

    let userRole = "unknown";
    if (roles[0].is_owner > 0) userRole = "pet_owner";
    else if (roles[0].is_member > 0) userRole = "community_member";
    else if (roles[0].is_manager > 0) userRole = "manager";
    else if (roles[0].is_itadmin > 0) userRole = "itadmin";

    genToken(res, user.person_id);

    res.status(200).json({
      message: "Login successful.",
      role: userRole,
      person_id: user.person_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: "Error logging out",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      message: "user is logged in",
      user: req.user,
    });
  } catch (error) {
    console.log("Error in check auth", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
