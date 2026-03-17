import pool from "../db/index.js";

export const getAdminData = async (req, res) => {
  try {

    const simulations = await pool.query(`
      SELECT 
        metier,
        tjm,
        jours_facturables,
        statut_actuel,
        objectif_principal,
        appetence_risque,
        situation_familiale,
        ca_previsionnel,
        projets_patrimoniaux,
        remu_nette_mensuelle,
        charges_sociales,
        horizon_temporel,
        autres_revenus,
        experience_freelance,
        type_mission,
        created_at
      FROM simulations
      ORDER BY created_at DESC
    `);

    const leads = await pool.query(`
      SELECT 
        nom,
        prenom,
        telephone,
        email
      FROM leads
      ORDER BY created_at DESC
    `);

    res.json({
      simulations: simulations.rows,
      leads: leads.rows
    });

  } catch (err) {
    console.error("❌ Erreur admin:", err);
    res.status(500).json({ error: "Erreur récupération données admin" });
  }
};