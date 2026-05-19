import {
  StatutJuridique,
  Objectif,
  Projet,
  AppetenceRisque,
  calculateGlobalScore,
} from "./scoring.js";

import { FiscalParameters } from "./config.js";

import {
  calculateCA,
  calculateQuotientFamilial,
  estimateTMI,
  simulateStatut,
} from "./calculator.js";

/**
 * Validation simple des données d'entrée.
 */
function validateInputs(inputs) {
  const objectifs = inputs.objectifs || [];

  if (objectifs.length > 3) {
    throw new Error(
      `Profil stratégique : 3 objectifs maximum (reçu : ${objectifs.length})`
    );
  }

  if (Number(inputs.tjm) < 0 || Number(inputs.jours_facturables) < 0) {
    throw new Error("TJM et jours facturables doivent être positifs.");
  }
}


export function getRisqueJuridique(statut, inputs = {}) {
  const risque = inputs.appetenceRisque;

  switch (statut) {

    case StatutJuridique.MICRO:
      return risque === "Faible"
        ? "Élevé"
        : "Modéré";

    case StatutJuridique.EI_REEL:
      return "Élevé";

    case StatutJuridique.EURL_IR:
      return "Modéré";

    case StatutJuridique.EURL_IS:
      return "Faible";

    case StatutJuridique.SASU:
      return "Faible";

    case StatutJuridique.PORTAGE:
      return "Faible";

    case StatutJuridique.CAE:
      return "Faible";

    default:
      return "Modéré";
  }
}

/**
 * Génère les points forts et points de vigilance.
 */
function generateInsights(simulation, inputs, tmi) {
  const pointsForts = [];
  const pointsVigilance = [];

  const statut = simulation.statut;
  const objectifs = inputs.objectifs || [];
  const projet = inputs.projets_patrimoniaux;
  const appetenceRisque = inputs.appetenceRisque;

  switch (statut) {
    case StatutJuridique.MICRO:
      pointsForts.push("Comptabilité très simplifiée.");
      pointsForts.push("Cotisations proportionnelles au chiffre d’affaires.");
      pointsVigilance.push(
        `Plafond de CA estimé : ${FiscalParameters.micro.plafondCA.toLocaleString(
          "fr-FR"
        )} €.`
      );
      pointsVigilance.push(
        "Charges réelles non déductibles et protection sociale limitée."
      );
      break;

    case StatutJuridique.EURL_IR:
      pointsForts.push("Cotisations TNS généralement optimisées.");
      pointsForts.push("Structure juridique sécurisante pour exercer seul.");
      pointsVigilance.push(
        "Bénéfice imposé directement à l’impôt sur le revenu."
      );
      pointsVigilance.push(
        "Moins de pilotage possible entre rémunération et dividendes."
      );
      break;

    case StatutJuridique.EURL_IS:
      pointsForts.push("Possibilité de piloter rémunération et bénéfices.");
      pointsForts.push("Épargne possible dans la société après IS.");
      pointsVigilance.push(
        "Comptabilité plus formalisée et accompagnement comptable conseillé."
      );
      break;

    case StatutJuridique.SASU:
      pointsForts.push("Bonne sécurité juridique et protection du patrimoine.");
      pointsForts.push("Statut souple, adapté aux projets évolutifs.");
      pointsVigilance.push(
        "Cotisations plus élevées sur la rémunération du président."
      );
      pointsVigilance.push(
        "Comptabilité d’engagement et obligations administratives."
      );
      break;

    case StatutJuridique.PORTAGE:
      pointsForts.push("Protection sociale complète et bulletin de salaire.");
      pointsForts.push("Aucune création de société nécessaire.");
      pointsVigilance.push(
        "Frais de gestion et charges généralement élevés."
      );
      pointsVigilance.push(
        "Peu de capitalisation patrimoniale dans une structure propre."
      );
      break;

    case StatutJuridique.CAE:
      pointsForts.push("Cadre sécurisé avec accompagnement collectif.");
      pointsForts.push("Protection sociale proche du salariat.");
      pointsVigilance.push(
        "Frais de structure et autonomie plus limitée."
      );
      break;

    case StatutJuridique.EI_REEL:
      pointsForts.push("Fonctionnement plus direct qu’une société.");
      pointsForts.push("Charges réelles déductibles.");
      pointsVigilance.push(
        "Responsabilité et risque juridique plus importants."
      );
      pointsVigilance.push(
        "Moins adapté si objectif de structuration patrimoniale."
      );
      break;

    default:
      break;
  }

  if (
    tmi >= 0.3 &&
    (statut === StatutJuridique.SASU ||
      statut === StatutJuridique.EURL_IS)
  ) {
    pointsForts.push(
      `TMI estimé à ${(tmi * 100).toFixed(
        0
      )} % : l’IS peut aider à lisser l’imposition.`
    );
  }

  if (
    projet === Projet.IMMOBILIER ||
    projet === Projet.RESIDENCE_PRINCIPALE
  ) {
    if (statut === StatutJuridique.PORTAGE) {
      pointsForts.push(
        "Le bulletin de salaire peut faciliter un dossier bancaire immobilier."
      );
    }

    if (statut === StatutJuridique.SASU) {
      pointsForts.push(
        "Une rémunération régulière peut aider à structurer un dossier bancaire."
      );
    }

    if (statut === StatutJuridique.MICRO) {
      pointsVigilance.push(
        "La micro-entreprise peut être moins lisible pour un projet immobilier important."
      );
    }
  }

  if (objectifs.includes(Objectif.RETRAITE)) {
    if (statut === StatutJuridique.MICRO) {
      pointsVigilance.push(
        "Cotisations retraite limitées : prévoir une épargne complémentaire."
      );
    }

    if (
      statut === StatutJuridique.SASU ||
      statut === StatutJuridique.PORTAGE ||
      statut === StatutJuridique.CAE
    ) {
      pointsForts.push(
        "Protection sociale plus lisible pour la retraite via un cadre salarié ou assimilé."
      );
    }
  }

  if (appetenceRisque === AppetenceRisque.FAIBLE) {
    if (
      statut === StatutJuridique.SASU ||
      statut === StatutJuridique.EURL_IS
    ) {
      pointsVigilance.push(
        "Profil prudent : prévoir un accompagnement comptable et juridique."
      );
    }
  }

  if (
    statut === StatutJuridique.MICRO &&
    simulation.ca > FiscalParameters.micro.plafondCA
  ) {
    pointsVigilance.push(
      `CA prévisionnel supérieur au plafond micro : ce régime ne sera pas adapté.`
    );
  }

  return {
    pointsForts,
    pointsVigilance,
  };
}

/**
 * Transforme une simulation brute en scénario complet.
 */
function buildScenario(simulation, inputs, tmi) {
  const scoreDetail = calculateGlobalScore(simulation, inputs, tmi);
  const insights = generateInsights(simulation, inputs, tmi);

  return {
    statut: simulation.statut,
    scoreGlobal: scoreDetail.total,
    scoreDetail,

    kpiFinanciers: {
      netMensuel: Math.round(simulation.netDisponible / 12),
      netAnnuel: Math.round(simulation.netDisponible),
      epargneAnnuelle: Math.round(simulation.epargneEntreprise),
      tauxPrelevement: simulation.tauxPrelevementGlobal,
    },

    detailCalcul: simulation.detailCalcul,
    pointsForts: insights.pointsForts,
    pointsVigilance: insights.pointsVigilance,
  };
}

/**
 * Fonction principale à appeler depuis ton controller/service.
 *
 * Elle accepte un objet proche de ton formData :
 * {
 *   tjm,
 *   jours_facturables,
 *   objectifs,
 *   appetenceRisque,
 *   projets_patrimoniaux,
 *   situationFamiliale,
 *   enfants
 * }
 */
export function generateRecommendations(inputs) {
  validateInputs(inputs);

  const ca = calculateCA(inputs.tjm, inputs.jours_facturables);

  const partsFiscales = calculateQuotientFamilial(
    inputs.situationFamiliale,
    inputs.enfants || []
  );

  const revenuImposableEstime = ca * 0.55;
  const tmi = estimateTMI(revenuImposableEstime, partsFiscales);

  const tousStatuts = [
    StatutJuridique.MICRO,
    StatutJuridique.EURL_IR,
    StatutJuridique.EURL_IS,
    StatutJuridique.SASU,
    StatutJuridique.PORTAGE,
    StatutJuridique.CAE,
    StatutJuridique.EI_REEL,
  ];

  const scenarios = tousStatuts.map((statut) => {
    const simulation = simulateStatut(ca, statut, partsFiscales);
    return buildScenario(simulation, inputs, tmi);
  });

  let finalList;

  if (ca < FiscalParameters.micro.plafondCA) {
    const microScenario = scenarios.find(
      (scenario) => scenario.statut === StatutJuridique.MICRO
    );

    const autres = scenarios
      .filter((scenario) => scenario.statut !== StatutJuridique.MICRO)
      .sort((a, b) => b.scoreGlobal - a.scoreGlobal);

    finalList = [microScenario, ...autres];
  } else {
    finalList = scenarios
      .filter((scenario) => scenario.statut !== StatutJuridique.MICRO)
      .sort((a, b) => b.scoreGlobal - a.scoreGlobal);
  }

  return {
    ca,
    partsFiscales,
    tmi,
    scenarios: finalList,
    top3: finalList.slice(0, 3),
  };
}

export {
  calculateCA,
  calculateQuotientFamilial,
  estimateTMI,
  simulateStatut,
};