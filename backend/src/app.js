import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import simulationsRoutes from "./routes/simulations.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors());
app.use(express.json());

// Route principale des simulations
app.use("/api/simulations", simulationsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api", adminRoutes);


export default app;
