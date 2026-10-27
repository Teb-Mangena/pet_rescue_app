import pool from "../config/db.js";

// 1. Create a new Organization (NPO / SPCA branch)
export const createOrganization = async (req, res) => {
  const { npo_spca_name, phone, email, org_type_id, location_id } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO npo_spca (
         npo_spca_name, phone, email, created_at, org_type_id, location_id
       ) VALUES (?, ?, ?, CURRENT_DATE(), ?, ?)`,
      [npo_spca_name, phone, email, org_type_id, location_id],
    );

    res.status(201).json({
      message: "Organization created successfully!",
      npo_spca_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// 2. Assign a user to be a Manager of an Organization
export const assignManagerRole = async (req, res) => {
  const { person_id, npo_spca_id } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Upgrade the user's role in the person table
    await connection.query(
      `UPDATE person SET role = 'manager' WHERE person_id = ?`,
      [person_id],
    );

    // Step 2: Link the user to the specific NPO in the manager table
    const [result] = await connection.query(
      `INSERT INTO manager (person_id, npo_spca_id) VALUES (?, ?)`,
      [person_id, npo_spca_id],
    );

    await connection.commit();

    res.status(201).json({
      message:
        "User successfully upgraded to Manager and assigned to the organization!",
      manager_id: result.insertId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error assigning manager:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  } finally {
    connection.release();
  }
};
