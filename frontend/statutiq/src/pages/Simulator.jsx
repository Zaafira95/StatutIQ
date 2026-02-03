import { useState } from "react";
import { createSimulation } from "../services/api";

export default function Simulator() {
  const [formData, setFormData] = useState({
    metier: "",
    tjm: "",
    jours_facturables: "",
    statut_actuel: "",
    objectif_principal: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSimulation(formData);
      setMessage("Simulation envoyée ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Simulateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Métier :</label>
          <input
            type="text"
            name="metier"
            value={formData.metier}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>TJM (€) :</label>
          <input
            type="number"
            name="tjm"
            value={formData.tjm}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Jours facturables/an :</label>
          <input
            type="number"
            name="jours_facturables"
            value={formData.jours_facturables}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Statut actuel :</label>
          <select
            name="statut_actuel"
            value={formData.statut_actuel}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Sélectionner</option>
            <option value="Micro-entreprise">Micro-entreprise</option>
            <option value="EURL">EURL</option>
            <option value="SASU">SASU</option>
            <option value="Portage">Portage</option>
          </select>
        </div>

        <div>
          <label>Objectif principal :</label>
          <select
            name="objectif_principal"
            value={formData.objectif_principal}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Sélectionner</option>
            <option value="Optimiser fiscalité">Optimiser fiscalité</option>
            <option value="Augmenter net">Augmenter net</option>
            <option value="Sécuriser">Sécuriser</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
