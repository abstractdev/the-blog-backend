import express from "express";
import { userSignUpPost } from "../controllers/userController";
const router = express.Router();

router.post("/signup", userSignUpPost);

export default router;
