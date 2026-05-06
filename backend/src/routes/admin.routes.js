import express from "express";
import { getAdminData } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/admin/data", getAdminData);

export default router;