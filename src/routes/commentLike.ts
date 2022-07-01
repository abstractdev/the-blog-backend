import express from "express";
import {
  commentLikePost,
  commentLikeDelete,
} from "../controllers/commentLikeController";
const router = express.Router();

router.post("/:id", commentLikePost);
router.delete("/:id", commentLikeDelete);
export default router;
