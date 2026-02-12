import db from "../db/index.js"; // 

export const createLead = async (req, res) => {
  const { nom, prenom, telephone } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const result = await db.query(
      `INSERT INTO leads (nom, prenom, telephone) VALUES ($1, $2, $3) RETURNING *`,
      [nom, prenom, telephone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur création lead :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
