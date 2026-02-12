import { callClaude } from "../services/claude.js";

export async function analyzeSimulation(req, res) {
    
  try {
    const simulation = req.body;
    console.log(simulation);

    if (!simulation || !simulation.metier) {
      return res.status(400).json({ error: "Simulation invalide" });
    }

    const systemPrompt = `
Tu es un expert-comptable et fiscaliste français spécialisé dans l'optimisation 
fiscale pour freelances. Tu dois analyser le profil suivant et recommander 
le statut juridique optimal.

RÈGLES STRICTES :
1. Calculs conformes législation française 2025
2. Prise en compte circulaire LLP UK septembre 2025
3. Recommandations basées sur scoring multi-critères pondéré
4. Explications claires niveau freelance
5. Toujours citer sources légales (BOFIP, URSSAF)

CRITÈRES SCORING :
- Rémunération nette : 40%
- Charges sociales/fiscales : 25%
- Sécurité juridique : 20%
- Complexité admin : 10%
- Flexibilité : 5%

STATUTS À COMPARER :
EURL (IS), EURL (IR), SASU, EI réel, Micro-entreprise, Portage salarial, 
CAE, Solutions internationales conformes (hors LLP UK)

Répond STRICTEMENT en JSON selon le schéma fourni.

IMPORTANT :
- Réponds uniquement en JSON valide
- Ne coupe jamais la réponse
- Si la réponse est trop longue, réduis les explications
- Ne dépasse pas 2000 tokens
`;

const userPrompt = `
PROFIL FREELANCE :
- Métier : ${simulation.metier}
- TJM : ${simulation.tjm}€
- Jours facturables/an : ${simulation.jours_facturables}
- CA prévisionnel : ${simulation.ca_previsionnel}€
- Statut actuel : ${simulation.statut_actuel}
- Objectif : ${simulation.objectif_principal}
- Appétence risque : ${simulation.appetence_risque}
- Situation familiale : ${simulation.situation_familiale}
- Projets patrimoniaux : ${simulation.projets_patrimoniaux}

TÂCHES :
1. Calculer rémunération nette pour chaque statut
2. Détail charges sociales/fiscales
3. Évaluer risques juridiques
4. Scorer selon critères pondérés
5. Recommander un statut optimal avec justification
6. Générer explications pédagogiques pour chaque choix

FORMAT RÉPONSE : JSON structuré exact (voir schéma):
{
  "recommandation_principale": {
    "statut": "...",
    "score_global": ...,
    "gain_vs_actuel": ...,
    "gain_pourcentage": ...,
    "justification": "..."
  },
  "comparatif_statuts": [
    {
      "statut": "...",
      "remuneration_nette_annuelle": ...,
      "charges_pourcentage": ...,
      "risque_juridique": "...",
      "complexite_admin": "...",
      "score": ...,
      "detail_calcul": { ... }
    }
  ],
   "explications_ia": {
    "choix_statut": "...",
    "optimisation_rem": "...",
    "fiscalite_detaillee": "...",
    "demarches": "..."
  },
    "alertes": [
    {
      "type": "attention",
      "message": "Votre CA dépasse seuil micro-entreprise..."
    }
  ],
  "next_steps": [ ... ]
}
`;

    const rawResponse = await callClaude(systemPrompt, userPrompt);
    console.log("🧠 Réponse brute Claude :", rawResponse);

    // nettoyage texte superflu
    const jsonStart = rawResponse.indexOf("{");
    const jsonEnd = rawResponse.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Réponse IA non exploitable");
    }

    const cleanedJson = rawResponse.slice(jsonStart, jsonEnd + 1);

    let parsed;

    try {
    parsed = JSON.parse(cleanedJson);
    } catch (parseError) {
    console.error("❌ JSON invalide reçu de Claude");
    console.error("📦 JSON brut :", cleanedJson);

    return res.status(500).json({
        error: "Réponse IA invalide",
        details: "Le JSON retourné par Claude est tronqué ou mal formé."
    });
    }

    res.json(parsed);

  } catch (err) {
    console.error("🔥 ERREUR IA CONTROLLER :", err);
    console.error("🔥 STACK :", err.stack);

    res.status(500).json({
        error: "Erreur lors de l'analyse IA",
        details: err.message
    });
  }
}

