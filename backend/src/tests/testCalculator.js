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
