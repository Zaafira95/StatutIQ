import pool from "../db/index.js";

export const getAdminData = async (req, res) => {
  try {

    const simulations = await pool.query(`
      SELECT *
      FROM simulations
      ORDER BY created_at DESC
    `);

    const leads = await pool.query(`
      SELECT *
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