import express from "express";
import {
  blogpostLikePost,
  blogpostLikeDelete,
} from "../controllers/blogpostLikeController";
const router = express.Router();

router.post("/:id", blogpostLikePost);
router.delete("/:id", blogpostLikeDelete);
export default router;
