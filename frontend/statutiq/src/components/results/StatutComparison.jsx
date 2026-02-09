const MOCK_STATUTS = [
  { statut: "SASU", net: 65400, charges: 32, risque: 5, score: 94 },
  { statut: "EURL IS", net: 63800, charges: 34, risque: 4, score: 89 },
  { statut: "Portage", net: 58500, charges: 45, risque: 5, score: 82 }
];

export default function StatutComparison() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📊 Comparaison des statuts</h2>

        <select className="border rounded px-3 py-2 text-sm">
          <option>Trier par : Rémunération nette</option>
          <option>Charges</option>
          <option>Score global</option>
          <option>Risque juridique</option>
        </select>
      </div>

      {/* Placeholder graphique */}
      {/*<div className="h-40 bg-gray-100 rounded mb-6 flex items-center justify-center text-gray-500">
        Graphique comparatif (à venir)
      </div>*/}

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
          {MOCK_STATUTS.map((s, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2 font-medium">
                {i === 0 ? "🏆 " : ""}{s.statut}
              </td>
              <td className="text-center">{s.net.toLocaleString()} €</td>
              <td className="text-center">{s.charges} %</td>
              <td className="text-center">{"⭐".repeat(s.risque)}</td>
              <td className="text-center font-semibold">{s.score}</td>
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
  );
}
