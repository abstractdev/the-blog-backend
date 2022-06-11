import express from "express";
import {
  userDelete,
  userGet,
  userPost,
  userPut,
} from "../controllers/userController";
const router = express.Router();

router.get("/", userGet);
router.post("/", userPost);
router.put("/:username", userPut);
router.delete("/:username", userDelete);

export default router;
