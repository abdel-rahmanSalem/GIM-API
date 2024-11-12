import { Router } from "express";
import handleSignup from "../controllers/registerController.mjs";

const router = Router();

router.post("/gim/v1/register", handleSignup)

export default router;