import { callClaude } from "../services/claude.js";

export async function analyzeSimulation(req, res) {
  try {
    const { simulation } = req.body;

    if (!simulation) {
      return res.status(400).json({ error: "Simulation manquante" });
    }

    const systemPrompt = `
Tu es un expert-comptable français.
Tu DOIS répondre UNIQUEMENT avec du JSON valide.
AUCUN texte hors JSON.
`;

    const userPrompt = `
Analyse cette simulation et réponds STRICTEMENT selon le schéma JSON fourni.

SIMULATION :
${JSON.stringify(simulation, null, 2)}
`;

    const rawResponse = await callClaude(systemPrompt, userPrompt);

    // 🧼 Nettoyage sécurité (au cas où Claude ajoute du texte)
    const jsonStart = rawResponse.indexOf("{");
    const jsonEnd = rawResponse.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Réponse IA non exploitable");
    }

    const cleanJson = rawResponse.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(cleanJson);

    res.json({
      success: true,
      result: parsed
    });

  } catch (err) {
    console.error("❌ Erreur IA:", err.message);

    res.status(500).json({
      error: "Erreur lors de l'analyse IA",
      details: err.message
    });
  }
}
