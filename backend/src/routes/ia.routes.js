import express from "express";
import { analyzeSimulation } from "../controllers/ia.controller.js";

const router = express.Router();

router.post("/simulation", analyzeSimulation);

export default router;
