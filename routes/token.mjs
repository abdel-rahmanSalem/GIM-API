import { Router } from "express";
import handleToken from "../controllers/auth/tokenController.mjs";

const router = Router();

router.post("/gim/v1/token", handleToken);

export default router;
