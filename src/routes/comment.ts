import express from "express";
import {
  commentDelete,
  commentGet,
  commentPost,
  commentPut,
} from "../controllers/commentController";
const router = express.Router();

router.get("/:blogpost_id", commentGet);
router.post("/", commentPost);
router.put("/:id", commentPut);
router.delete("/:id", commentDelete);

export default router;
