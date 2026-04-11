import express from "express";
import { createPost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);

export default router;
