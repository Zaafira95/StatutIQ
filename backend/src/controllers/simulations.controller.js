import pool from "../db/index.js";
import { generateClaudeSimulation } from "../services/ia.service.js";



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
    const result = await generateClaudeSimulation(req.body);

    res.json(result);

  } catch (err) {
    console.error("🔥 ERREUR IA :", err);
    res.status(500).json({
      error: "Erreur génération IA",
      details: err.message
    });
  }
}
