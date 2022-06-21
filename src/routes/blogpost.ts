import express from "express";
import {
  blogpostDelete,
  blogpostGet,
  blogpostPost,
  blogpostPut,
} from "../controllers/blogpostController";
const router = express.Router();

router.get("/", blogpostGet);
router.post("/", blogpostPost);
router.put("/:id", blogpostPut);
router.delete("/:id", blogpostDelete);

export default router;
