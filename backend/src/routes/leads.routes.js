import express from "express";
import { createLead } from "../controllers/leads.controller.js";

const router = express.Router();

router.post("/", createLead);

export default router;
