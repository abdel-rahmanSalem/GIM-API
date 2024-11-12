import { Router } from "express";
import handleToken from "../controllers/tokenController.mjs";

const router = Router();

router.post("/gim/v1/token", handleToken);

export default router;
