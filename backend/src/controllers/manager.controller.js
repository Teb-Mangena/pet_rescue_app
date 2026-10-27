import pool from "../config/db.js";

// 2. Get Missing Pets for Manager's Branch
export const getManagerMissingPets = async (req, res) => {
  const personId = req.user.person_id;

  try {
    // Get the manager's organization ID
    const [managerRecord] = await pool.query(
      `SELECT npo_spca_id FROM manager WHERE person_id = ?`,
      [personId],
    );

    if (managerRecord.length === 0)
      return res.status(403).json({ message: "Access denied." });
    const npoSpcaId = managerRecord[0].npo_spca_id;

    // Fetch matching missing pets
    // FIXED: Changed p.person_id to p.pet_owner_id on the JOIN line
    const [missingPets] = await pool.query(
      `SELECT 
         mpi.mpi_id, mpi.last_seen_date, mpi.predicted_street, mpi.incident_status_id,
         p.pet_name, s.species_name, c.colour_name,
         o.first_name AS owner_name, o.phone AS owner_phone
       FROM missing_pet_incident mpi
       JOIN pet p ON mpi.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       JOIN person o ON p.pet_owner_id = o.person_id -- <--- FIXED HERE
       JOIN npo_spca_neighbourhood nsn ON mpi.org_neighbourhood_id = nsn.nsn_id
       WHERE nsn.npo_spca_id = ?
       ORDER BY mpi.submitted_at DESC`,
      [npoSpcaId],
    );

    res.status(200).json(missingPets);
  } catch (error) {
    console.error("Error fetching missing pets for manager:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// 3. Get Found Pets for Manager's Branch
export const getManagerFoundPets = async (req, res) => {
  const personId = req.user.person_id;

  try {
    // Get the manager's organization ID
    const [managerRecord] = await pool.query(
      `SELECT npo_spca_id FROM manager WHERE person_id = ?`,
      [personId],
    );

    if (managerRecord.length === 0)
      return res.status(403).json({ message: "Access denied." });
    const npoSpcaId = managerRecord[0].npo_spca_id;

    // Fetch matching found pets
    const [foundPets] = await pool.query(
      `SELECT 
         fpr.fpr_id, fpr.date_found, fpr.found_street, fpr.report_description, fpr.image_url,
         fpr.report_status_id,
         f.first_name AS finder_name, f.phone AS finder_phone
       FROM found_pet_report fpr
       JOIN person f ON fpr.finder_id = f.person_id
       JOIN npo_spca_neighbourhood nsn ON fpr.found_neighbourhood_id = nsn.nsn_id
       WHERE nsn.npo_spca_id = ?
       ORDER BY fpr.reported_at DESC`,
      [npoSpcaId],
    );

    res.status(200).json(foundPets);
  } catch (error) {
    console.error("Error fetching found pets for manager:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// 4. Get Pending Hand-Over Requests for Manager's Branch
export const getPendingHandovers = async (req, res) => {
  const personId = req.user.person_id;

  try {
    const [managerRecord] = await pool.query(
      `SELECT npo_spca_id FROM manager WHERE person_id = ?`,
      [personId],
    );

    if (managerRecord.length === 0)
      return res.status(403).json({ message: "Access denied." });

    const npoSpcaId = managerRecord[0].npo_spca_id;

    // Fetch handovers with extended finder and pet details
    const [rows] = await pool.query(
      `SELECT 
         ho.hoid, ho.chosen_date, ho.requested_at, ho.badge_title, ho.response_note,
         fpr.fpr_id, fpr.found_street, fpr.date_found, 
         
         -- Finder details
         f.person_id AS finder_id,
         f.first_name AS finder_first_name,
         f.last_name AS finder_last_name,
         f.email AS finder_email,
         f.phone AS finder_phone_number,

         -- Pet details
         p.pet_id, p.pet_name, p.image_url AS pet_image,
         s.species_name, c.colour_name
       FROM hand_over ho
       JOIN found_pet_report fpr ON ho.fpr_id = fpr.fpr_id
       JOIN person f ON fpr.finder_id = f.person_id
       LEFT JOIN pet p ON ho.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       WHERE ho.npo_spca_id = ? 
         AND ho.badge_title IN ('Awaiting SPCA Drop-off', 'Awaiting Owner')
       ORDER BY ho.requested_at ASC`,
      [npoSpcaId],
    );

    // Map rows to include clean, nested finder and pet objects
    const pendingRequests = rows.map((row) => ({
      hoid: row.hoid,
      chosen_date: row.chosen_date,
      requested_at: row.requested_at,
      badge_title: row.badge_title,
      response_note: row.response_note,
      fpr_id: row.fpr_id,
      found_street: row.found_street,
      date_found: row.date_found,
      finder: {
        person_id: row.finder_id,
        first_name: row.finder_first_name,
        last_name: row.finder_last_name,
        email: row.finder_email,
        phone_number: row.finder_phone_number,
      },
      pet: row.pet_id
        ? {
            pet_id: row.pet_id,
            pet_name: row.pet_name,
            pet_image: row.pet_image,
            species_name: row.species_name,
            colour_name: row.colour_name,
          }
        : null,
    }));

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending handovers:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// 5. Manager approves a hand-over (Handles both Finder Intake AND Owner Release)
export const approveHandover = async (req, res) => {
  const { hoid } = req.params;
  const { response_note, date_handed_over } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get the current handover badge and the linked pet report ID
    const [hoRows] = await connection.query(
      `SELECT ho.badge_title, ho.fpr_id, fpr.report_status_id 
       FROM hand_over ho
       JOIN found_pet_report fpr ON ho.fpr_id = fpr.fpr_id
       WHERE ho.hoid = ?`,
      [hoid],
    );

    if (hoRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Hand-over request not found." });
    }

    const { badge_title, fpr_id, report_status_id } = hoRows[0];

    let newBadgeTitle = "Handed Over";
    let newReportStatusId = report_status_id;
    let successMessage = "Hand-over approved successfully!";

    // 2. Determine pipeline stage based on the current badge
    if (badge_title === "Awaiting SPCA Drop-off") {
      // STAGE 1: Finder dropping pet off at SPCA
      // We change the badge to Awaiting Owner so it stays on the manager's radar for Stage 2
      newBadgeTitle = "Awaiting Owner";

      // 👉 UPDATED: Uses ID 101 ("Pet hand-over confirmed, awaiting owner to fetch")
      newReportStatusId = 101;

      successMessage =
        "Intake approved! Pet is now safely at the SPCA awaiting the owner.";
    } else if (badge_title === "Awaiting Owner") {
      // STAGE 2: Owner fetching pet from SPCA
      newBadgeTitle = "Handed Over";

      // 👉 UPDATED: Uses ID 121 ("Pet hand-over process complete, and pet reunited with owner")
      newReportStatusId = 121;

      successMessage =
        "Release approved! Pet is officially reunited and going home.";
    }

    // 3. Update the hand_over record with the date and new badge
    await connection.query(
      `UPDATE hand_over 
       SET badge_title = ?, response_note = ?, date_handed_over = ? 
       WHERE hoid = ?`,
      [newBadgeTitle, response_note, date_handed_over, hoid],
    );

    // 4. Progress the actual Found Pet Report to the next status
    await connection.query(
      `UPDATE found_pet_report SET report_status_id = ? WHERE fpr_id = ?`,
      [newReportStatusId, fpr_id],
    );

    await connection.commit();

    res.status(200).json({
      message: successMessage,
      hoid: hoid,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error approving hand-over:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  } finally {
    connection.release();
  }
};

// Manager approves the owner's claim, finalizing the reunion and release
export const approveOwnerClaim = async (req, res) => {
  const { hoid } = req.params;
  const { response_note, date_handed_over } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get handover details, linked report ID, and pet ID
    const [hoRows] = await connection.query(
      `SELECT ho.badge_title, ho.fpr_id, ho.pet_id 
       FROM hand_over ho
       WHERE ho.hoid = ?`,
      [hoid],
    );

    if (hoRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Hand-over record not found." });
    }

    const { badge_title, fpr_id, pet_id } = hoRows[0];

    // 2. Validate that the handover is actually waiting for the owner's pick-up
    if (badge_title !== "Awaiting Owner") {
      await connection.rollback();
      return res.status(400).json({
        message: `This pet is not currently awaiting owner pick-up (Current stage: ${badge_title || "Unknown"}).`,
      });
    }

    // 3. Update the hand_over record to complete status
    await connection.query(
      `UPDATE hand_over 
       SET badge_title = 'Handed Over', response_note = ?, date_handed_over = ? 
       WHERE hoid = ?`,
      [response_note, date_handed_over, hoid],
    );

    // 4. Update the found pet report status to '121' (Reunited with owner)
    await connection.query(
      `UPDATE found_pet_report SET report_status_id = 121 WHERE fpr_id = ?`,
      [fpr_id],
    );

    // 5. Update the pet's official status in the pet table to 'Currently at Home'
    if (pet_id) {
      await connection.query(
        `UPDATE pet SET pet_status = 'Currently at Home' WHERE pet_id = ?`,
        [pet_id],
      );
    }

    await connection.commit();

    res.status(200).json({
      message:
        "Release approved! Pet is officially reunited and going home with its owner.",
      hoid: hoid,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error approving owner claim:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  } finally {
    connection.release();
  }
};
