import pool from "../db/index.js";

export async function createSimulation(req, res) {
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

    // Requête simple pour insérer toutes les colonnes dans le formulaire
    const result = await pool.query(
      `INSERT INTO simulations 
      (metier, tjm, jours_facturables, ca_previsionnel, statut_actuel, objectif_principal, appetence_risque, situation_familiale, projets_patrimoniaux)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
      RETURNING *`,
      [
        metier,
        tjm,
        jours_facturables,
        ca_previsionnel,
        statut_actuel,
        objectif_principal,
        appetence_risque,
        JSON.stringify(situation_familiale), // convertit l'objet JS en JSONB pour PostgreSQL
        projets_patrimoniaux
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}