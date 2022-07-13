import express from "express";
import { commentLikeDelete, commentLikePost } from "../controllers/commentLikeController";
const router = express.Router();

router.post("/:commentId", commentLikePost);
router.delete("/:commentId", commentLikeDelete);
export default router;
