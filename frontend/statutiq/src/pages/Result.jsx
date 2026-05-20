import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

export default function Result() {
  const [resultats, setResultats] = useState(null);
  const location = useLocation();
  const [sortBy, setSortBy] = useState("remuneration");

  const [showModal, setShowModal] = useState(false);

  const [leadData, setLeadData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: ""
  });

  const titresExplications = {
    choix_statut: "Pourquoi ce statut est recommandé",
    optimisation_rem: "Optimisation de la rémunération",
    fiscalite_detaillee: "Analyse fiscale détaillée",
    demarches: "Démarches administratives"
    };

  const [loading, setLoading] = useState(false);

  const [openStatutIndex, setOpenStatutIndex] = useState(null);

  const toggleStatutRow = (index) => {
    setOpenStatutIndex(openStatutIndex === index ? null : index);
  };

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

  const safeData = comparatif_statuts || [];
  console.log("Premier statut côté front :", safeData[0]);

  const sortedStatuts = [...safeData].sort((a, b) => {
    switch (sortBy) {
        case "remuneration":
        return b.remuneration_nette_annuelle - a.remuneration_nette_annuelle;

        case "charges":
        return a.charges_pourcentage - b.charges_pourcentage;

        case "score":
        return b.score - a.score;

        default:
        return 0;
    }
    });

    const chartData = sortedStatuts.map((s) => ({
        statut: s.statut,
        remuneration: s.remuneration_nette_annuelle,
        risque: s.risque_juridique,
    }));

    const getRiskColor = (risque) => {
        switch (risque?.toLowerCase()) {
            case "faible":
            return "#22C55E"; // vert
            case "modéré":
            case "moyen":
            return "#F59E0B"; // orange
            case "élevé":
            case "elevé":
            return "#dc2626"; // rouge
            default:
            return "#3b82f6"; // bleu fallback
        }
    };

    const downloadPDF = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/generate`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(resultats),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rapport-simulation.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
    };


    const handleLeadAndDownload = async () => {
    try {
        // 1️⃣ Enregistrer le lead
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
        });

        const data = await response.json();
        console.log("Lead enregistré :", data);

        // 2️⃣ Fermer modal
        setShowModal(false);

        // 3️⃣ Télécharger le PDF
        await downloadPDF();

    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de l'enregistrement.");
    }
    };



  
    return (
    <>
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* 🔝 HEADER */}
        <div className="bg-primary bg-opacity-30 text-white rounded-xl shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                {/* Info principale */}
                <div className="flex-1">
                <p className="text-sm text-white/80 mb-2">
                    Statut recommandé
                </p>

                <h1 className="text-3xl text-success font-bold mb-4">
                    {recommandation_principale.statut}
                </h1>

                <p className="text-sm text-white/90 leading-relaxed max-w-3xl">
                    {recommandation_principale.justification}
                </p>
                </div>

                {/* KPIs */}
                <div className="flex justify-end">
                    <div
                        className={`grid gap-3 ${
                        recommandation_principale.gain_vs_actuel > 0
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                    >

                        {/* Score */}
                        <div className="bg-background bg-opacity-60 rounded-xl p-6 border border-white/10">
                            <p className="text-sm text-white/70 mb-1">
                            Score global
                            </p>

                            <p className="text-3xl font-bold text-secondary">
                            {recommandation_principale.score_global}
                            <span className="text-base text-white/70"> / 100</span>
                            </p>
                        </div>

                    {/* Gain uniquement si positif */}
                    {recommandation_principale.gain_vs_actuel > 0 && (
                        <div className="bg-background bg-opacity-60 rounded-xl p-6 border border-success/30">
                            <p className="text-sm text-white/70 mb-1">
                                Gain net estimé
                            </p>

                            <p className="text-3xl font-bold text-success">
                                +{recommandation_principale.gain_vs_actuel.toLocaleString("fr-FR")} €
                            </p>

                            {recommandation_principale.gain_pourcentage > 0 && (
                                <p className="text-sm text-white/70 mt-1">
                                +{recommandation_principale.gain_pourcentage}% 
                                </p>
                            )}
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* CTA boutons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
                >
                Télécharger le rapport PDF
                </button>

                <button className="btn-secondary">
                Prendre RDV avec un expert
                </button>
            </div>
        </div>

      {/* ⚠️ Alertes */}
        {resultats.alertes && resultats.alertes.length > 0 && (
        <div className="border-warning border bg-warning bg-opacity-10 p-6 rounded-xl shadow">
            <h2 className="text-warning text-xl font-bold mb-6">⚠️ Notes importantes</h2>
            <ul className="list-disc list-inside space-y-2">
            {resultats.alertes.map((a, i) => (
                <li key={i} className=" text-sm text-textSecondary">
                {a.message}
                </li>
            ))}
            </ul>
        </div>
        )}

      {/**resultats.donnees_communes && (
        <div className="bg-white bg-opacity-10 rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-6">
            Données communes de simulation
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-textSecondary">
            <div>
                <p className="font-semibold text-textPrimary">CA prévisionnel</p>
                <p>
                {resultats.donnees_communes.ca_previsionnel?.toLocaleString("fr-FR")} €
                </p>
            </div>

            <div>
                <p className="font-semibold text-textPrimary">TJM</p>
                <p>{resultats.donnees_communes.tjm} €</p>
            </div>

            <div>
                <p className="font-semibold text-textPrimary">Jours facturables</p>
                <p>{resultats.donnees_communes.jours_facturables}</p>
            </div>

            <div>
                <p className="font-semibold text-textPrimary">Parts fiscales</p>
                <p>{resultats.donnees_communes.parts_fiscales}</p>
            </div>

            <div>
                <p className="font-semibold text-textPrimary">TMI estimé</p>
                <p>{Math.round(resultats.donnees_communes.tmi * 100)} %</p>
            </div>
            </div>
        </div>
        )**/}


      {/* 📊 TABLEAU COMPARATIF */}
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Comparaison des statuts</h2>

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-white text-white px-3 py-1.5 rounded text-sm"
                >
                <option value="remuneration">Rémunération nette</option>
                <option value="charges">Charges</option>
                <option value="score">Score global</option>
            </select>
        </div>

        <table className="w-full text-sm">
        <thead className="py-3 px-3 text-base font-bold text-textPrimary border-b">
            <tr>
            <th className="text-left py-2 pl-2 bg-primary bg-opacity-15 w-1/4">
                Statut
            </th>
            <th>Rém. nette</th>
            <th className="bg-primary bg-opacity-15">Charges</th>
            <th>Risque</th>
            <th className="bg-primary bg-opacity-15">Score</th>
            <th>Voir</th>
            </tr>
        </thead>

        <tbody>
            {sortedStatuts.map((s, i) => (
            <>
                <tr
                key={i}
                className={`text-textSecondary border-b hover:bg-primary hover:bg-opacity-15 ${
                    i < 3 ? "font-bold" : ""
                }`}
                >
                <td className="py-3 pl-2 bg-primary bg-opacity-15">
                    {i === 0 ? "🏆 " : ""}
                    {s.statut}
                </td>

                <td className="text-center">
                    {s.remuneration_nette_annuelle?.toLocaleString("fr-FR")} €
                </td>

                <td className="text-center bg-primary bg-opacity-15">
                    {s.charges_pourcentage} %
                </td>

                <td className="text-center">{s.risque_juridique}</td>

                <td className="text-center bg-primary bg-opacity-15">
                    {s.score}
                </td>

                <td className="text-center">
                    <button
                    onClick={() => toggleStatutRow(i)}
                    className="text-secondary hover:underline"
                    >
                    {openStatutIndex === i ? "Voir moins" : "Voir plus"}
                    </button>
                </td>
                </tr>

                {openStatutIndex === i && (
                <tr className="bg-surface">
                    <td colSpan="6">
                    <div className="p-6 space-y-6 text-sm text-textSecondary">
                        
                        {/* Détail score */}
                        <div>
                        <h3 className="text-textPrimary font-semibold mb-3">
                            Détail du score
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                            <span className="font-semibold">Rentabilité :</span>
                            <p>{s.score_detail?.rentabilite ?? "-"} / 40</p>
                            </div>

                            <div>
                            <span className="font-semibold">Objectifs :</span>
                            <p>{s.score_detail?.adequationObjectifs ?? "-"} / 40</p>
                            </div>

                            <div>
                            <span className="font-semibold">Faisabilité :</span>
                            <p>{s.score_detail?.faisabiliteRisque ?? "-"} / 20</p>
                            </div>

                            <div>
                            <span className="font-semibold">Bonus métier :</span>
                            <p>{s.score_detail?.bonusReglesMetier ?? 0} pts</p>
                            </div>
                        </div>
                        </div>

                        {/* Détail calcul */}
                        <div>
                        <h3 className="text-textPrimary font-semibold mb-3">
                            Détail des calculs
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                            <span className="font-semibold">Cotisations sociales :</span>
                            <p>
                                {s.detail_calcul?.cotisationsSociales?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>

                            <div>
                            <span className="font-semibold">Impôt sur le revenu :</span>
                            <p>
                                {s.detail_calcul?.impotSurRevenu?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>

                            <div>
                            <span className="font-semibold">Impôt sociétés :</span>
                            <p>
                                {s.detail_calcul?.impotSurSocietes?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>

                            <div>
                            <span className="font-semibold">Frais gestion :</span>
                            <p>
                                {s.detail_calcul?.fraisGestion?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>

                            <div>
                            <span className="font-semibold">Frais fixes :</span>
                            <p>
                                {s.detail_calcul?.fraisFixes?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>

                            <div>
                            <span className="font-semibold">Épargne entreprise :</span>
                            <p>
                                {s.epargne_annuelle?.toLocaleString("fr-FR") ?? "-"} €
                            </p>
                            </div>
                        </div>
                        </div>

                        {/* Points forts / vigilance */}
                        <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-success font-semibold mb-2">
                            Points forts
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                            {(s.points_forts || []).map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-warning font-semibold mb-2">
                            Points de vigilance
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                            {(s.points_vigilance || []).map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                            </ul>
                        </div>
                        </div>

                    </div>
                    </td>
                </tr>
                )}
            </>
            ))}
        </tbody>
        </table>
      </div>
        

      {/* 📊 Graphique comparatif */}
        <div className="py-8">
            <h2 className="text-xl font-bold mb-6">
                Rémunération nette annuelle par statut
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                
                <XAxis dataKey="statut" />
                
                <YAxis
                    tickFormatter={(value) =>
                    new Intl.NumberFormat("fr-FR").format(value)
                    }
                />

                <Tooltip
                    formatter={(value) =>
                    `${new Intl.NumberFormat("fr-FR").format(value)} €`
                    }
                />

                <Bar
                dataKey="remuneration"
                barSize={40}   // 👈 largeur fixe plus fine
                radius={[6, 6, 0, 0]} // coins arrondis en haut
                >
                    {chartData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={getRiskColor(entry.risque)}
                    />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#22C55E]"></span>
                    <span>Risque faible</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#F59E0B]"></span>
                    <span>Risque moyen</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-600"></span>
                    <span>Risque élevé</span>
                </div>
            </div>

        </div>



      {/* 🧠 Explications IA */}
      <div className="bg-white bg-opacity-10 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-6">Explications de l'analyse</h2>

        {Object.entries(resultats.explications_ia || {}).map(([key, value], i) => (
        <div key={i} className="mb-5">
            <p className="font-semibold text-secondary mb-1">
            {titresExplications[key]}
            </p>
            <p className="text-textSecondary text-sm leading-relaxed">
            {value}
            </p>
        </div>
        ))}

      </div>

        {/* 📝 Prochaines étapes */}
        {resultats.next_steps && resultats.next_steps.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-6">📝 Étapes recommandées</h2>
            <ol className="list-decimal list-inside space-y-2 text-textSecondary text-sm">
            {resultats.next_steps.map((step, i) => (
                <li key={i}>{step}</li>
            ))}
            </ol>
            <div className="mt-6 flex flex-row gap-3  sm:items-end">
                <button className="btn-primary">
                Prendre RDV avec un expert
                </button>
            </div>
        </div>
        )}


    </div>

    {showModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            
            {/* Overlay */}
            <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md p-6 z-10 animate-fadeIn">
            
            <h2 className="text-lg font-semibold mb-4">
                Télécharger votre rapport PDF
            </h2>

            <p className="text-sm text-textSecondary mb-4">
                Renseignez vos informations pour recevoir votre rapport personnalisé.
            </p>

            <div className="space-y-3">
                
                <input
                required
                type="text"
                placeholder="Nom *"
                value={leadData.nom}
                onChange={(e) =>
                    setLeadData({ ...leadData, nom: e.target.value })
                }
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />

                <input
                required
                type="text"
                placeholder="Prénom *"
                value={leadData.prenom}
                onChange={(e) =>
                    setLeadData({ ...leadData, prenom: e.target.value })
                }
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />

                <input
                required
                type="email"
                placeholder="Email *"
                value={leadData.email}
                onChange={(e) =>
                    setLeadData({ ...leadData, email: e.target.value })
                }
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />

               <input
                type="tel"
                placeholder="Téléphone"
                value={leadData.telephone}
                onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setLeadData({ ...leadData, telephone: onlyNumbers });
                }}
                maxLength={10}
                className="w-full my-2 p-2 bg-white/10 rounded text-textPrimary"
                />
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                >
                Annuler
                </button>

                <button
                onClick={handleLeadAndDownload}
                disabled={
                    !leadData.nom.trim() ||
                    !leadData.prenom.trim() ||
                    !leadData.email.trim()
                }
                className={`btn-primary ${
                    !leadData.nom.trim() || !leadData.prenom.trim() || !leadData.email.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary"
                }`}
                >
                Télécharger
                </button>
            </div>
            </div>
        </div>
    )}

    </>
  );
}
