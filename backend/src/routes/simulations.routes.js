import { Router } from "express";
import { createSimulation } from "../controllers/simulations.controller.js";
import express from "express";
import { generateIASimulation } from "../controllers/simulations.controller.js";

const router = Router();

router.post("/ia", generateIASimulation);
router.post("/", createSimulation);

export default router;
