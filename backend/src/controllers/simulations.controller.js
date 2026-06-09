import pool from "../db/index.js";
import { generateClaudeSimulation } from "../services/ia.service.js";
import { generateSimulationPdfFile } from "../services/pdf.service.js";

async function insertSimulation(data) {
  const {
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
  } = data;

  const safeCa =
    ca_previsionnel === "" || ca_previsionnel == null
      ? Number(tjm) * Number(jours_facturables)
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
      experience_freelance || null,
      tjm ? Number(tjm) : null,
      jours_facturables ? Number(jours_facturables) : null,
      type_mission || null,
      safeCa,
      statut_actuel || null,
      safeRemu,
      safeCharges,
      JSON.stringify(objectif_principal || {}),
      appetence_risque || null,
      horizon_temporel || null,
      JSON.stringify(situation_familiale || {}),
      projets_patrimoniaux || null,
      safeAutresRevenus
    ]
  );

  return result.rows[0];
}

export async function createSimulation(req, res) {
  try {
    const simulation = await insertSimulation(req.body);
    res.json(simulation);
  } catch (err) {
    console.error("🔥 ERREUR CREATE SIMULATION :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

function validateSimulation(body) {
  const errors = [];

  if (!body.metier?.trim()) {
    errors.push("Métier obligatoire");
  }

  if (!body.tjm || Number(body.tjm) <= 0) {
    errors.push("TJM invalide");
  }

  if (!body.jours_facturables || Number(body.jours_facturables) <= 0) {
    errors.push("Nombre de jours invalide");
  }

  return errors;
}

export async function generateIASimulation(req, res) {
  try {
    const errors = validateSimulation(req.body);

    if (errors.length) {
      return res.status(400).json({
        error: "Validation",
        details: errors,
      });
    }

    const tjm = Number(req.body.tjm);
    const jours = Number(req.body.jours_facturables);

    if (!tjm || tjm <= 0 || tjm > 10000) {
      return res.status(400).json({
        error: "TJM invalide"
      });
    }

    if (!jours || jours <= 0 || jours > 365) {
      return res.status(400).json({
        error: "Nombre de jours invalide"
      });
    }
    // 1. Enregistrer la simulation en BDD
    const savedSimulation = await insertSimulation(req.body);

    // 2. Générer les résultats IA / moteur interne
    const result = await generateClaudeSimulation(req.body);

    // 3. Générer le PDF physique
    const pdf = await generateSimulationPdfFile(result, savedSimulation.id);

    // 4. Enregistrer l'URL du PDF en BDD
    await pool.query(
      `
      UPDATE simulations
      SET
        pdf_url = $1,
        resultat_ia = $2
      WHERE id = $3
      `,
      [
        pdf.publicUrl,
        JSON.stringify(result),
        savedSimulation.id
      ]
    );

    // 5. Renvoyer les résultats au frontend
    res.json({
      ...result,
      pdf_url: pdf.publicUrl,
      simulation_id: savedSimulation.id,
    });

  } catch (err) {
    console.error("🔥 ERREUR IA :", err);

    res.status(500).json({
      error: "Erreur génération IA",
      details: err.message,
    });
  }
}