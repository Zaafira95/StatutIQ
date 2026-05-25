import dotenv from "dotenv";
dotenv.config(); // ⬅️ DOIT ÊTRE TOUT EN HAUT
import app from "./app.js";

const PORT = process.env.PORT || 5000;

console.log("DATABASE_URL =", process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur le port ${PORT}`);
});
