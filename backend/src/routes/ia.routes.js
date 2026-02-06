import express from "express";
import { callClaude } from "../services/claude.js";

const router = express.Router();

router.post("/simulation", async (req, res) => {
  const { simulation } = req.body;

  const prompt = `Analyse cette simulation et propose un résumé clair pour l'utilisateur : ${JSON.stringify(simulation)}`;

  try {
    const result = await callClaude(prompt);
    res.json({ iaResult: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur IA" });
  }
});

export default router;
