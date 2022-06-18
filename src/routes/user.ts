import express from "express";
import {
  userDelete,
  userGet,
  userSignUpPost,
  userPut,
  userLogInPost,
} from "../controllers/userController";
const router = express.Router();

router.get("/", userGet);
router.post("/signup", userSignUpPost);
router.post("/login", userLogInPost);
router.put("/", userPut);
router.delete("/", userDelete);

export default router;
