import express from "express";
import {
  blogpostDelete,
  blogpostGet,
  blogpostPost,
  blogpostPut,
  singleBlogpostGet,
} from "../controllers/blogpostController";
const router = express.Router();

router.get("/", blogpostGet);
router.get("/:title", singleBlogpostGet);
router.post("/", blogpostPost);
router.put("/:id", blogpostPut);
router.delete("/:id", blogpostDelete);

export default router;
