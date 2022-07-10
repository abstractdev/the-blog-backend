import express from "express";
import { commentLikePost } from "../controllers/commentLikeController";
const router = express.Router();

router.post("/:commentId", commentLikePost);
export default router;
