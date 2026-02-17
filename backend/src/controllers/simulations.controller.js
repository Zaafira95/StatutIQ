import pool from "../db/index.js";

import { callClaude } from "../services/claude.js";


export async function createSimulation(req, res) {
  try {
    const {
      metier,
      experience_freelance,
      tjm,
      jours_facturables,
      type_mission,
      ca_previsionnel, // 👈 AJOUT
      statut_actuel,
      remu_nette_mensuelle,
      charges_sociales,
      objectif_principal,
      appetence_risque,
      horizon_temporel,
      situation_familiale,
      projets_patrimoniaux,
      autres_revenus
    } = req.body;

    const safeCa =
      ca_previsionnel === "" || ca_previsionnel == null
        ? null
        : Number(ca_previsionnel);

    const safeRemu =
      remu_nette_mensuelle === "" || remu_nette_mensuelle == null
        ? null
        : Number(remu_nette_mensuelle);

    const safeCharges =
      charges_sociales === "" || charges_sociales == null
        ? null
        : Number(charges_sociales);

    const safeAutresRevenus =
      autres_revenus === "" || autres_revenus == null
        ? null
        : Number(autres_revenus);

    // Requête simple pour insérer toutes les colonnes dans le formulaire
    const result = await pool.query(
      `INSERT INTO simulations 
      (
        metier,
        experience_freelance,
        tjm,
        jours_facturables,
        type_mission,
        ca_previsionnel,
        statut_actuel,
        remu_nette_mensuelle,
        charges_sociales,
        objectif_principal,
        appetence_risque,
        horizon_temporel,
        situation_familiale,
        projets_patrimoniaux,
        autres_revenus
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13::jsonb,$14,$15)
      RETURNING *`,
      [
        metier,
        experience_freelance,
        tjm,
        jours_facturables,
        type_mission,
        safeCa, // 👈 AJOUT
        statut_actuel,
        safeRemu,
        safeCharges,
        JSON.stringify(objectif_principal),
        appetence_risque,
        horizon_temporel,
        JSON.stringify(situation_familiale),
        projets_patrimoniaux,
        safeAutresRevenus
      ]
    );


    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}


export async function generateIASimulation(req, res) {
  try {
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
    } = req.body;

    const SYSTEM_PROMPT = `
Tu es un expert-comptable et fiscaliste français spécialisé dans l'optimisation 
fiscale pour freelances. Tu dois analyser le profil suivant et recommander 
le statut juridique optimal.

RÈGLES STRICTES :
1. Calculs conformes législation française 2025
2. Prise en compte circulaire LLP UK septembre 2025
3. Recommandations basées sur scoring multi-critères pondéré
4. Explications claires niveau freelance (pas jargon)
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
`;

    const USER_PROMPT = `
PROFIL FREELANCE :
- Métier : ${metier}
- TJM : ${tjm}€
- Jours facturables/an : ${jours_facturables}
- CA prévisionnel : ${ca_previsionnel}€
- Statut actuel : ${statut_actuel}
- Objectifs :
  - Objectifs principaux : ${objectif_principal.principaux?.join(", ")}
  - Autre objectif : ${objectif_principal.autre || "Aucun"}
- Appétence risque : ${appetence_risque}
- Situation familiale :
  - Statut : ${situation_familiale.statut}
  - Enfants à charge : ${situation_familiale.enfants_a_charge ? "Oui" : "Non"}
  - Détail enfants : ${situation_familiale.enfants?.join(", ") || "Aucun"}
- Projets patrimoniaux : ${projets_patrimoniaux}

TÂCHES :
1. Calculer rémunération nette pour chaque statut
2. Détailler charges sociales/fiscales
3. Évaluer risques juridiques
4. Scorer selon critères pondérés
5. Recommander statut optimal avec justification détaillée
6. Générer explications pédagogiques pour chaque choix

FORMAT RÉPONSE : JSON structuré
`;

    const iaResponse = await callClaude(SYSTEM_PROMPT, USER_PROMPT);

    res.json({
      message: "Simulation IA générée",
      iaResponse: JSON.parse(iaResponse) // on parse le JSON renvoyé par Claude
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
