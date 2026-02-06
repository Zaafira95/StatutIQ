export default function ResultHeader() {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary">
      <h1 className="text-2xl font-bold mb-2">
        🎯 Votre statut optimal : <span className="text-primary">SASU</span>
      </h1>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-gray-500 text-sm">Gain net annuel</p>
          <p className="text-xl font-semibold text-green-600">
            +6 900 € <span className="text-sm">( +12% )</span>
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Score global</p>
          <p className="text-xl font-semibold">94 / 100 ⭐⭐⭐⭐⭐</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Comparé à votre statut actuel</p>
          <p className="font-medium">Portage salarial</p>
        </div>
      </div>
    </div>
  );
}
