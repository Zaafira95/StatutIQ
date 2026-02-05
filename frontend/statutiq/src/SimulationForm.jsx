import { useState } from "react";

export default function SimulationForm() {
  const [formData, setFormData] = useState({
    metier: "",
    tjm: "",
    jours_facturables: "",
    statut_juridique: "",
    objectif_principal: "",
    appetence_risque: "",
    situation_familiale: "",
  });

  // Gestion du changement de valeur
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
    // Envoi les données au backend
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Simulation Statut Freelance
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Métier */}
        <div>
          <label className="block font-medium mb-1">Métier</label>
          <input
            type="text"
            name="metier"
            value={formData.metier}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Développeur freelance"
            required
          />
        </div>

        {/* TJM */}
        <div>
          <label className="block font-medium mb-1">TJM (€)</label>
          <input
            type="number"
            name="tjm"
            value={formData.tjm}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 400"
            required
          />
        </div>

        {/* Jours facturables */}
        <div>
          <label className="block font-medium mb-1">Jours facturables/an</label>
          <input
            type="number"
            name="jours_facturables"
            value={formData.jours_facturables}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 200"
            required
          />
        </div>

        {/* Statut actuel */}
        <div>
          <label className="block font-medium mb-1">Statut actuel</label>
          <select
            name="statut_juridique"
            value={formData.statut_juridique}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez votre statut</option>
            <option value="Micro-entreprise">Micro-entreprise</option>
            <option value="EURL">EURL</option>
            <option value="SASU">SASU</option>
            <option value="Portage salarial">Portage salarial</option>
            <option value="LLP UK">LLP UK</option>
          </select>
        </div>

        {/* Objectif principal */}
        <div>
          <label className="block font-medium mb-1">Objectif principal</label>
          <select
            name="objectif_principal"
            value={formData.objectif_principal}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un objectif</option>
            <option value="Optimiser fiscalité">Optimiser fiscalité</option>
            <option value="Augmenter net">Augmenter net</option>
            <option value="Sécuriser">Sécuriser</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Appétence au risque */}
        <div>
          <label className="block font-medium mb-1">Appétence au risque</label>
          <select
            name="appetence_risque"
            value={formData.appetence_risque}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez</option>
            <option value="Faible">Faible</option>
            <option value="Modérée">Modérée</option>
            <option value="Élevée">Élevée</option>
          </select>
        </div>

        {/* Situation familiale */}
        <div>
          <label className="block font-medium mb-1">Situation familiale</label>
          <select
            name="situation_familiale"
            value={formData.situation_familiale}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez</option>
            <option value="célibataire">Célibataire</option>
            <option value="marié/pacsé">Marié / Pacsé</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Bouton */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Lancer la simulation
          </button>
        </div>
      </form>
    </div>
  );
}
