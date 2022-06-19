import express from "express";
import { blogpostGet, blogpostPost } from "../controllers/blogpostController";
const router = express.Router();

router.get("/", blogpostGet);
router.post("/", blogpostPost);
// router.put("/", blogpostPut);
// router.delete("/", blogpostDelete);

export default router;
