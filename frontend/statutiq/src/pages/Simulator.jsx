import { useState } from "react";
import { createSimulation } from "../services/api";
import { useNavigate } from "react-router-dom";
import { metiersIT } from "./metierIT";
import TooltipLabel from "../components/TooltipLabel";


export default function Simulator() {
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const totalSteps = 4;

  const requiredFieldsByStep = {
    1: ["metier", "experience_freelance", "tjm", "jours_facturables", "type_mission"],
    2: ["statut_actuel", "remu_nette_mensuelle"],
    3: ["objectif_principal", "appetence_risque", "horizon_temporel"],
    4: ["situation_familiale"]
  };

  const validateStep = () => {
    const requiredFields = requiredFieldsByStep[step];
    let newErrors = {};

    for (let field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = true;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const [error, setError] = useState("");

  const [errors, setErrors] = useState("");

  const [formData, setFormData] = useState({
    metier: "",
    experience_freelance: "",
    tjm: "",
    jours_facturables: "",
    type_mission: "",
    ca_previsionnel: "",
    statut_actuel: "",
    remu_nette_mensuelle: "",
    charges_sociales: "",
    objectif_principal: [],
    objectif_autre: "",
    appetence_risque:"",
    horizon_temporel: "",
    projets_patrimoniaux: "",
    situation_familiale: "",
    enfants_a_charge: false,
    enfants: [], // tableau des tranches d’âge
    autres_revenus: "",
  });

  const ageOptions = [
    "0-5 ans",
    "6-10 ans",
    "11-17 ans",
    "18-25 ans"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, metier: e.target.value });
    setShowSuggestions(true); // on affiche les suggestions dès que l'utilisateur tape
  };

  const handleSelectSuggestion = (metier) => {
    setFormData({ ...formData, metier });
    setShowSuggestions(false); // on cache les suggestions après sélection
  };

  const filteredMetiers = metiersIT.filter((m) =>
    m.toLowerCase().includes(formData.metier.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

          // 🎯 Regroupement situation familiale
      const situationFamilialePayload = {
        statut: formData.situation_familiale,
        enfants_a_charge: formData.enfants_a_charge,
        enfants: formData.enfants
      };

      // 🎯 Regroupement objectifs
      const objectifsPayload = {
        principaux: formData.objectif_principal,
        autre: formData.objectif_autre
      };

      const ca_previsionnel = formData.jours_facturables * formData.tjm;
      console.log(import.meta.env.VITE_API_URL);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/simulations/ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metier: formData.metier,
          tjm: formData.tjm,
          jours_facturables: formData.jours_facturables,
          ca_previsionnel: ca_previsionnel,
          statut_actuel: formData.statut_actuel,
          objectif_principal: objectifsPayload,
          appetence_risque: formData.appetence_risque,
          situation_familiale: situationFamilialePayload,
          projets_patrimoniaux: formData.projets_patrimoniaux
        })
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("❌ Erreur backend :", err);
        throw new Error(err.error || "Erreur API");
      }

      const iaResult = await response.json();
      console.log("✅ Résultat IA :", iaResult);

      localStorage.setItem(
        "resultatsSimulation",
        JSON.stringify(iaResult)
      );
      console.log("🔜 Navigation vers /resultat");
      navigate("/resultat");
    } catch (err) {
      console.error("Une erreur est survenue lors de la génération de la simulation.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prev) => {
      const updatedValues = checked
        ? [...prev[name], value]
        : prev[name].filter((v) => v !== value);

      return {
        ...prev,
        [name]: updatedValues,
      };
    });
  };

  const handleNextStep = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const [query, setQuery] = useState("");
  const filtered = metiersIT.filter((m) =>
    m.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Simulateur</h1>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-textSecondary-500 mb-2">
          <span>Étape {step} / {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Profil professionnel</h2>



            <div className="relative w-full">
              <label>Métier <span className="text-red-600">*</span></label>
              <input
                type="text"
                id="metier"
                name="metier"
                value={formData.metier}
                onChange={(e) => {
                  handleInputChange(e);
                  if (errors.metier) {
                    setErrors((prev) => ({ ...prev, metier: false }));
                  }
                }}
                onFocus={() => formData.metier && setShowSuggestions(true)} // affiche si déjà du texte
                autoComplete="off"
                placeholder="Commencez à taper..."
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              />

              {errors.metier && (
                <p className="text-red-500 text-xs mt-1">
                  Champ requis
                </p>
              )}

              {showSuggestions && filteredMetiers.length > 0 && (
                <ul className="absolute z-10 w-full bg-background border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredMetiers.map((m, i) => (
                    <li
                      key={i}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectSuggestion(m)}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Expérience */
            <div>
              <label>Expérience freelance <span className="text-red-600">*</span></label>
              <select
                name="experience_freelance"
                value={formData.experience_freelance}
                onChange={(e) => {
                    handleChange(e);

                    if (errors.experience_freelance) {
                      setErrors((prev) => ({ ...prev, experience_freelance: false }));
                    }
                  }}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              >
                <option className="bg-background" value="">Sélectionner</option>
                <option className="bg-background" value="Junior">Junior &lt; 2 ans</option>
                <option className="bg-background" value="Confirmé">Confirmé 2-5 ans</option>
                <option className="bg-background" value="Expert">Expert &gt; 5 ans</option>
              </select>

                {errors.experience_freelance && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* TJM & Jours facturables */
            <div className="flex gap-4">
              <div>
                <label>TJM (€) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  name="tjm"
                  value={formData.tjm}
                  onChange={(e) => {
                    handleChange(e);

                    if (errors.tjm) {
                      setErrors((prev) => ({ ...prev, tjm: false }));
                    }
                  }}
                  className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />

                {errors.metier && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
              </div>
              <div>
                <label>Jours facturables/an <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  name="jours_facturables"
                  value={formData.jours_facturables}
                  onChange={(e) => {
                    handleChange(e);

                    if (errors.jours_facturables) {
                      setErrors((prev) => ({ ...prev, jours_facturables: false }));
                    }
                  }}
                  className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                  min="1" max="220"
                />

                {errors.jours_facturables && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
              </div>
            </div>
            }

            {/* Type de mission */
            <div>
              <label className="font-medium block mb-2">Type de mission <span className="text-red-600">*</span></label>

              <div className="flex gap-4 py-2">
                {["Récurrentes", "Ponctuelles", "Mix"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer text-textPrimary">
                    <input
                      type="radio"
                      name="type_mission"
                      value={option}
                      checked={formData.type_mission === option}
                      onChange={(e) => {
                        handleChange(e);

                        if (errors.type_mission) {
                          setErrors((prev) => ({ ...prev, type_mission: false }));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>

                {errors.type_mission && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }


          </>
        )}
        
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Situation actuelle</h2>

            {/* Statut juridique */
            <div>
              <label>Statut juridique actuel <span className="text-red-600">*</span></label>
              <div className="grid grid-cols-2 gap-3 py-3">
                {["LLP UK", "EURL", "SASU", "Portage", "Autre", "Aucun"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer text-textPrimary">
                    <input
                      type="radio"
                      name="statut_actuel"
                      value={option}
                      checked={formData.statut_actuel === option}
                      onChange={(e) => {
                        handleChange(e);

                        if (errors.statut_actuel) {
                          setErrors((prev) => ({ ...prev, statut_actuel: false }));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>

                {errors.statut_actuel && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* Rémunération nette */
            <div>
              <label>Rémunération nette mensuelle actuelle (€) <span className="text-red-600">*</span></label>
              <input
                type="number"
                name="remu_nette_mensuelle"
                value={formData.remu_nette_mensuelle}
                onChange={(e) => {
                    handleChange(e);

                    if (errors.remu_nette_mensuelle) {
                      setErrors((prev) => ({ ...prev, remu_nette_mensuelle: false }));
                    }
                  }}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              />

                {errors.remu_nette_mensuelle && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* Charges */
            <div>
              <label>Charges sociales/fiscales actuelles</label>
              <input
                type="number"
                name="charges_sociales"
                value={formData.charges_sociales}
                onChange={handleChange}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
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
              <label>Objectif principal <span className="text-red-600">*</span></label>
              <div className="grid grid-cols-2 gap-2 py-3">
                {[
                  "Optimisation fiscale",
                  "Maximiser la rémunération nette",
                  "Sécuriser le patrimoine personnel",
                  "Préparer la retraite",
                  "Développer un patrimoine immobilier",
                  "Transmission / succession",
                  "Flexibilité future",
                  "Protection sociale renforcée",
                  "Autre",
                ].map((option) => (
                  <label key={option} className="flex items-baseline gap-2 cursor-pointer text-textPrimary">
                    <input
                      type="checkbox"
                      name="objectif_principal"
                      value={option}
                      checked={formData.objectif_principal.includes(option)}
                      onChange={(e) => {
                        handleCheckboxChange(e);

                        if (errors.objectif_principal) {
                          setErrors((prev) => ({ ...prev, objectif_principal: false }));
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>

                {errors.objectif_principal && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}

              {/* Champ "Autre" dynamique */}
              {formData.objectif_principal.includes("Autre") && (
                <input
                  type="text"
                  name="objectif_autre"
                  placeholder="Précisez votre objectif..."
                  value={formData.objectif_autre}
                  onChange={handleChange}
                  className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />
              )}

            </div>
            }

            {/* Appétence risque */
            <div>
                <TooltipLabel
                  label="Appétence au risque"
                  required
                  tooltip="Indique votre niveau de tolérance au risque financier et juridique dans le choix de votre statut."
                />
              <select
                name="appetence_risque"
                value={formData.appetence_risque}
                onChange={(e) => {
                    handleChange(e);

                    if (errors.appetence_risque) {
                      setErrors((prev) => ({ ...prev, appetence_risque: false }));
                    }
                  }}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              >
                <option class="bg-background" value="">Sélectionner</option>
                <option class="bg-background" value="Faible">Faible</option>
                <option class="bg-background" value="Modérée">Modérée</option>
                <option class="bg-background" value="Élevée">Élevée</option>
              </select>

                {errors.appetence_risque && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* Horizon */
            <div>
                <TooltipLabel
                  label="Horizon temporel"
                  required
                  tooltip="Durée pendant laquelle vous envisagez de conserver votre statut avant un éventuel changement ou une évolution."
                />
              <div className="flex flex-col gap-2 py-3">
                {[
                  { label: "Court terme < 1 an", value: "Court terme" },
                  { label: "Moyen terme 1–3 ans", value: "Moyen terme" },
                  { label: "Long terme > 3 ans", value: "Long terme" },
                ].map(({ label, value }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer text-textPrimary">
                    <input
                      type="radio"
                      name="horizon_temporel"
                      value={value}
                      checked={formData.horizon_temporel === value}
                      onChange={(e) => {
                        handleChange(e);

                        if (errors.horizon_temporel) {
                          setErrors((prev) => ({ ...prev, horizon_temporel: false }));
                        }
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>

                {errors.horizon_temporel && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* Projets patrimoniaux */
            <div>
              <label>Projets patrimoniaux :</label>
              <select
                name="projets_patrimoniaux"
                value={formData.projets_patrimoniaux}
                onChange={handleChange}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              >
                <option class="bg-background" value="">Sélectionner</option>
                <option class="bg-background" value="Achat immobilier">Achat immobilier</option>
                <option class="bg-background" value="Création d'entreprise">Création d'entreprise</option>
                <option class="bg-background" value="Retraite">Retraite</option>
                <option class="bg-background" value="Investissement">Investissement</option>
                <option class="bg-background" value="Expatriation">Expatriation</option>
                <option class="bg-background" value="Diversification financière">Diversification financière</option>
                <option class="bg-background" value="Levée de fonds">Levée de fonds</option>
                <option class="bg-background" value="Constitution d’épargne long terme">Constitution d’épargne long terme</option>
                <option class="bg-background" value="Aucun">Aucun</option>
                <option class="bg-background" value="Autre">Autre</option>
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
              <label>Situation familiale <span className="text-red-600">*</span></label>
              <select
                name="situation_familiale"
                value={formData.situation_familiale}
                onChange={(e) => {
                    handleChange(e);

                    if (errors.situation_familiale) {
                      setErrors((prev) => ({ ...prev, situation_familiale: false }));
                    }
                  }}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              >
                <option className="bg-background" value="">Sélectionner</option>
                <option className="bg-background" value="Célibataire">Célibataire</option>
                <option className="bg-background" value="Marié">Marié(e)</option>
                <option className="bg-background" value="Pacsé">Pacsé(e)</option>
                <option className="bg-background" value="Divorcé">Divorcé(e)</option>
              </select>

                {errors.situation_familiale && (
                  <p className="text-red-500 text-xs mt-1">
                    Champ requis
                  </p>
                )}
            </div>
            }

            {/* Enfants à charge */}
            <div className="mt-4">
              <label className="font-medium">
                Enfants à charge ?
              </label>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-textPrimary">
                  <input
                    type="radio"
                    name="enfants_a_charge"
                    value="oui"
                    checked={formData.enfants_a_charge === true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        enfants_a_charge: true,
                        enfants: formData.enfants.length ? formData.enfants : [""]
                      })
                    }
                  />
                  Oui
                </label>

                <label className="flex items-center gap-2 text-textPrimary">
                  <input
                    type="radio"
                    name="enfants_a_charge"
                    value="non"
                    checked={formData.enfants_a_charge === false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        enfants_a_charge: false,
                        enfants: []
                      })
                    }
                  />
                  Non
                </label>
              </div>
            </div>

            {formData.enfants_a_charge && (
              <div className="mt-4 space-y-3">

                {formData.enfants.map((enfant, index) => (
                  <div key={index} className="flex items-center gap-3">

                    <select
                      value={enfant}
                      onChange={(e) => {
                        const updated = [...formData.enfants];
                        updated[index] = e.target.value;
                        setFormData({ ...formData, enfants: updated });
                      }}
                      className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                    >
                      <option class="bg-background" value="">Tranche d'âge enfant</option>
                      {ageOptions.map((age) => (
                        <option class="bg-background" key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>

                    {/* Bouton supprimer */}
                    {formData.enfants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.enfants.filter((_, i) => i !== index);
                          setFormData({ ...formData, enfants: updated });
                        }}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        −
                      </button>
                    )}

                    {/* Bouton ajouter (uniquement sur le dernier) */}
                    {index === formData.enfants.length - 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            enfants: [...formData.enfants, ""]
                          })
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    )}

                  </div>
                ))}

              </div>
            )}

            {/* Autres revenus */
            <div>
              <TooltipLabel
                label="Autres revenus du foyer"
                tooltip="Indiquez vos revenus complémentaires"
              />
              <input
                type="text"
                name="autres_revenus"
                value={formData.autres_revenus}
                onChange={handleChange}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
              />
            </div>
            }

            <div className="flex items-start">
              <input type="checkbox" required name="consentement" className="mr-2"/>
                <div className="text-xs">
                  En soumettant ce formulaire, vous acceptez que vos données
                  soient utilisées pour traiter votre simulation et vous
                  recontacter. <span className="text-red-600">*</span>
                </div>
                
            </div>
            

          </>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              className="btn-secondary"
            >
              Précédent
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className="btn-primary"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              
              className="btn-primary"
              disabled={loading}
            >
            {loading ? (
                <div className="flex items-center gap-3">
                  {/* Animation barres */}
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 h-2 bg-white animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-3 bg-white animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-4 bg-white animate-pulse"></span>
                  </div>

                  <span>
                    Chargement...
                  </span>
                </div>
              ) : (
                "Obtenir ma simulation"
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}