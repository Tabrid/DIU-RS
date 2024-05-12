import express from "express";
import { login, logout, signup,forgotPass , resetpass} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPass);
router.post("/reset-password", resetpass);

export default router;