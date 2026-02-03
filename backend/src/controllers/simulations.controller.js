import pool from "../db/index.js";

export const createSimulation = async (req, res) => {
  try {
    const { metier, tjm } = req.body;

    const result = await pool.query(
      "INSERT INTO simulations (metier, tjm) VALUES ($1, $2) RETURNING *",
      [metier, tjm]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
