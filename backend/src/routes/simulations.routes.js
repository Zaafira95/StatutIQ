import { Router } from "express";
import { createSimulation } from "../controllers/simulations.controller.js";

const router = Router();

router.post("/", createSimulation);

export default router;
