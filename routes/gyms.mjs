import { Router } from "express";
import authorizeUser from "../middlewares/authorizeToken.mjs";
import {
  getGymsData,
  deleteGym,
  addGym,
} from "../controllers/gymController.mjs";

const router = Router();

router.get("/gim/v1/gyms", authorizeUser, getGymsData);

router.post("/gim/v1/gyms", authorizeUser, addGym);

router.delete("/gim/v1/gyms", authorizeUser, deleteGym);

export default router;
