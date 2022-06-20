import express from "express";
import { authorSignUpPost } from "../controllers/authorController";
const router = express.Router();

router.post("/signup", authorSignUpPost);

export default router;
