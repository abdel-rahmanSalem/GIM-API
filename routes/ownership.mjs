import { Router } from "express";
import authorizeUser from "../middlewares/authorizeToken.mjs";
import removeOwnership from "../controllers/ownership/removeOwnershipController.mjs";
import createOwnership from "../controllers/ownership/createOwnershipController.mjs";
import getOwnership from "../controllers/ownership/getOwnershipController.mjs";

const router = Router();

router.post("/gim/v1/ownership/:gymId", authorizeUser, createOwnership);

router.get("/gim/v1/ownership/:gymId", authorizeUser, getOwnership);

router.delete("/gim/v1/ownership/:gymId", authorizeUser, removeOwnership);

export default router;
