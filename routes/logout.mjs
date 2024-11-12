import { Router } from "express";
import handleLogout from "../controllers/logoutController.mjs";

const router = Router();

router.delete("/gim/v1/logout", handleLogout);

export default router;
