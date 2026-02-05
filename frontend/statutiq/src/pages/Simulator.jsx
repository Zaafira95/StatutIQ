import { useState } from "react";
import { createSimulation } from "../services/api";


export default function Simulator() {
  
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const totalSteps = 4;

  const requiredFieldsByStep = {
    1: ["metier", "experience_freelance", "tjm", "jours_facturables", "type_mission"],
    2: ["statut_juridique"],
    3: ["objectif_principal", "appetence_risque", "horizon_temporel"],
    4: ["situation_familiale"]
  };

  const validateStep = () => {
    const requiredFields = requiredFieldsByStep[step];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        alert("Merci de remplir tous les champs requis avant de continuer.");
        return false;
      }
    }

    return true;
  };


  const [formData, setFormData] = useState({
    metier: "",
    experience_freelance: "",
    tjm: "",
    jours_facturables: "",
    type_mission: "",
    ca_previsionnel: "",
    statut_juridique: "",
    remu_nette_mensuelle: "",
    charges_sociales: "",
    objectif_principal: "",
    appetence_risque:"",
    horizon_temporel: "",
    projets_patrimoniaux: "",
    situation_familiale: "",
    autres_revenus: "",
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

  const handleNextStep = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Simulateur</h1>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Étape {step} / {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Profil professionnel</h2>

            {/* Métier */
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
            }

            {/* Expérience */
            <div>
              <label>Expérience freelance :</label>
              <select
                name="experience_freelance"
                value={formData.experience_freelance}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Junior">Junior &lt; 2 ans</option>
                <option value="Confirmé">Confirmé 2-5 ans</option>
                <option value="Expert">Expert &gt; 5 ans</option>
              </select>
            </div>
            }

            {/* TJM */
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
            }

            {/* Jours facturables */
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
            }

            {/* Type de mission */
            <div>
              <label>Type de mission :</label>
              <select
                name="type_mission"
                value={formData.type_mission}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Récurrentes">Récurrentes</option>
                <option value="Ponctuelles">Ponctuelles</option>
                <option value="Mix">Mix</option>
              </select>
            </div>
            }

            {/* CA prévisionnel */
            <div>
              <label>CA prévisionnel :</label>
              <input
                type="number"
                name="ca_previsionnel"
                value={formData.ca_previsionnel}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            }
          </>
        )}
        
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Situation actuelle</h2>

            {/* Statut juridique */
            <div>
              <label>Statut juridique actuel :</label>
              <select
                name="statut_juridique"
                value={formData.statut_juridique}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="LLP UK">LLP UK</option>
                <option value="Portage">Portage</option>
                <option value="EURL">EURL</option>
                <option value="SASU">SASU</option>
                <option value="Autre">Autre</option>
                <option value="Aucun">Aucun</option>
              </select>
            </div>
            }

            {/* Rémunération nette */
            <div>
              <label>Rémunération nette mensuelle actuelle (€) :</label>
              <input
                type="number"
                name="remu_nette_mensuelle"
                value={formData.remu_nette_mensuelle}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            }

            {/* Charges */
            <div>
              <label>Charges sociales/fiscales actuelles (si connues) :</label>
              <input
                type="number"
                name="charges_sociales"
                value={formData.charges_sociales}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            }
          </>
        )}
        
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold">Objectifs & contraintes</h2>

            {/* Objectif */
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
            }

            {/* Appétence risque */
            <div>
              <label>Appétence risque principal :</label>
              <select
                name="appetence_risque"
                value={formData.appetence_risque}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Faible">Faible</option>
                <option value="Modérée">Modérée</option>
                <option value="Élevée">Élevée</option>
              </select>
            </div>
            }

            {/* Horizon */
            <div>
              <label>Horizon temporel  :</label> 
              <select
                name="horizon_temporel"
                value={formData.horizon_temporel}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Court terme">Court terme &lt; 1 an</option>
                <option value="Moyen terme">Moyen terme 1-3 ans</option>
                <option value="Long terme">Long terme &gt; 3 ans</option>
              </select>
            </div>
            }

            {/* Projets patrimoniaux */
            <div>
              <label>Projets patrimoniaux :</label>
              <select
                name="projets_patrimoniaux"
                value={formData.projets_patrimoniaux}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Achat immobilier prévu">Achat immobilier prévu</option>
                <option value="Création entreprise">Création entreprise</option>
                <option value="Retraite">Retraite</option>
                <option value="Aucun">Aucun</option>
              </select>
            </div>
            }

          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold">Situation personnelle</h2>

            {/* Situation familiale */
            <div>
              <label>Situation familiale :</label>
              <select
                name="situation_familiale"
                value={formData.situation_familiale}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
                <option value="Pacsé">Pacsé</option>
                <option value="Enfants à charge">Enfants à charge</option>
              </select>
            </div>
            }

            {/* Autres revenus */
            <div>
              <label>Autres revenus du foyer (oui/non + montant estimé) :</label>
              <input
                type="number"
                name="autres_revenus"
                value={formData.autres_revenus}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            }
          </>
        )}

        
        <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border rounded"
              >
                Précédent
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Faire ma simulation
              </button>
            )}
          </div>
      </form>
    </div>
  );
}
