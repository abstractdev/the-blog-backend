import express from "express";
import {
  commentDelete,
  commentGet,
  commentPost,
  commentPut,
  singleCommentGet,
} from "../controllers/commentController";
const router = express.Router();

router.get("/:blogpost_id", commentGet);
router.get("/single/:comment_id", singleCommentGet);
router.post("/", commentPost);
router.put("/:id", commentPut);
router.delete("/:id", commentDelete);

export default router;
