import pool from "../config/db.js";
import { uploadMedia } from "../lib/imagekit.js";

// 1. Create a Reunion Story (Pet Owners Only)
export const createReunionStory = async (req, res) => {
  const { title, story, hoid } = req.body;

  try {
    let imageUrl = null;

    // Handle image upload if a file is provided via form-data
    if (req.file) {
      const uploadResult = await uploadMedia({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      });
      imageUrl = uploadResult.url;
    }

    const [result] = await pool.query(
      `INSERT INTO reunion (title, story, image_url, hoid) 
       VALUES (?, ?, ?, ?)`,
      [title, story, imageUrl, hoid],
    );

    res.status(201).json({
      message: "Reunion story posted successfully!",
      reunion_id: result.insertId,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Error creating reunion story:", error);
    res.status(500).json({
      message: "Server error while posting story.",
      error: error.message,
    });
  }
};

// 2. Get All Reunion Stories (Public Feed)
export const getAllReunionStories = async (req, res) => {
  try {
    const [stories] = await pool.query(
      `SELECT 
         r.reunion_id, r.title, r.story, r.image_url AS reunion_image, r.posted_at,
         ho.hoid, ho.badge_title, ho.date_handed_over,
         fpr.found_street, fpr.date_found,
         p.first_name AS finder_name
       FROM reunion r
       LEFT JOIN hand_over ho ON r.hoid = ho.hoid
       LEFT JOIN found_pet_report fpr ON ho.fpr_id = fpr.fpr_id
       LEFT JOIN person p ON fpr.finder_id = p.person_id
       ORDER BY r.posted_at DESC, r.reunion_id DESC`,
    );

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching reunion stories:", error);
    res.status(500).json({
      message: "Server error while fetching stories.",
      error: error.message,
    });
  }
};

// 3. Add a comment to a reunion story (Any logged-in user)
export const addReunionComment = async (req, res) => {
  const commented_by_id = req.user.person_id;
  const { reunion_id } = req.params;
  const { comment_posted } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO reunion_comment (reunion_id, commented_by_id, comment_posted) 
       VALUES (?, ?, ?)`,
      [reunion_id, commented_by_id, comment_posted],
    );

    res.status(201).json({
      message: "Comment posted successfully!",
      comment_id: result.insertId,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res
      .status(500)
      .json({
        message: "Server error while posting comment.",
        error: error.message,
      });
  }
};

// 4. Get all comments for a specific story (Public)
export const getCommentsForStory = async (req, res) => {
  const { reunion_id } = req.params;

  try {
    const [comments] = await pool.query(
      `SELECT 
         rc.comment_id, rc.comment_posted, rc.posted_at, rc.reunion_id,
         p.first_name AS commenter_name
       FROM reunion_comment rc
       JOIN person p ON rc.commented_by_id = p.person_id
       WHERE rc.reunion_id = ?
       ORDER BY rc.comment_id DESC`,
      [reunion_id],
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({
        message: "Server error while fetching comments.",
        error: error.message,
      });
  }
};
