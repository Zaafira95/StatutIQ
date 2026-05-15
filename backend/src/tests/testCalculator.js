import {
  calculateCA,
  calculateQuotientFamilial,
  estimateTMI,
  simulateStatut,
} from "../calculators/calculator.js";

import { StatutJuridique } from "../calculators/scoring.js";

const ca = calculateCA(600, 220);
const parts = calculateQuotientFamilial("Marié", ["6-10 ans", "11-17 ans"]);
const tmi = estimateTMI(ca, parts);

console.log("CA :", ca);
console.log("Parts fiscales :", parts);
console.log("TMI :", tmi);

console.log("SASU :", simulateStatut(ca, StatutJuridique.SASU, parts));
console.log("EURL IR :", simulateStatut(ca, StatutJuridique.EURL_IR, parts));
console.log("Portage :", simulateStatut(ca, StatutJuridique.PORTAGE, parts));