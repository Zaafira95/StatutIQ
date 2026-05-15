import {
  StatutJuridique,
} from "./scoring.js";

import { FiscalParameters } from "./config.js";

/**
 * Détail vide standard pour chaque simulation de statut.
 */
function emptyDetail() {
  return {
    cotisationsSociales: 0,
    impotSurRevenu: 0,
    impotSurSocietes: 0,
    flatTaxDividendes: 0,
    fraisGestion: 0,
    fraisFixes: 0,
  };
}

/**
 * CA brut prévisionnel.
 */
export function calculateCA(tjm, jours) {
  const safeTjm = Number(tjm);
  const safeJours = Number(jours);

  if (safeTjm < 0 || safeJours < 0) {
    throw new Error("TJM et nombre de jours doivent être positifs.");
  }

  return safeTjm * safeJours;
}

/**
 * Calcul simplifié du quotient familial.
 *
 * situationFamiliale attend :
 * - "Célibataire"
 * - "Marié"
 * - "Pacsé"
 * - "Divorcé"
 *
 * enfants attend un tableau :
 * ["0-5 ans", "6-10 ans"]
 */
export function calculateQuotientFamilial(situationFamiliale, enfants = []) {
  let parts = 1;

  if (
    situationFamiliale === "Marié" ||
    situationFamiliale === "Marié(e)" ||
    situationFamiliale === "Pacsé" ||
    situationFamiliale === "Pacsé(e)"
  ) {
    parts = 2;
  }

  const nombreEnfants = Array.isArray(enfants) ? enfants.length : 0;

  if (nombreEnfants <= 2) {
    parts += nombreEnfants * 0.5;
  } else {
    parts += 1 + (nombreEnfants - 2);
  }

  return parts;
}

/**
 * Impôt sur le revenu simplifié selon le barème progressif.
 */
export function calculateIR(revenuImposable, partsFiscales = 1) {
  const revenu = Number(revenuImposable);

  if (revenu <= 0 || partsFiscales <= 0) return 0;

  const quotient = revenu / partsFiscales;

  let impotParPart = 0;
  let bornePrecedente = 0;

  for (const tranche of FiscalParameters.baremeIR) {
    if (quotient <= bornePrecedente) break;

    const baseDansTranche =
      Math.min(quotient, tranche.plafond) - bornePrecedente;

    impotParPart += baseDansTranche * tranche.taux;
    bornePrecedente = tranche.plafond;
  }

  return Math.round(impotParPart * partsFiscales);
}

/**
 * Estimation du TMI.
 */
export function estimateTMI(revenuImposable, partsFiscales = 1) {
  const revenu = Number(revenuImposable);

  if (revenu <= 0 || partsFiscales <= 0) return 0;

  const quotient = revenu / partsFiscales;

  for (const tranche of FiscalParameters.baremeIR) {
    if (quotient <= tranche.plafond) {
      return tranche.taux;
    }
  }

  return 0.45;
}

/**
 * Impôt sur les sociétés.
 */
export function calculateIS(beneficeImposable) {
  const benefice = Number(beneficeImposable);

  if (benefice <= 0) return 0;

  const { tauxReduit, plafondTauxReduit, tauxNormal } = FiscalParameters.is;

  if (benefice <= plafondTauxReduit) {
    return Math.round(benefice * tauxReduit);
  }

  return Math.round(
    plafondTauxReduit * tauxReduit +
      (benefice - plafondTauxReduit) * tauxNormal
  );
}

/**
 * Simulation complète d'un statut juridique.
 *
 * Retourne un objet compatible avec le scoring.js :
 * {
 *   statut,
 *   ca,
 *   netDisponible,
 *   epargneEntreprise,
 *   tauxPrelevementGlobal,
 *   detailCalcul
 * }
 */
export function simulateStatut(
  ca,
  statut,
  partsFiscales = 1
) {
  const safeCa = Number(ca);
  const detail = emptyDetail();

  let netDisponible = 0;
  let epargneEntreprise = 0;

  const chargesDeductibles = safeCa * FiscalParameters.ratioChargesProxy;
  const params = FiscalParameters.cotisationsParStatut;

  switch (statut) {
    case StatutJuridique.MICRO: {
      const cotisations = safeCa * params[StatutJuridique.MICRO].tauxSurCA;
      const revenuImposable =
        safeCa * (1 - FiscalParameters.micro.abattementBNC);
      const ir = calculateIR(revenuImposable, partsFiscales);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;

      netDisponible = safeCa - cotisations - ir;
      break;
    }

    case StatutJuridique.EURL_IR: {
      const fraisFixes = params[StatutJuridique.EURL_IR].fraisFixesAnnuels;
      const beneficeBrut = safeCa - chargesDeductibles - fraisFixes;

      const cotisations =
        (beneficeBrut *
          params[StatutJuridique.EURL_IR].tauxSurBeneficeNet) /
        (1 + params[StatutJuridique.EURL_IR].tauxSurBeneficeNet);

      const beneficeNet = beneficeBrut - cotisations;
      const ir = calculateIR(beneficeNet, partsFiscales);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.fraisFixes = fraisFixes;

      netDisponible = beneficeNet - ir;
      break;
    }

    case StatutJuridique.EURL_IS: {
      const fraisFixes = params[StatutJuridique.EURL_IS].fraisFixesAnnuels;
      const disponible = safeCa - chargesDeductibles - fraisFixes;

      const enveloppeRemuneration = disponible * 0.6;

      const cotisations =
        (enveloppeRemuneration *
          params[StatutJuridique.EURL_IS].tauxSurNet) /
        (1 + params[StatutJuridique.EURL_IS].tauxSurNet);

      const remunerationNette = enveloppeRemuneration - cotisations;
      const ir = calculateIR(remunerationNette, partsFiscales);

      const beneficeImposable = disponible * 0.4;
      const is = calculateIS(beneficeImposable);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.impotSurSocietes = is;
      detail.fraisFixes = fraisFixes;

      netDisponible = remunerationNette - ir;
      epargneEntreprise = beneficeImposable - is;
      break;
    }

    case StatutJuridique.SASU: {
      const fraisFixes = params[StatutJuridique.SASU].fraisFixesAnnuels;
      const disponible = safeCa - chargesDeductibles - fraisFixes;

      const enveloppeSalariale = disponible * 0.5;

      const cotisations =
        (enveloppeSalariale * params[StatutJuridique.SASU].tauxSurNet) /
        (1 + params[StatutJuridique.SASU].tauxSurNet);

      const salaireNet = enveloppeSalariale - cotisations;
      const ir = calculateIR(salaireNet, partsFiscales);

      const beneficeImposable = disponible * 0.5;
      const is = calculateIS(beneficeImposable);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.impotSurSocietes = is;
      detail.fraisFixes = fraisFixes;

      netDisponible = salaireNet - ir;
      epargneEntreprise = beneficeImposable - is;
      break;
    }

    case StatutJuridique.PORTAGE: {
      const fraisGestion =
        safeCa * params[StatutJuridique.PORTAGE].fraisGestion;

      const enveloppeBrute = safeCa - fraisGestion;
      const cotisations =
        enveloppeBrute * params[StatutJuridique.PORTAGE].tauxSurBrut;

      const salaireNet = enveloppeBrute - cotisations;
      const ir = calculateIR(salaireNet, partsFiscales);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.fraisGestion = Math.round(fraisGestion);

      netDisponible = salaireNet - ir;
      break;
    }

    case StatutJuridique.CAE: {
      const fraisGestion = safeCa * params[StatutJuridique.CAE].fraisGestion;
      const enveloppeBrute = safeCa - fraisGestion;

      const cotisations =
        enveloppeBrute * params[StatutJuridique.CAE].tauxSurBrut;

      const salaireNet = enveloppeBrute - cotisations;
      const ir = calculateIR(salaireNet, partsFiscales);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.fraisGestion = Math.round(fraisGestion);

      netDisponible = salaireNet - ir;
      break;
    }

    case StatutJuridique.EI_REEL: {
      const fraisFixes = params[StatutJuridique.EI_REEL].fraisFixesAnnuels;
      const beneficeBrut = safeCa - chargesDeductibles - fraisFixes;

      const cotisations =
        (beneficeBrut *
          params[StatutJuridique.EI_REEL].tauxSurBeneficeNet) /
        (1 + params[StatutJuridique.EI_REEL].tauxSurBeneficeNet);

      const beneficeNet = beneficeBrut - cotisations;
      const ir = calculateIR(beneficeNet, partsFiscales);

      detail.cotisationsSociales = Math.round(cotisations);
      detail.impotSurRevenu = ir;
      detail.fraisFixes = fraisFixes;

      netDisponible = beneficeNet - ir;
      break;
    }

    default:
      throw new Error(`Statut non reconnu : ${statut}`);
  }

  netDisponible = Math.max(0, Math.round(netDisponible));
  epargneEntreprise = Math.max(0, Math.round(epargneEntreprise));

  const totalPreleve = safeCa - netDisponible - epargneEntreprise;
  const tauxPrelevementGlobal =
    safeCa > 0 ? totalPreleve / safeCa : 0;

  return {
    statut,
    ca: safeCa,
    netDisponible,
    epargneEntreprise,
    tauxPrelevementGlobal,
    detailCalcul: detail,
  };
}