import pool from "../config/db.js";

export const getUserProfile = async (req, res) => {
  const personId = req.user.person_id;

  try {
    const [users] = await pool.query(
      `SELECT 
         person_id, email, first_name, last_name, username, 
         phone, image_url, role, location_id, contact_pref_id, 
         is_onboarded, created_at
       FROM person 
       WHERE person_id = ?`,
      [personId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const userProfile = users[0];

    // If Pet Owner: Fetch their pets
    if (userProfile.role === "pet_owner") {
      const [pets] = await pool.query(
        `SELECT p.pet_id, p.pet_name, p.pet_status, p.image_url, s.species_name 
         FROM pet p
         JOIN pet_owner po ON p.pet_owner_id = po.owner_id
         LEFT JOIN pet_species s ON p.species_id = s.species_id
         WHERE po.person_id = ?`,
        [personId],
      );
      userProfile.pets = pets;
    }

    // If Manager or Admin: Fetch their SPCA/NPO details
    if (["manager", "admin", "itadmin"].includes(userProfile.role)) {
      const [orgs] = await pool.query(
        `SELECT n.npo_spca_id, n.npo_spca_name, n.phone AS org_phone, n.email AS org_email 
         FROM npo_spca n
         LEFT JOIN manager m ON m.npo_spca_id = n.npo_spca_id
         LEFT JOIN itadmin ia ON ia.npo_spca_id = n.npo_spca_id
         WHERE m.person_id = ? OR ia.person_id = ?`,
        [personId, personId],
      );
      userProfile.organization = orgs[0] || null; // Attach the org they belong to
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

// 2. Update the logged-in user's profile
export const updateUserProfile = async (req, res) => {
  const personId = req.user.person_id;
  const {
    first_name,
    last_name,
    username,
    phone,
    location_id,
    contact_pref_id,
  } = req.body;

  try {
    // Check if the new username is already taken by someone else
    if (username) {
      const [existing] = await pool.query(
        `SELECT person_id FROM person WHERE username = ? AND person_id != ?`,
        [username, personId],
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: "Username is already taken." });
      }
    }

    await pool.query(
      `UPDATE person 
       SET 
         first_name = COALESCE(?, first_name),
         last_name = COALESCE(?, last_name),
         username = COALESCE(?, username),
         phone = COALESCE(?, phone),
         location_id = COALESCE(?, location_id),
         contact_pref_id = COALESCE(?, contact_pref_id)
       WHERE person_id = ?`,
      [
        first_name,
        last_name,
        username,
        phone,
        location_id,
        contact_pref_id,
        personId,
      ],
    );

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};
