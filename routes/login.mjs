import { Router } from "express";
import handleLogin from "../controllers/auth/loginController.mjs";

const router = Router();

router.post("/gim/v1/login", handleLogin);

export default router;
