import { Router } from "express";
import authorizeUser from "../middlewares/authorizeToken.mjs";
import getGyms from "../controllers/gym/getGymsController.mjs";
import getGymById from "../controllers/gym/getGymByIdController.mjs";
import createGym from "../controllers/gym/createGymController.mjs";
import deleteGymById from "../controllers/gym/deleteGymByIdController.mjs";

const router = Router();

router.get("/gim/v1/gyms", authorizeUser, getGyms);

router.get("/gim/v1/gyms/:gymId", authorizeUser, getGymById);

router.post("/gim/v1/gyms", authorizeUser, createGym);

router.delete("/gim/v1/gyms/:gymId", authorizeUser, deleteGymById);

export default router;
