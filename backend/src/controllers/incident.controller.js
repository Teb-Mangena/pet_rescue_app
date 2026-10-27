import pool from "../config/db.js";

// 1. Report a lost pet (Missing Pet Incident)
export const reportMissingPet = async (req, res) => {
  const personId = req.user.person_id;
  const {
    pet_id,
    missing_reason_id,
    last_seen_date,
    org_neighbourhood_id,
    predicted_street,
    urgency_level_id,
    reward_offered,
    incident_description,
    recent_wellbeing_id,
    other_desc,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Verify the pet belongs to this user
    const [petRows] = await connection.query(
      `SELECT p.pet_id FROM pet p
       JOIN pet_owner po ON p.pet_owner_id = po.owner_id
       WHERE p.pet_id = ? AND po.person_id = ?`,
      [pet_id, personId],
    );

    if (petRows.length === 0) {
      await connection.rollback();
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this pet." });
    }

    // Insert the missing pet incident (status 1 = 'Missing pet incident reported but not yet addressed')
    const [incidentResult] = await connection.query(
      `INSERT INTO missing_pet_incident (
        pet_id, missing_reason_id, last_seen_date, submitted_at, org_neighbourhood_id, 
        predicted_street, incident_status_id, urgency_level_id, reward_offered, 
        incident_description, recent_wellbeing_id, other_desc
      ) VALUES (?, ?, ?, CURRENT_DATE(), ?, ?, 1, ?, ?, ?, ?, ?)`,
      [
        pet_id,
        missing_reason_id,
        last_seen_date,
        org_neighbourhood_id,
        predicted_street,
        urgency_level_id,
        reward_offered || "None",
        incident_description,
        recent_wellbeing_id,
        other_desc || null,
      ],
    );

    // Update the pet's status to reflect it is missing
    await connection.query(
      `UPDATE pet SET pet_status = 'Currently Missing' WHERE pet_id = ?`,
      [pet_id],
    );

    await connection.commit();

    res.status(201).json({
      message: "Missing pet incident reported successfully.",
      mpi_id: incidentResult.insertId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error reporting missing pet:", error);
    res.status(500).json({
      message: "Server error while reporting missing pet.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// 2. View all lost pets (Community Feed)
export const getAllMissingPets = async (req, res) => {
  try {
    const [incidents] = await pool.query(
      `SELECT 
         mpi.mpi_id, mpi.last_seen_date, mpi.predicted_street, mpi.reward_offered, mpi.incident_description,
         p.pet_name, p.image_url AS pet_image,
         s.species_name, c.colour_name, u.urgency_name
       FROM missing_pet_incident mpi
       JOIN pet p ON mpi.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       LEFT JOIN urgency_level u ON mpi.urgency_level_id = u.urgency_id
       WHERE mpi.incident_status_id = 1 AND mpi.for_public = TRUE 
       ORDER BY mpi.submitted_at DESC`,
    );

    res.status(200).json(incidents);
  } catch (error) {
    console.error("Error fetching missing pets:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching missing pets." });
  }
};

// 3. Report a found pet (Linked to a Missing Pet Incident - Auto-hides missing post)
export const reportFoundPet = async (req, res) => {
  const personId = req.user.person_id;

  const {
    mpi_id,
    found_date,
    found_street,
    org_neighbourhood_id,
    found_description,
    other_desc,
    current_wellbeing_id,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ---------------------------------------------------------
    // 1. Get the community member belonging to the logged-in user
    // ---------------------------------------------------------
    const [memberRows] = await connection.query(
      `
      SELECT
        cm.member_id,
        cm.person_id
      FROM community_member cm
      WHERE cm.person_id = ?
      LIMIT 1
      `,
      [personId],
    );

    if (memberRows.length === 0) {
      await connection.rollback();

      return res.status(403).json({
        message:
          "You must be registered as a community member to report found pets.",
      });
    }

    const memberId = memberRows[0].member_id;

    // ---------------------------------------------------------
    // 2. If this found report is linked to a missing incident,
    //    validate the missing incident
    // ---------------------------------------------------------
    let targetPetId = null;

    if (mpi_id) {
      // Check if a found report already exists for this
      // missing pet incident
      const [existingReport] = await connection.query(
        `
        SELECT fpr_id
        FROM found_pet_report
        WHERE mpi_id = ?
        LIMIT 1
        `,
        [mpi_id],
      );

      if (existingReport.length > 0) {
        await connection.rollback();

        return res.status(400).json({
          message:
            "A found pet report for this missing incident has already been submitted.",
        });
      }

      // Get the missing incident and the pet associated with it
      const [mpiCheck] = await connection.query(
        `
        SELECT
          mpi_id,
          pet_id
        FROM missing_pet_incident
        WHERE mpi_id = ?
        LIMIT 1
        `,
        [mpi_id],
      );

      if (mpiCheck.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: "Missing pet incident not found.",
        });
      }

      targetPetId = mpiCheck[0].pet_id;
    }

    // ---------------------------------------------------------
    // 3. Create the found pet report
    //
    // IMPORTANT:
    // finder_id stores community_member.member_id,
    // NOT person.person_id.
    // ---------------------------------------------------------
    const [result] = await connection.query(
      `
      INSERT INTO found_pet_report (
        mpi_id,
        finder_id,
        date_found,
        found_street,
        found_neighbourhood_id,
        report_description,
        other_desc,
        current_wellbeing_id,
        report_status_id,
        reported_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_DATE())
      `,
      [
        mpi_id || null,
        memberId,
        found_date,
        found_street,
        org_neighbourhood_id || null,
        found_description || null,
        other_desc || null,
        current_wellbeing_id || null,
      ],
    );

    // ---------------------------------------------------------
    // 4. If this report belongs to a missing incident,
    //    update the incident and pet
    // ---------------------------------------------------------
    if (mpi_id && targetPetId) {
      await connection.query(
        `
        UPDATE missing_pet_incident
        SET
          incident_status_id = 2,
          for_public = FALSE
        WHERE mpi_id = ?
        `,
        [mpi_id],
      );

      await connection.query(
        `
        UPDATE pet
        SET pet_status = 'Found / Awaiting Handover'
        WHERE pet_id = ?
        `,
        [targetPetId],
      );
    }

    // ---------------------------------------------------------
    // 5. Commit everything
    // ---------------------------------------------------------
    await connection.commit();

    // ---------------------------------------------------------
    // 6. Return the actual person information as well
    //    so you can immediately verify who created the report
    // ---------------------------------------------------------
    const [reporterRows] = await connection.query(
      `
      SELECT
        p.person_id,
        p.first_name,
        p.last_name,
        p.email,
        cm.member_id
      FROM community_member cm
      INNER JOIN person p
        ON cm.person_id = p.person_id
      WHERE cm.member_id = ?
      LIMIT 1
      `,
      [memberId],
    );

    const reporter = reporterRows[0] || null;

    return res.status(201).json({
      message:
        "Found pet reported successfully! Missing incident marked as resolved and automatically hidden from public feed.",

      fpr_id: result.insertId,

      reporter: reporter
        ? {
            person_id: reporter.person_id,
            member_id: reporter.member_id,
            first_name: reporter.first_name,
            last_name: reporter.last_name,
            email: reporter.email,
          }
        : null,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Error reporting found pet:", error);

    return res.status(500).json({
      message: "Server error while reporting found pet.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// 4. View all found pets
export const getAllFoundPets = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         -- Core Report Details
         fpr.fpr_id, fpr.date_found, fpr.found_street, fpr.report_description, 
         fpr.report_status_id, fpr.reported_at, fpr.image_url AS report_image,
         
         -- Human Readable Status Text
         ast.status_description AS status_text, 
         
         -- Finder Details (FIXED: Join through community_member first!)
         per.first_name AS finder_name,
         per.person_id AS finder_id,
         
         -- Organization / SPCA Details
         n.neighbourhood_name AS org_location,
         ns.npo_spca_id,
         ns.npo_spca_name AS spca_name,
         ns.phone AS spca_phone,
         ns.email AS spca_email,
         
         -- Handover Details
         ho.hoid,
         ho.badge_title AS handover_status,
         ho.chosen_date AS handover_date,
         ho.date_handed_over,
         
         -- Pet Details
         p.pet_id, p.pet_name, p.pet_status, p.pet_description, p.image_url AS pet_image,
         s.species_name, c.colour_name, sz.size_name
       FROM found_pet_report fpr
       LEFT JOIN activity_status ast ON fpr.report_status_id = ast.ats_id
       LEFT JOIN community_member cm ON fpr.finder_id = cm.member_id -- <--- FIXED HERE
       LEFT JOIN person per ON cm.person_id = per.person_id          -- <--- FIXED HERE
       LEFT JOIN npo_spca_neighbourhood nsn ON fpr.found_neighbourhood_id = nsn.nsn_id
       LEFT JOIN neighbourhood n ON nsn.neighbourhood_id = n.neighbourhood_id
       LEFT JOIN npo_spca ns ON nsn.npo_spca_id = ns.npo_spca_id
       LEFT JOIN hand_over ho ON fpr.fpr_id = ho.fpr_id
       LEFT JOIN missing_pet_incident mpi ON fpr.mpi_id = mpi.mpi_id
       LEFT JOIN pet p ON mpi.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       LEFT JOIN pet_size sz ON p.pet_size_id = sz.size_id
       ORDER BY fpr.reported_at DESC, fpr.fpr_id DESC`,
    );

    // Format the result into a rich, creative, and highly nested JSON structure
    const foundPets = rows.map((row) => ({
      report_info: {
        fpr_id: row.fpr_id,
        date_found: row.date_found,
        found_street: row.found_street,
        reported_at: row.reported_at,
        description: row.report_description,
        report_image: row.report_image,
        finder_name: row.finder_name,
        finder_id: row.finder_id,
      },

      // Groups all the status and handover progress together
      tracking_status: {
        status_id: row.report_status_id,
        status_text: row.status_text || "Status Unknown",
        handover_active: !!row.hoid,
        handover_badge: row.handover_status || null,
        handover_date: row.handover_date || null,
        completed_on: row.date_handed_over || null,
      },

      // Groups the SPCA details nicely for the frontend to render a contact card
      spca_details: row.npo_spca_id
        ? {
            id: row.npo_spca_id,
            name: row.spca_name,
            location: row.org_location,
            phone: row.spca_phone,
            email: row.spca_email,
          }
        : null,

      // Groups the pet details
      pet_info: row.pet_id
        ? {
            pet_id: row.pet_id,
            name: row.pet_name,
            status: row.pet_status,
            description: row.pet_description,
            image: row.pet_image,
            species: row.species_name,
            colour: row.colour_name,
            size: row.size_name,
          }
        : null,
    }));

    res.status(200).json(foundPets);
  } catch (error) {
    console.error("Error fetching found pets feed:", error);
    res.status(500).json({
      message: "Server error while fetching the found pets feed.",
      error: error.message,
    });
  }
};

// 5. Update a missing pet status (Mark as Resolved/Found)
export const resolveMissingIncident = async (req, res) => {
  const personId = req.user.person_id;
  const { mpi_id } = req.params;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verify the incident belongs to a pet owned by this user
    const [authCheck] = await connection.query(
      `SELECT p.pet_id FROM missing_pet_incident mpi
       JOIN pet p ON mpi.pet_id = p.pet_id
       JOIN pet_owner po ON p.pet_owner_id = po.owner_id
       WHERE mpi.mpi_id = ? AND po.person_id = ?`,
      [mpi_id, personId],
    );

    if (authCheck.length === 0) {
      await connection.rollback();
      return res
        .status(403)
        .json({ message: "Unauthorized to update this incident." });
    }

    const petId = authCheck[0].pet_id;

    // 2. Update the Incident Status (assuming status 2 = Resolved/Closed)
    await connection.query(
      `UPDATE missing_pet_incident SET incident_status_id = 2 WHERE mpi_id = ?`,
      [mpi_id],
    );

    // 3. Update the Pet's status back to 'Currently at Home'
    await connection.query(
      `UPDATE pet SET pet_status = 'Currently at Home' WHERE pet_id = ?`,
      [petId],
    );

    await connection.commit();

    res.status(200).json({ message: "Incident resolved. Welcome home, pet!" });
  } catch (error) {
    await connection.rollback();
    console.error("Error resolving incident:", error);
    res.status(500).json({ message: "Server error while resolving incident." });
  } finally {
    connection.release();
  }
};

// Request a Hand-Over (Pet Owner claiming a Found Pet)
export const requestHandover = async (req, res) => {
  const { fpr_id } = req.params;
  const { chosen_date, response_note } = req.body;

  try {
    // Insert the hand_over record with the default 'Awaiting Owner' badge
    const [result] = await pool.query(
      `INSERT INTO hand_over (
         fpr_id, chosen_date, response_note, badge_title
       ) VALUES (?, ?, ?, 'Awaiting Owner')`,
      [fpr_id, chosen_date, response_note],
    );

    res.status(201).json({
      message:
        "Hand-over requested successfully! The SPCA/NPO branch will review your request.",
      hoid: result.insertId,
    });
  } catch (error) {
    console.error("Error requesting hand-over:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Finder drops off the pet at the SPCA (Status -> 2)
export const logFinderHandover = async (req, res) => {
  const { fpr_id } = req.params;
  const personId = req.user.person_id; // From JWT

  // We only expect the handover details from the frontend
  const { chosen_date, response_note, npo_spca_id } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. PREVENT DUPLICATES: Check if a handover already exists for this found report
    const [existingHandover] = await connection.query(
      `SELECT hoid FROM hand_over WHERE fpr_id = ?`,
      [fpr_id],
    );

    if (existingHandover.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "A drop-off request has already been logged for this pet.",
      });
    }

    // 2. FIX: Join community_member to get the original finder's actual person_id!
    const [reportCheck] = await connection.query(
      `SELECT cm.person_id AS finder_person_id, mpi.pet_id
       FROM found_pet_report fpr
       JOIN community_member cm ON fpr.finder_id = cm.member_id
       LEFT JOIN missing_pet_incident mpi ON fpr.mpi_id = mpi.mpi_id
       WHERE fpr.fpr_id = ?`,
      [fpr_id],
    );

    if (reportCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Found pet report not found." });
    }

    // Compare person_id to person_id!
    if (reportCheck[0].finder_person_id !== personId) {
      await connection.rollback();
      return res.status(403).json({
        message: "Only the original finder can request this drop-off.",
      });
    }

    // Automatically extracted from the JOIN query above
    const autoPetId = reportCheck[0].pet_id;

    // 3. Create the hand_over record, automatically inserting autoPetId
    const [result] = await connection.query(
      `INSERT INTO hand_over (
         fpr_id, pet_id, chosen_date, response_note, badge_title, npo_spca_id
       ) VALUES (?, ?, ?, ?, 'Awaiting SPCA Drop-off', ?)`,
      [fpr_id, autoPetId || null, chosen_date, response_note, npo_spca_id],
    );

    // 4. Update the found pet report status to '2' (Awaiting SPCA Drop-off)
    await connection.query(
      `UPDATE found_pet_report SET report_status_id = 2 WHERE fpr_id = ?`,
      [fpr_id],
    );

    await connection.commit();

    res.status(201).json({
      message:
        "Drop-off logged! Please bring the pet to the SPCA on your chosen date.",
      hoid: result.insertId,
      pet_id_saved: autoPetId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error logging finder hand-over:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  } finally {
    connection.release();
  }
};

// Get all found pet reports submitted by the logged-in community member
export const myFoundPets = async (req, res) => {
  const personId = req.user.person_id; // Logged-in user's ID from authentication middleware

  try {
    const [rows] = await pool.query(
      `SELECT 
         fpr.fpr_id, fpr.date_found, fpr.found_street, fpr.report_description, 
         fpr.report_status_id, fpr.reported_at,
         n.neighbourhood_name AS org_location,
         -- Pet details (if linked to a missing incident)
         p.pet_id, p.pet_name, p.pet_status, p.pet_description, p.image_url AS pet_image,
         s.species_name, c.colour_name, sz.size_name
       FROM found_pet_report fpr
       LEFT JOIN npo_spca_neighbourhood nsn ON fpr.found_neighbourhood_id = nsn.nsn_id
       LEFT JOIN neighbourhood n ON nsn.neighbourhood_id = n.neighbourhood_id
       LEFT JOIN missing_pet_incident mpi ON fpr.mpi_id = mpi.mpi_id
       LEFT JOIN pet p ON mpi.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       LEFT JOIN pet_size sz ON p.pet_size_id = sz.size_id
       WHERE fpr.finder_id = ?
       ORDER BY fpr.fpr_id DESC`,
      [personId],
    );

    // Format the flat SQL result into an array with a nested 'pet' object
    const myReports = rows.map((row) => ({
      fpr_id: row.fpr_id,
      date_found: row.date_found,
      found_street: row.found_street,
      report_description: row.report_description,
      report_status_id: row.report_status_id,
      reported_at: row.reported_at,
      org_location: row.org_location,
      pet: row.pet_id
        ? {
            pet_id: row.pet_id,
            pet_name: row.pet_name,
            pet_status: row.pet_status,
            pet_description: row.pet_description,
            pet_image: row.pet_image,
            species_name: row.species_name,
            colour_name: row.colour_name,
            size_name: row.size_name,
          }
        : null,
    }));

    res.status(200).json(myReports);
  } catch (error) {
    console.error("Error fetching user's found pet reports:", error);
    res.status(500).json({
      message: "Server error while fetching your found pet reports.",
      error: error.message,
    });
  }
};

export const getMyHandovers = async (req, res) => {
  const finderId = req.user.person_id;

  try {
    const [rows] = await pool.query(
      `SELECT 
         ho.hoid, ho.chosen_date, ho.requested_at, ho.badge_title, ho.response_note,
         fpr.fpr_id, fpr.found_street, fpr.date_found, fpr.image_url AS report_image,
         
         -- SPCA Details (Mapped exactly to your schema!)
         ns.npo_spca_id, 
         ns.npo_spca_name AS spca_name, 
         ns.email AS contact_email,
         ns.phone AS contact_phone,
         
         -- Pet details 
         p.pet_id, p.pet_name, p.pet_status, p.image_url AS pet_image,
         s.species_name, c.colour_name
       FROM hand_over ho
       JOIN found_pet_report fpr ON ho.fpr_id = fpr.fpr_id
       LEFT JOIN npo_spca ns ON ho.npo_spca_id = ns.npo_spca_id
       LEFT JOIN pet p ON ho.pet_id = p.pet_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       WHERE fpr.finder_id = ?
       ORDER BY ho.requested_at DESC`,
      [finderId],
    );

    // Format the flat SQL result into an array with clean, nested objects
    const myHandovers = rows.map((row) => ({
      hoid: row.hoid,
      chosen_date: row.chosen_date,
      requested_at: row.requested_at,
      badge_title: row.badge_title,
      response_note: row.response_note,
      fpr_id: row.fpr_id,
      found_street: row.found_street,
      date_found: row.date_found,
      report_image: row.report_image,

      // Now this will perfectly populate!
      spca: row.npo_spca_id
        ? {
            npo_spca_id: row.npo_spca_id,
            name: row.spca_name,
            email: row.contact_email,
            phone: row.contact_phone || null,
          }
        : null,

      pet: row.pet_id
        ? {
            pet_id: row.pet_id,
            pet_name: row.pet_name,
            pet_status: row.pet_status,
            pet_image: row.pet_image,
            species_name: row.species_name,
            colour_name: row.colour_name,
          }
        : null,
    }));

    res.status(200).json(myHandovers);
  } catch (error) {
    console.error("Error fetching user's handovers:", error);
    res.status(500).json({
      message: "Server error while fetching your drop-off requests.",
      error: error.message,
    });
  }
};

// Pet Owner schedules a pick-up to claim their pet from the SPCA
export const claimMyPet = async (req, res) => {
  const { hoid } = req.params; // The ID of the handover record
  const ownerId = req.user.person_id; // The logged-in user's person_id from JWT

  const { chosen_date, response_note } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verify handover, check badge, and trace ownership through pet_owner & person tables
    const [hoCheck] = await connection.query(
      `SELECT 
         ho.badge_title, 
         ho.fpr_id, 
         po.person_id AS real_owner_person_id, 
         p.pet_name
       FROM hand_over ho
       JOIN pet p ON ho.pet_id = p.pet_id
       LEFT JOIN pet_owner po ON p.pet_owner_id = po.owner_id
       WHERE ho.hoid = ?`,
      [hoid],
    );

    if (hoCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Hand-over record not found." });
    }

    const { badge_title, real_owner_person_id, pet_name, fpr_id } = hoCheck[0];

    // 2. STRICT SECURITY: Ensure the logged-in person is the registered owner
    if (real_owner_person_id !== ownerId) {
      await connection.rollback();
      return res.status(403).json({
        message: `Security alert: You are not listed as the registered owner of this pet.`,
      });
    }

    // 3. LOGIC CHECK: Ensure the pet has actually been dropped off at the SPCA first
    if (badge_title === "Awaiting SPCA Drop-off") {
      await connection.rollback();
      return res.status(400).json({
        message: `The finder has not dropped ${pet_name} off at the SPCA yet. Please wait until the pet is secured at the facility.`,
      });
    }

    if (badge_title === "Handed Over") {
      await connection.rollback();
      return res.status(400).json({
        message: `${pet_name} has already been claimed and released!`,
      });
    }

    // 4. Update the handover record with the Owner's pick-up date and note
    await connection.query(
      `UPDATE hand_over 
       SET chosen_date = ?, response_note = ? 
       WHERE hoid = ?`,
      [chosen_date, response_note, hoid],
    );

    // 5. Update the found pet report status to '101' (Pet hand-over confirmed, awaiting owner to fetch)
    await connection.query(
      `UPDATE found_pet_report SET report_status_id = 101 WHERE fpr_id = ?`,
      [fpr_id],
    );

    await connection.commit();

    res.status(200).json({
      message: `Success! Your pick-up for ${pet_name} has been scheduled for ${chosen_date}. Don't forget your ID!`,
      hoid: hoid,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error scheduling pet claim:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  } finally {
    connection.release();
  }
};
