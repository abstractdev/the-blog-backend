import express from "express";
import {
  categoryGet,
  categoryPost,
  categoryDelete,
} from "../controllers/categoryController";
const router = express.Router();

router.get("/", categoryGet);
router.post("/", categoryPost);
router.delete("/:id", categoryDelete);
export default router;
