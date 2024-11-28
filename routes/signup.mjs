import { Router } from "express";
import handleSignup from "../controllers/auth/signupController.mjs";

const router = Router();

router.post("/gim/v1/signup", handleSignup);

export default router;
