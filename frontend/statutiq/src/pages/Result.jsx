import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Result() {
  const [resultats, setResultats] = useState(null);
  const location = useLocation();
  const [sortBy, setSortBy] = useState("remuneration");

  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1️⃣ Priorité : données passées via navigation
    if (location.state?.iaResult) {
      setResultats(location.state.iaResult);
      localStorage.setItem(
        "resultatsSimulation",
        JSON.stringify(location.state.iaResult)
      );
      return;
    }

    // 2️⃣ Fallback : localStorage
    const stored = localStorage.getItem("resultatsSimulation");
    if (stored) {
      setResultats(JSON.parse(stored));
    }
  }, [location.state]);

  if (!resultats) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-500">
        Analyse en cours ou résultats indisponibles…
      </div>
    );
  }
const { recommandation_principale, comparatif_statuts } = resultats;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* 🔝 HEADER */}
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary">
        <h1 className="text-2xl font-bold mb-2">
          🎯 Votre statut optimal :{" "}
          <span className="text-primary">
            {recommandation_principale.statut}
          </span>
        </h1>

        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-gray-500 text-sm">Gain net annuel</p>
            <p className="text-xl font-semibold text-green-600">
              +{recommandation_principale.gain_vs_actuel.toLocaleString()} €{" "}
              <span className="text-sm">
                ( +{recommandation_principale.gain_pourcentage}% )
              </span>
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Score global</p>
            <p className="text-xl font-semibold">
              {recommandation_principale.score_global} / 100 ⭐⭐⭐⭐⭐
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Justification</p>
            <p className="text-sm text-gray-700">
              {recommandation_principale.justification}
            </p>
          </div>
        </div>
      </div>

      {/* 📊 TABLEAU COMPARATIF */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📊 Comparaison des statuts</h2>

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                >
                <option value="remuneration">Rémunération nette</option>
                <option value="charges">Charges</option>
                <option value="score">Score global</option>
            </select>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Statut</th>
              <th>Rém. nette</th>
              <th>Charges</th>
              <th>Risque</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {comparatif_statuts.map((s, i) => (
              <tr key={i} className={`border-b hover:bg-gray-50 ${i < 3 ? "font-semibold" : ""}`}>
                <td className="py-2">
                  {i === 0 ? "🏆 " : ""}
                  {s.statut}
                </td>
                <td className="text-center">
                  {s.remuneration_nette_annuelle.toLocaleString()} €
                </td>
                <td className="text-center">{s.charges_pourcentage} %</td>
                <td className="text-center">{s.risque_juridique}</td>
                <td className="text-center">{s.score}</td>
                <td className="text-right">
                  <button className="text-primary text-sm hover:underline">
                    Détails ▼
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🎯 CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button className="border px-5 py-3 rounded hover:bg-gray-50">
          Télécharger le rapport PDF
        </button>

        <button className="bg-primary text-white px-6 py-3 rounded hover:opacity-90">
          Prendre RDV avec un expert
        </button>
      </div>
    </div>
  );
}
