import { callClaude } from "./claude.js";

export async function generateClaudeSimulation(data) {
  const {
    metier,
    tjm,
    jours_facturables,
    ca_previsionnel,
    statut_actuel,
    objectif_principal,
    appetence_risque,
    situation_familiale,
    projets_patrimoniaux
  } = data;

    const SYSTEM_PROMPT = `
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
- Ne mets aucun retour à la ligne dans les strings.
- Utilise \n pour les sauts de ligne.
- N'ajoute aucun texte avant ou après le JSON.
`;

  const USER_PROMPT = `
PROFIL :
- Métier : ${metier}
- TJM : ${tjm}€
- Jours facturables/an : ${jours_facturables}
- CA prévisionnel : ${ca_previsionnel}€
- Statut actuel : ${statut_actuel}

Objectifs :
- Principaux : ${objectif_principal?.principaux?.join(", ")}
- Autre : ${objectif_principal?.autre || "Aucun"}

Appétence risque : ${appetence_risque}

Situation familiale :
- Statut : ${situation_familiale?.statut}
- Enfants à charge : ${situation_familiale?.enfants_a_charge ? "Oui" : "Non"}
- Détail enfants : ${situation_familiale?.enfants?.join(", ") || "Aucun"}

Projets patrimoniaux : ${projets_patrimoniaux}

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
      "message": "..."
    }
  ],
  "next_steps": [ ... ]
}
`;

  const rawResponse = await callClaude(SYSTEM_PROMPT, USER_PROMPT);
  console.log("🧠 Réponse brute Claude :", rawResponse);

  // 🔒 Nettoyage sécurisé
  const jsonStart = rawResponse.indexOf("{");
  const jsonEnd = rawResponse.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Réponse IA non exploitable");
  }

  let cleanedJson = rawResponse.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleanedJson);
  } catch (err) {
    console.error("❌ JSON invalide IA :", cleanedJson);
    throw new Error("Réponse IA invalide");
  }
}
