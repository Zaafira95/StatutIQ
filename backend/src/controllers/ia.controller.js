import {
  generateClaudeSimulation,
  generateLocalSimulation,
} from "../services/ia.service.js";

export async function analyzeSimulation(req, res) {
  try {
    const simulation = req.body;

    console.log("📥 Simulation reçue :", simulation);

    if (!simulation || !simulation.metier) {
      return res.status(400).json({
        error: "Simulation invalide",
      });
    }

    let result;

    try {
      // ✅ moteur interne + enrichissement Claude
      result = await generateClaudeSimulation(simulation);
    } catch (claudeError) {
      console.error("⚠️ Claude indisponible :", claudeError.message);

      // ✅ fallback si Claude plante
      result = generateLocalSimulation(simulation);
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("🔥 ERREUR IA CONTROLLER :", err);
    console.error(err.stack);

    return res.status(500).json({
      error: "Erreur lors de l’analyse IA",
      details: err.message,
    });
  }
}