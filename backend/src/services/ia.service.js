import { callClaude } from "./claude.js";
import { generateRecommendations } from "../calculators/engine.js";

export async function generateClaudeSimulation(data) {
  const {
    metier,
    tjm,
    jours_facturables,
    statut_actuel,
    objectif_principal,
    appetence_risque,
    situation_familiale,
    projets_patrimoniaux
  } = data;

  // 1. Préparer les inputs pour le moteur interne
  const engineInputs = {
    tjm: Number(tjm),
    jours_facturables: Number(jours_facturables),

    objectifs: objectif_principal?.principaux || [],
    appetenceRisque: appetence_risque,
    projets_patrimoniaux,

    situationFamiliale: situation_familiale?.statut,
    enfants: situation_familiale?.enfants || []
  };

  // 2. Calculs internes : CA, statuts, scores, classement
  const recommandations = generateRecommendations(engineInputs);

  const bestScenario = recommandations.scenarios[0];

  // 3. Comparatif formaté pour ta page Result.jsx
  const comparatif_statuts = recommandations.scenarios.map((scenario) => ({
    statut: scenario.statut,
    remuneration_nette_annuelle: scenario.kpiFinanciers.netAnnuel,
    charges_pourcentage: Math.round(scenario.kpiFinanciers.tauxPrelevement * 100),
    risque_juridique:
      scenario.pointsVigilance.length >= 3 ? "Modéré" : "Faible",
    complexite_admin:
      scenario.pointsVigilance.some((v) =>
        v.toLowerCase().includes("comptabilité")
      )
        ? "Modérée"
        : "Faible",
    score: scenario.scoreGlobal,
    score_detail: scenario.scoreDetail,
    epargne_annuelle: scenario.kpiFinanciers.epargneAnnuelle,
    detail_calcul: scenario.detailCalcul,
    points_forts: scenario.pointsForts,
    points_vigilance: scenario.pointsVigilance
  }));
  

  const currentScenario = recommandations.scenarios.find(
    (s) => s.statut === statut_actuel
  );

  const netActuel = currentScenario?.kpiFinanciers?.netAnnuel || 0;
  
  const gainVsActuel = netActuel
    ? bestScenario.kpiFinanciers.netAnnuel - netActuel
    : 0;

  const gainPourcentage = netActuel
    ? Math.round((gainVsActuel / netActuel) * 100)
    : 0;

  // 4. Claude explique uniquement les résultats calculés
  const SYSTEM_PROMPT = `
    Tu es un expert-comptable et fiscaliste français spécialisé dans l'accompagnement des freelances.

    IMPORTANT :
    - Tu ne dois jamais recalculer les montants.
    - Les calculs, scores et classements sont déjà fournis par le moteur interne.
    - Tu dois uniquement expliquer les résultats de manière pédagogique.
    - Réponds uniquement en JSON valide.
    - Aucun texte avant ou après le JSON.
    - Ne mets aucun retour à la ligne brut dans les strings.
    `;

  const USER_PROMPT = `
PROFIL UTILISATEUR :
- Métier : ${metier}
- TJM : ${tjm} €
- Jours facturables/an : ${jours_facturables}
- CA prévisionnel calculé : ${recommandations.ca} €
- Statut actuel : ${statut_actuel}
- Objectifs : ${(objectif_principal?.principaux || []).join(", ")}
- Autre objectif : ${objectif_principal?.autre || "Aucun"}
- Appétence risque : ${appetence_risque}
- Situation familiale : ${situation_familiale?.statut}
- Enfants : ${situation_familiale?.enfants?.join(", ") || "Aucun"}
- Projets patrimoniaux : ${projets_patrimoniaux}

RÉSULTATS CALCULÉS PAR LE MOTEUR INTERNE :
${JSON.stringify(
  {
    ca: recommandations.ca,
    partsFiscales: recommandations.partsFiscales,
    tmi: recommandations.tmi,
    meilleurScenario: bestScenario,
    comparatif: comparatif_statuts
  },
  null,
  2
)}

TA MISSION :
Génère uniquement les textes pédagogiques suivants :
- justification du statut recommandé
- explication du choix du statut
- explication de l'optimisation de rémunération
- explication fiscale
- démarches à suivre
- alertes éventuelles
- prochaines étapes

FORMAT JSON STRICT :
{
  "justification": "...",
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
  "next_steps": ["...", "...", "..."]
}
`;

  const rawResponse = await callClaude(SYSTEM_PROMPT, USER_PROMPT);
  console.log("🧠 Réponse brute Claude :", rawResponse);

  const jsonStart = rawResponse.indexOf("{");
  const jsonEnd = rawResponse.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Réponse IA non exploitable");
  }

  const cleanedJson = rawResponse.slice(jsonStart, jsonEnd + 1);

  let iaTexts;

  try {
    iaTexts = JSON.parse(cleanedJson);
  } catch (err) {
    console.error("❌ JSON invalide IA :", cleanedJson);
    return generateLocalSimulation(data);
  }

  // 5. Résultat final envoyé au frontend
  return {
    recommandation_principale: {
      statut: bestScenario.statut,
      score_global: bestScenario.scoreGlobal,
      gain_vs_actuel: Math.round(gainVsActuel),
      gain_pourcentage: gainPourcentage,
      justification: iaTexts.justification
    },

    donnees_communes: {
      ca_previsionnel: recommandations.ca,
      parts_fiscales: recommandations.partsFiscales,
      tmi: recommandations.tmi,
      tjm: Number(tjm),
      jours_facturables: Number(jours_facturables),
    },

    comparatif_statuts,

    explications_ia: iaTexts.explications_ia,
    alertes: iaTexts.alertes || [],
    next_steps: iaTexts.next_steps || []
  };
}



export function generateLocalSimulation(data) {
  const {
    metier,
    tjm,
    jours_facturables,
    statut_actuel,
    objectif_principal,
    appetence_risque,
    situation_familiale,
    projets_patrimoniaux
  } = data;

  const engineInputs = {
    tjm: Number(tjm),
    jours_facturables: Number(jours_facturables),
    objectifs: objectif_principal?.principaux || [],
    appetenceRisque: appetence_risque,
    projets_patrimoniaux,
    situationFamiliale: situation_familiale?.statut,
    enfants: situation_familiale?.enfants || []
  };

  const recommandations = generateRecommendations(engineInputs);
  const bestScenario = recommandations.top3?.[0] || recommandations.scenarios[0];

  const comparatif_statuts = recommandations.scenarios.map((scenario) => ({
    statut: scenario.statut,
    remuneration_nette_annuelle: scenario.kpiFinanciers.netAnnuel,
    charges_pourcentage: Math.round(scenario.kpiFinanciers.tauxPrelevement * 100),
    risque_juridique: "Faible",
    complexite_admin:
      scenario.pointsVigilance.some((v) =>
        v.toLowerCase().includes("comptabilité")
      )
        ? "Modérée"
        : "Faible",
    score: scenario.scoreGlobal,
    score_detail: scenario.scoreDetail,
    detail_calcul: scenario.detailCalcul,
    epargne_annuelle: scenario.kpiFinanciers.epargneAnnuelle,
    points_forts: scenario.pointsForts,
    points_vigilance: scenario.pointsVigilance
  }));

  const currentScenario = recommandations.scenarios.find(
    (s) => s.statut === statut_actuel
  );

  const netActuel = currentScenario?.kpiFinanciers?.netAnnuel || 0;

  const gainVsActuel = netActuel
    ? bestScenario.kpiFinanciers.netAnnuel - netActuel
    : 0;

  const gainPourcentage = netActuel
    ? Math.round((gainVsActuel / netActuel) * 100)
    : 0;

  return {
    recommandation_principale: {
      statut: bestScenario.statut,
      score_global: bestScenario.scoreGlobal,
      gain_vs_actuel: Math.round(gainVsActuel),
      gain_pourcentage: gainPourcentage,
      justification:
        "Recommandation générée par le moteur de calcul interne. Les explications IA n’ont pas pu être générées."
    },

    donnees_communes: {
      ca_previsionnel: recommandations.ca,
      parts_fiscales: recommandations.partsFiscales,
      tmi: recommandations.tmi,
      tjm: Number(tjm),
      jours_facturables: Number(jours_facturables),
    },

    comparatif_statuts,

    explications_ia: {
      choix_statut:
        "Cette recommandation est basée sur le score interne combinant rentabilité, adéquation aux objectifs et faisabilité.",
      optimisation_rem:
        "Le moteur compare la rémunération nette estimée, les charges et l’épargne disponible pour chaque statut.",
      fiscalite_detaillee:
        "Les calculs fiscaux sont effectués par le moteur interne à partir des paramètres configurés.",
      demarches:
        "Les démarches détaillées seront enrichies lorsque l’IA sera disponible."
    },

    alertes: [
      {
        type: "info",
        message:
          "Les résultats ont été générés avec le moteur interne, sans enrichissement Claude."
      }
    ],

    next_steps: [
      "Vérifier les résultats de la simulation",
      "Comparer les statuts selon vos objectifs",
      "Consulter un expert avant toute décision"
    ]
  };
}