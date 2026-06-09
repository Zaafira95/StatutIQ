import express from "express";
import { getAdminData } from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/admin/data", adminAuth, getAdminData);

export default router;