import { generateRecommendations } from "../calculators/engine.js";

const result = generateRecommendations({
  tjm: 600,
  jours_facturables: 220,
  objectifs: [
    "Optimisation fiscale",
    "Maximiser la rémunération nette",
    "Développer un patrimoine immobilier",
  ],
  appetenceRisque: "Modérée",
  projets_patrimoniaux: "Investissement locatif",
  situationFamiliale: "Marié",
  enfants: ["6-10 ans", "11-17 ans"],
});

console.log(JSON.stringify(result, null, 2));