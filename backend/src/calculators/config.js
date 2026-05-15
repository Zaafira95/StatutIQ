import { StatutJuridique } from "./scoring.js";

/**
 * Paramètres fiscaux et sociaux centralisés.
 * Toute évolution de barème ou taux doit être faite ici.
 */

export const FiscalParameters = {
  // Micro-entreprise BNC prestations de service
  micro: {
    plafondCA: 35000,
    abattementBNC: 0.34,
    cotisationsSurCA: 0.212,
  },

  // Barème progressif IR par part fiscale
  baremeIR: [
    { plafond: 11294, taux: 0 },
    { plafond: 28797, taux: 0.11 },
    { plafond: 82341, taux: 0.30 },
    { plafond: 177106, taux: 0.41 },
    { plafond: Number.POSITIVE_INFINITY, taux: 0.45 },
  ],

  plafondDemiPart: 1759,

  // Cotisations sociales moyennes simplifiées par statut
  cotisationsParStatut: {
    [StatutJuridique.SASU]: {
      tauxSurNet: 0.80,
      fraisFixesAnnuels: 1500,
    },

    [StatutJuridique.EURL_IS]: {
      tauxSurNet: 0.45,
      fraisFixesAnnuels: 1500,
    },

    [StatutJuridique.EURL_IR]: {
      tauxSurBeneficeNet: 0.45,
      fraisFixesAnnuels: 1500,
    },

    [StatutJuridique.PORTAGE]: {
      tauxSurBrut: 0.50,
      fraisGestion: 0.10,
    },

    [StatutJuridique.MICRO]: {
      tauxSurCA: 0.212,
      fraisFixesAnnuels: 0,
    },

    [StatutJuridique.CAE]: {
      tauxSurBrut: 0.48,
      fraisGestion: 0.10,
    },

    [StatutJuridique.EI_REEL]: {
      tauxSurBeneficeNet: 0.45,
      fraisFixesAnnuels: 800,
    },
  },

  // Impôt sur les sociétés
  is: {
    tauxReduit: 0.15,
    plafondTauxReduit: 42500,
    tauxNormal: 0.25,
  },

  // PFU dividendes
  flatTax: 0.30,

  // Charges déductibles proxy
  ratioChargesProxy: 0.05,
};