import express from "express";
import cors from "cors";

import simulationsRoutes from "./routes/simulations.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Route principale des simulations
app.use("/api/simulations", simulationsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api", adminRoutes);


export default app;
