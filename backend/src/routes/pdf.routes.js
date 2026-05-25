import express from "express";
import { generateSimulationPdfFile } from "../services/pdf.service.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const data = req.body;
    const simulationId = data.simulation_id || Date.now();

    const pdf = await generateSimulationPdfFile(data, simulationId);

    res.download(pdf.filePath, "rapport-simulation-statutIQ.pdf");
  } catch (err) {
    console.error("Erreur génération PDF :", err);

    res.status(500).json({
      error: "Erreur génération PDF",
      details: err.message,
    });
  }
});

export default router;