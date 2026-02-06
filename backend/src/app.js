import express from "express";
import cors from "cors";

import simulationsRoutes from "./routes/simulations.routes.js";
import iaRoutes from "./routes/ia.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Route principale des simulations
app.use("/api/simulations", simulationsRoutes);
app.use("/api/ia", iaRoutes);

export default app;
