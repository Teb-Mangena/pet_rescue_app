import pool from "../config/db.js";

const syncHandovers = async () => {
  try {
    console.log("🧹 Starting handover cleanup and synchronization...");

    // 1. Remove duplicate handover requests (keeps the one with the highest hoid)
    const [deleteResult] = await pool.query(`
      DELETE h1 FROM hand_over h1
      JOIN hand_over h2 
        ON h1.fpr_id = h2.fpr_id 
        AND h1.hoid < h2.hoid;
    `);
    console.log(
      `✅ Removed ${deleteResult.affectedRows} duplicate handover(s).`,
    );

    // 2. Backfill the pet_id into the handover table for older records
    const [updateResult] = await pool.query(`
      UPDATE hand_over ho
      JOIN found_pet_report fpr ON ho.fpr_id = fpr.fpr_id
      JOIN missing_pet_incident mpi ON fpr.mpi_id = mpi.mpi_id
      SET ho.pet_id = mpi.pet_id
      WHERE ho.pet_id IS NULL;
    `);
    console.log(
      `✅ Synced pet_id for ${updateResult.affectedRows} handover(s).`,
    );

    console.log("🎉 Handover table is perfectly clean and up to date!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing handovers:", error.message);
    process.exit(1);
  }
};

// syncHandovers();

const cleanHandovers = async () => {
  try {
    console.log("🧹 Starting handover cleanup...");

    // 1. Delete any handovers that have no pet_id
    const [deleteResult] = await pool.query(`
      DELETE FROM hand_over 
      WHERE pet_id IS NULL;
    `);
    console.log(
      `✅ Deleted ${deleteResult.affectedRows} invalid handover(s) with missing pet_ids.`,
    );

    // 2. Assign all remaining handovers to npo_spca_id = 1
    const [updateResult] = await pool.query(`
      UPDATE hand_over 
      SET npo_spca_id = 1;
    `);
    console.log(
      `✅ Updated ${updateResult.affectedRows} handover(s) to npo_spca_id = 1.`,
    );

    console.log("🎉 Handover table is perfectly clean and ready for testing!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error cleaning handovers:", error.message);
    process.exit(1);
  }
};

// cleanHandovers();
