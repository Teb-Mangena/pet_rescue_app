import pool from "../config/db.js";
import { uploadMedia } from "../lib/imagekit.js";

// 1. Add pet
export const addPet = async (req, res) => {
  const personId = req.user.person_id;
  const { pet_name, species_id, pet_colour_id, pet_size_id, pet_description } =
    req.body;

  try {
    // 1. Ensure the user is a pet owner and get their owner_id
    const [ownerRows] = await pool.query(
      `SELECT owner_id FROM pet_owner WHERE person_id = ?`,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res
        .status(403)
        .json({ message: "Only registered pet owners can add pets." });
    }

    const ownerId = ownerRows[0].owner_id;

    // 2. Handle the Image Upload via ImageKit
    let imageUrl = null;

    if (req.file) {
      // Pass the multer file buffer and map 'originalname' to your helper's expected format
      const uploadResult = await uploadMedia({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      });

      // ImageKit returns the accessible URL in the 'url' property
      imageUrl = uploadResult.url;
    } else if (req.body.image_url) {
      // Fallback in case they pass a string URL
      imageUrl = req.body.image_url;
    }

    // 3. Insert the pet into the database
    const [result] = await pool.query(
      `INSERT INTO pet (pet_name, species_id, pet_colour_id, pet_size_id, ownership, pet_description, registered_at, pet_status, pet_owner_id, image_url) 
       VALUES (?, ?, ?, ?, 'Owned', ?, CURRENT_DATE(), 'Currently at Home', ?, ?)`,
      [
        pet_name,
        species_id,
        pet_colour_id,
        pet_size_id,
        pet_description,
        ownerId,
        imageUrl,
      ],
    );

    res.status(201).json({
      message: "Pet added successfully.",
      pet_id: result.insertId,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({
      message: "Server error while adding pet.",
      error: error.message,
    });
  }
};

// 2. View all of their own pets
export const getMyPets = async (req, res) => {
  const personId = req.user.person_id;

  try {
    const [pets] = await pool.query(
      `SELECT 
         p.pet_id, p.pet_name, p.ownership, p.pet_description, p.registered_at, p.pet_status, p.image_url,
         s.species_name, c.colour_name, sz.size_name
       FROM pet p
       JOIN pet_owner po ON p.pet_owner_id = po.owner_id
       LEFT JOIN pet_species s ON p.species_id = s.species_id
       LEFT JOIN pet_colour c ON p.pet_colour_id = c.colour_id
       LEFT JOIN pet_size sz ON p.pet_size_id = sz.size_id
       WHERE po.person_id = ?`,
      [personId],
    );

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({
      message: "Server error while fetching pets.",
      error: error.message,
    });
  }
};

// 3. Update an existing pet
export const updatePet = async (req, res) => {
  const personId = req.user.person_id;
  const { id } = req.params;

  const { pet_name, species_id, pet_colour_id, pet_size_id, pet_description } =
    req.body;

  try {
    // 1. Get the owner_id
    const [ownerRows] = await pool.query(
      `SELECT owner_id FROM pet_owner WHERE person_id = ?`,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res
        .status(403)
        .json({ message: "Only registered pet owners can update pets." });
    }
    const ownerId = ownerRows[0].owner_id;

    // 2. Verify the pet belongs to this owner and get the current image
    const [petRows] = await pool.query(
      `SELECT image_url FROM pet WHERE pet_id = ? AND pet_owner_id = ?`,
      [id, ownerId],
    );

    if (petRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Pet not found or unauthorized to update." });
    }

    // 3. Handle ImageKit upload if a new file is provided
    let imageUrl = petRows[0].image_url;

    if (req.file) {
      const uploadResult = await uploadMedia({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      });
      imageUrl = uploadResult.url;
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

    // 4. Update the pet record
    await pool.query(
      `UPDATE pet 
       SET pet_name = ?, species_id = ?, pet_colour_id = ?, pet_size_id = ?, pet_description = ?, image_url = ?
       WHERE pet_id = ? AND pet_owner_id = ?`,
      [
        pet_name,
        species_id,
        pet_colour_id,
        pet_size_id,
        pet_description,
        imageUrl,
        id,
        ownerId,
      ],
    );

    res.status(200).json({
      message: "Pet updated successfully.",
      pet_id: id,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({
      message: "Server error while updating pet.",
      error: error.message,
    });
  }
};

// 4. Delete a pet
export const deletePet = async (req, res) => {
  const personId = req.user.person_id;
  const { id } = req.params; // Get pet_id from the URL

  try {
    // 1. Get the owner_id
    const [ownerRows] = await pool.query(
      `SELECT owner_id FROM pet_owner WHERE person_id = ?`,
      [personId],
    );

    if (ownerRows.length === 0) {
      return res
        .status(403)
        .json({ message: "Only registered pet owners can delete pets." });
    }
    const ownerId = ownerRows[0].owner_id;

    // 2. Attempt to delete the pet (only if owned by this user)
    const [result] = await pool.query(
      `DELETE FROM pet WHERE pet_id = ? AND pet_owner_id = ?`,
      [id, ownerId],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Pet not found or unauthorized to delete." });
    }

    res.status(200).json({ message: "Pet deleted successfully." });
  } catch (error) {
    console.error("Error deleting pet:", error);

    // Check for foreign key constraint errors (e.g., if the pet has active incident reports)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "Cannot delete this pet because it is currently linked to an incident report.",
      });
    }

    res.status(500).json({
      message: "Server error while deleting pet.",
      error: error.message,
    });
  }
};
