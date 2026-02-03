const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./src/db/db"); // connexion PostgreSQL

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test route simple
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Backend StatuIQ fonctionne ! PostgreSQL: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur connexion à la DB");
  }
});

// AJOUTER ROUTE USERS
app.post("/users", async (req, res) => {
  try {
    const { email, source } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (email, source) VALUES ($1, $2) RETURNING *",
      [email, source]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err); // <-- affiche toute l’erreur dans le terminal
    res.status(500).send(err.message); // <-- renvoie le message exact à Postman
  }
});

app.post("/simulations", async (req, res) => {
  try {
    // 1️⃣ Récupérer les données du profil freelance
    const {
      user_id,
      metier,
      tjm,
      jours_facturables,
      statut_actuel,
      objectif_principal,
      appetence_risque,
      situation_familiale
    } = req.body;

    // 2️⃣ Générer une simulation "mock" (exemple)
    const statut_recommande = "SASU";
    const score_global = 90;
    const gain_net_annuel = tjm * jours_facturables * 0.85; // juste un exemple
    const comparatif_statuts = [
      {
        statut: "SASU",
        remuneration_nette_annuelle: gain_net_annuel,
        charges_pourcentage: 32,
        risque_juridique: "Faible",
        complexite_admin: "Moyenne",
        score: 90,
        detail_calcul: {}
      },
      {
        statut: "EURL",
        remuneration_nette_annuelle: gain_net_annuel * 0.9,
        charges_pourcentage: 35,
        risque_juridique: "Moyen",
        complexite_admin: "Moyenne",
        score: 82,
        detail_calcul: {}
      }
    ];
    const explications_ia = "Simulation mock pour test.";

    // 3️⃣ Sauvegarder dans PostgreSQL
    const newSimulation = await pool.query(
      `INSERT INTO simulations (
        user_id, metier, tjm, jours_facturables, statut_actuel,
        objectif_principal, appetence_risque, situation_familiale,
        statut_recommande, score_global, gain_net_annuel,
        comparatif_statuts, explications_ia, ai_model_version, calcul_duration_ms
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'mock',123) RETURNING *`,
      [
        user_id, metier, tjm, jours_facturables, statut_actuel,
        objectif_principal, appetence_risque, situation_familiale,
        statut_recommande, score_global, gain_net_annuel,
        JSON.stringify(comparatif_statuts), explications_ia
      ]
    );

    // 4️⃣ Retourner le JSON de simulation
    res.json(newSimulation.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// --- ROUTE POST SIMULATIONS ---
app.post("/simulations", async (req, res) => {
  try {
    const {
      metier,
      tjm,
      jours_facturables,
      statut_actuel,
      objectif_principal
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO simulations
      (user_id, metier, tjm, jours_facturables, statut_actuel, objectif_principal)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        "00000000-0000-0000-0000-000000000001", // UUID TEST
        metier,
        tjm,
        jours_facturables,
        statut_actuel,
        objectif_principal
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur création simulation" });
  }
});


app.listen(PORT, () => console.log(`Serveur backend démarré sur le port ${PORT}`));
