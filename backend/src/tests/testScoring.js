import {
  calculateGlobalScore,
  StatutJuridique,
  AppetenceRisque,
  Objectif,
  Projet,
} from "../calculators/scoring.js";

const simulation = {
  statut: StatutJuridique.SASU,
  ca: 154000,
  netDisponible: 90000,
  epargneEntreprise: 12000,
};

const inputs = {
  objectifs: [
    Objectif.OPTIMISATION_FISCALE,
    Objectif.REMUNERATION_IMMEDIATE,
    Objectif.PATRIMOINE_IMMOBILIER,
  ],
  appetenceRisque: AppetenceRisque.MODEREE,
  projets_patrimoniaux: Projet.IMMOBILIER,
};

const tmi = 0.3;

const score = calculateGlobalScore(simulation, inputs, tmi);
