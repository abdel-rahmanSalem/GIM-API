import { Router } from "express";
import handleLogout from "../controllers/auth/logoutController.mjs";
import authorizeUser from "../middlewares/authorizeToken.mjs";

const router = Router();

router.delete("/gim/v1/logout", authorizeUser, handleLogout);

export default router;
