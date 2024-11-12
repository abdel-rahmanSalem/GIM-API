import { Router } from "express";
import authorizeUser from "../middlewares/authorizeToken.mjs";
import { deleteOwner, getOwnerData } from "../controllers/ownerController.mjs";

const router = Router();

router.get("/gim/v1/owner", authorizeUser, getOwnerData);

router.delete("/gim/v1/owner", authorizeUser, deleteOwner);

export default router;
