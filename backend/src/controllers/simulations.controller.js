import pool from "../db/index.js";

export async function createSimulation(req, res) {
  try {
    const {
      metier,
      experience_freelance,
      tjm,
      jours_facturables,
      type_mission,
      ca_previsionnel,
      statut_juridique,
      remu_nette_mensuelle,
      charges_sociales,
      objectif_principal,
      appetence_risque,
      horizon_temporel,
      projets_patrimoniaux,
      situation_familiale,
      autres_revenus
    } = req.body;

    // Requête simple pour insérer toutes les colonnes dans le formulaire
    const result = await pool.query(
      `INSERT INTO simulations 
      (metier, tjm, jours_facturables, ca_previsionnel, statut_juridique, objectif_principal, appetence_risque, situation_familiale, projets_patrimoniaux)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
      RETURNING *`,
      [
        metier,
        tjm,
        jours_facturables,
        ca_previsionnel,
        statut_juridique,
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