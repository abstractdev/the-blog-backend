import express from "express";
import {
  blogpostLikePost,
  blogpostLikeDelete,
} from "../controllers/blogpostLikeController";
const router = express.Router();

router.post("/:blogpostId", blogpostLikePost);
router.delete("/:blogpostId", blogpostLikeDelete);
export default router;
