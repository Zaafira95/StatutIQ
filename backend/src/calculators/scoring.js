/**
 * scoring.js
 * Moteur de scoring interne StatutIQ
 *
 * Pondération :
 * - Rentabilité : 40 pts
 * - Adéquation objectifs : 40 pts
 * - Faisabilité / Risque : 20 pts
 * Total : 100 pts
 */

// Statuts internes
export const StatutJuridique = {
  SASU: "SASU",
  EURL_IS: "EURL (IS)",
  EURL_IR: "EURL (IR)",
  MICRO: "Micro-entreprise",
  PORTAGE: "Portage salarial",
  CAE: "CAE",
  EI_REEL: "EI réel",
};

// Objectifs internes
export const Objectif = {
  OPTIMISATION_FISCALE: "Optimisation fiscale",
  PROTECTION_SOCIALE: "Protection sociale renforcée",
  RETRAITE: "Préparer la retraite",
  SIMPLICITE: "Simplicité administrative",
  TRANSMISSION: "Transmission / succession",
  TRESORERIE: "Flexibilité future",
  REMUNERATION_IMMEDIATE: "Maximiser la rémunération nette",
  PATRIMOINE_IMMOBILIER: "Développer un patrimoine immobilier",
};

// Appétence risque
export const AppetenceRisque = {
  FAIBLE: "Faible",
  MODEREE: "Modérée",
  ELEVEE: "Élevée",
};

// Projets patrimoniaux
export const Projet = {
  IMMOBILIER: "Investissement locatif",
  RESIDENCE_PRINCIPALE: "Achat résidence principale",
  CREATION_ENTREPRISE: "Création / reprise d’entreprise",
  RETRAITE: "Préparation retraite",
  TRANSMISSION: "Transmission aux enfants",
  EPARGNE: "Constitution d’épargne long terme",
  DIVERSIFICATION: "Diversification financière",
  EXPATRIATION: "Expatriation",
};

// Matrice objectifs x statuts
const OBJECTIF_MATRIX = {
  [Objectif.OPTIMISATION_FISCALE]: {
    [StatutJuridique.SASU]: 10,
    [StatutJuridique.EURL_IS]: 9,
    [StatutJuridique.EURL_IR]: 5,
    [StatutJuridique.MICRO]: 4,
    [StatutJuridique.PORTAGE]: 2,
    [StatutJuridique.CAE]: 3,
    [StatutJuridique.EI_REEL]: 5,
  },

  [Objectif.PROTECTION_SOCIALE]: {
    [StatutJuridique.PORTAGE]: 10,
    [StatutJuridique.SASU]: 8,
    [StatutJuridique.EURL_IS]: 6,
    [StatutJuridique.EURL_IR]: 6,
    [StatutJuridique.MICRO]: 3,
    [StatutJuridique.CAE]: 8,
    [StatutJuridique.EI_REEL]: 5,
  },

  [Objectif.RETRAITE]: {
    [StatutJuridique.PORTAGE]: 10,
    [StatutJuridique.SASU]: 9,
    [StatutJuridique.EURL_IS]: 7,
    [StatutJuridique.EURL_IR]: 7,
    [StatutJuridique.MICRO]: 3,
    [StatutJuridique.CAE]: 8,
    [StatutJuridique.EI_REEL]: 5,
  },

  [Objectif.SIMPLICITE]: {
    [StatutJuridique.MICRO]: 10,
    [StatutJuridique.PORTAGE]: 9,
    [StatutJuridique.CAE]: 7,
    [StatutJuridique.EURL_IR]: 5,
    [StatutJuridique.SASU]: 3,
    [StatutJuridique.EURL_IS]: 3,
    [StatutJuridique.EI_REEL]: 5,
  },

  [Objectif.TRANSMISSION]: {
    [StatutJuridique.SASU]: 10,
    [StatutJuridique.EURL_IS]: 8,
    [StatutJuridique.EURL_IR]: 5,
    [StatutJuridique.MICRO]: 1,
    [StatutJuridique.PORTAGE]: 1,
    [StatutJuridique.CAE]: 2,
    [StatutJuridique.EI_REEL]: 4,
  },

  [Objectif.TRESORERIE]: {
    [StatutJuridique.SASU]: 10,
    [StatutJuridique.EURL_IS]: 9,
    [StatutJuridique.EURL_IR]: 4,
    [StatutJuridique.MICRO]: 2,
    [StatutJuridique.PORTAGE]: 1,
    [StatutJuridique.CAE]: 2,
    [StatutJuridique.EI_REEL]: 4,
  },

  [Objectif.REMUNERATION_IMMEDIATE]: {
    [StatutJuridique.MICRO]: 9,
    [StatutJuridique.PORTAGE]: 9,
    [StatutJuridique.EURL_IR]: 7,
    [StatutJuridique.SASU]: 5,
    [StatutJuridique.EURL_IS]: 5,
    [StatutJuridique.CAE]: 6,
    [StatutJuridique.EI_REEL]: 7,
  },

  [Objectif.PATRIMOINE_IMMOBILIER]: {
    [StatutJuridique.SASU]: 9,
    [StatutJuridique.PORTAGE]: 8,
    [StatutJuridique.EURL_IS]: 7,
    [StatutJuridique.EURL_IR]: 6,
    [StatutJuridique.EI_REEL]: 5,
    [StatutJuridique.MICRO]: 3,
    [StatutJuridique.CAE]: 5,
  },
};

export function scoreRentabilite(simulation) {
  if (!simulation.ca || simulation.ca <= 0) return 0;

  const netDisponible = Number(simulation.netDisponible || 0);
  const epargneEntreprise = Number(simulation.epargneEntreprise || 0);
  const ca = Number(simulation.ca);

  const ratio = (netDisponible + epargneEntreprise) / ca;

  const min = 0.4;
  const max = 0.75;

  const normalized = Math.max(0, Math.min(1, (ratio - min) / (max - min)));

  return Math.round(normalized * 40);
}

export function scoreAdequationObjectifs(statut, objectifs = []) {
  if (!Array.isArray(objectifs) || objectifs.length === 0) {
    return 20;
  }

  const total = objectifs.reduce((acc, objectif) => {
    return acc + (OBJECTIF_MATRIX[objectif]?.[statut] || 0);
  }, 0);

  const max = objectifs.length * 10;

  return Math.round((total / max) * 40);
}

export function scoreFaisabilite(statut, appetenceRisque) {
  let score = 20;

  if (appetenceRisque === AppetenceRisque.FAIBLE) {
    if (statut === StatutJuridique.SASU) score -= 8;
    if (statut === StatutJuridique.EURL_IS) score -= 5;
    if (statut === StatutJuridique.EI_REEL) score -= 6;
  }

  if (appetenceRisque === AppetenceRisque.ELEVEE) {
    if (statut === StatutJuridique.PORTAGE) score -= 5;
    if (statut === StatutJuridique.MICRO) score -= 3;
    if (statut === StatutJuridique.CAE) score -= 4;
  }

  return Math.max(0, score);
}

export function applyBusinessRules(scoreDetail, statut, inputs = {}, tmi = 0) {
  let bonus = 0;

  const objectifs = inputs.objectifs || [];
  const projet = inputs.projets_patrimoniaux;

  // TMI élevé : favoriser l'IS
  if (tmi >= 0.3) {
    if (
      statut === StatutJuridique.SASU ||
      statut === StatutJuridique.EURL_IS
    ) {
      bonus += 15;
    }
  }

  // Projet immobilier : favoriser SASU / Portage
  if (
    projet === Projet.IMMOBILIER ||
    projet === Projet.RESIDENCE_PRINCIPALE
  ) {
    if (
      statut === StatutJuridique.SASU ||
      statut === StatutJuridique.PORTAGE
    ) {
      bonus += 10;
    }
  }

  // Protection sociale / retraite
  if (
    objectifs.includes(Objectif.PROTECTION_SOCIALE) ||
    objectifs.includes(Objectif.RETRAITE)
  ) {
    if (
      statut === StatutJuridique.PORTAGE ||
      statut === StatutJuridique.EURL_IR ||
      statut === StatutJuridique.CAE
    ) {
      bonus += 10;
    }
  }

  const baseTotal =
    scoreDetail.rentabilite +
    scoreDetail.adequationObjectifs +
    scoreDetail.faisabiliteRisque;

  const totalAvecBonus = Math.min(100, baseTotal + bonus);

  return {
    ...scoreDetail,
    bonusReglesMetier: bonus,
    total: totalAvecBonus,
  };
}

export function calculateGlobalScore(simulation, inputs = {}, tmi = 0) {
  const rentabilite = scoreRentabilite(simulation);

  const adequationObjectifs = scoreAdequationObjectifs(
    simulation.statut,
    inputs.objectifs || []
  );

  const faisabiliteRisque = scoreFaisabilite(
    simulation.statut,
    inputs.appetenceRisque
  );

  const baseDetail = {
    rentabilite,
    adequationObjectifs,
    faisabiliteRisque,
    bonusReglesMetier: 0,
    total: rentabilite + adequationObjectifs + faisabiliteRisque,
  };

  return applyBusinessRules(baseDetail, simulation.statut, inputs, tmi);
}