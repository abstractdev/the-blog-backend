import express from "express";
import { blogpostLikePost } from "../controllers/blogpostLikeController";
const router = express.Router();

router.post("/:blogpostId", blogpostLikePost);
export default router;
