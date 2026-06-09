import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {

  const navigate = useNavigate();

  const [simulations, setSimulations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

    
  const [searchLeads, setSearchLeads] = useState("");
  const [searchSimulations, setSearchSimulations] = useState("");

  const filteredLeads = leads.filter((lead) =>
    `${lead.nom} ${lead.prenom} ${lead.email} ${lead.telephone}`
        .toLowerCase()
        .includes(searchLeads.toLowerCase())
    );

  const filteredSimulations = simulations.filter((simulation) =>
    `${simulation.metier} ${simulation.statut_actuel}`
        .toLowerCase()
        .includes(searchSimulations.toLowerCase())
    );


  const [currentPageLeads, setCurrentPageLeads] = useState(1);
  const leadsPerPage = 5;
  const indexLastLead = currentPageLeads * leadsPerPage;
  const indexFirstLead = indexLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexFirstLead, indexLastLead);
  const totalPagesLeads = Math.ceil(filteredLeads.length / leadsPerPage);
  
  const [currentPageSimulations, setCurrentPageSimulations] = useState(1);
  const simulationsPerPage = 10;
  const indexLastSimulation = currentPageSimulations * simulationsPerPage;
  const indexFirstSimulation = indexLastSimulation - simulationsPerPage;
  const currentSimulations = filteredSimulations.slice(indexFirstSimulation, indexLastSimulation);
  const totalPagesSimulations = Math.ceil(filteredSimulations.length / simulationsPerPage);

  useEffect(() => {

    const password = sessionStorage.getItem("admin-password");

    if (!password) {
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/data`,
        {
          headers: {
            "x-admin-password": password
          }
        }
      );

      if (!res.ok) {
        sessionStorage.removeItem("admin-password");
        navigate("/admin-login");
        return;
      }

      const data = await res.json();

      setSimulations(data.simulations);
      setLeads(data.leads);
    };

    fetchData();

  }, [navigate]);

  const toggleRow = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const formatObjectifs = (objectif) => {
    if (!objectif) return "-";

    let parsed = objectif;

    if (typeof objectif === "string") {
      try {
        parsed = JSON.parse(objectif);
      } catch {
        return objectif;
      }
    }

    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }

    if (typeof parsed === "object") {
      return [
        ...(parsed.principaux || []),
        parsed.autre
      ]
        .filter(Boolean)
        .join(", ") || "-";
    }

    return "-";
  };

  const getSimulationFromLead = (lead) => {
    return simulations.find(
      (sim) => sim.id === lead.simulation_id
    );
  };

  const getLeadFromSimulation = (simulation) => {
    return leads.find(
      (lead) => lead.simulation_id === simulation.id
    );
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard Admin
        </h1>

        <button
          onClick={() => {
            sessionStorage.removeItem("admin-password");
            navigate("/admin-login");
          }}
          className="btn-primary"
        >
          Déconnexion
        </button>
      
      </div>

      {/* LEADS */}

      <h2 className="text-xl font-semibold">
        Leads
      </h2>
      <div className="mb-6 flex justify-between items-center">

        <p className="text-secondary font-semibold">Total : {leads.length}</p>

        <div className="relative">

            <input
                type="text"
                placeholder="Recherche par nom, email..."
                value={searchLeads}
                onChange={(e) => {
                setSearchLeads(e.target.value);
                setCurrentPageLeads(1);
                }}
                className="my-2 bg-white/10 rounded text-textPrimary pl-10 px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-primary"
            />
        
            <span className="absolute left-3 top-4 text-gray-400">
                🔍
            </span>
        </div>

      </div>

      <table className="text-center w-full text-sm overflow-hidden mb-4">
        <thead className=" py-3 px-3 text-base font-bold text-textPrimary border-b">
          <tr>
            <th className=" bg-primary bg-opacity-15 w-2/12">Nom</th>
            <th className="w-2/12">Prénom</th>
            <th className="bg-primary bg-opacity-15 w-3/12">Email</th>
            <th className="w-2/12">Téléphone</th>
            <th className="bg-primary bg-opacity-15 w-2/12">Simulation liée</th>
            <th className="w-1/12">Date</th>
          </tr>
        </thead>

        <tbody>
          {currentLeads.map((lead, i) => {
            const linkedSimulation =
              getSimulationFromLead(lead);

            return (
              
              <tr key={i} className=" text-textSecondary border-b hover:bg-primary hover:bg-opacity-15">
                <td className="bg-primary bg-opacity-15 p-2">{lead.nom}</td>
                <td className="p-2">{lead.prenom}</td>
                <td className="bg-primary bg-opacity-15 p-2">{lead.email}</td>
                <td className="p-2">{lead.telephone}</td>
               <td className="bg-primary bg-opacity-15 p-2">
                  {linkedSimulation ? (
                    <>
                      {linkedSimulation.pdf_url ? (
                        <a
                          href={`${import.meta.env.VITE_API_URL}${linkedSimulation.pdf_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-secondary hover:underline block"
                        >
                          Télécharger le PDF
                        </a>
                      ) : (
                        <p>-</p>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2"> {new Date(lead.created_at).toLocaleDateString("fr-FR")} </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-6 mb-8">

        <button
            onClick={() => setCurrentPageLeads(currentPageLeads - 1)}
            disabled={currentPageLeads === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
        >
            ←
        </button>

        {Array.from({ length: totalPagesLeads }, (_, i) => (

            <button
            key={i}
            onClick={() => setCurrentPageLeads(i + 1)}
            className={`px-3 py-1 border rounded text-white ${
                currentPageLeads === i + 1
                ? "bg-primary"
                : "hover:bg-white/25"
            }`}
            >
            {i + 1}
            </button>

        ))}

        <button
            onClick={() => setCurrentPageLeads(currentPageLeads + 1)}
            disabled={currentPageLeads === totalPagesLeads}
            className="px-3 py-1 border rounded disabled:opacity-40 "
        >
            →
        </button>

        </div>

      {/* SIMULATIONS */}

    <h2 className="text-xl font-semibold">
        Simulations
    </h2>

      <div className="mb-6 flex justify-between items-center">

        <p className="text-secondary font-semibold">Total : {simulations.length}</p>

        <div className="relative">
            <input
                type="text"
                placeholder="Recherche par métier ou statut"
                value={searchSimulations}
                onChange={(e) => {
                setSearchSimulations(e.target.value);
                setCurrentPageSimulations(1);
                }}
                className="my-2 bg-white/10 rounded text-textPrimary pl-10 px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-4 text-gray-400">
                🔍
            </span>
        </div>    

      </div>

      <table className="w-full text-sm overflow-hidden mb-4">
        <thead className=" py-3 px-3 text-base font-bold text-textPrimary border-b">
          <tr>
            <th className="bg-primary bg-opacity-15 p-3 w-2/6">Métier</th>
            <th className="p-3 w-1/6">TJM</th>
            <th className="bg-primary bg-opacity-15 p-3 w-1/6">Statut</th>
            <th className="p-3">Date</th>
            <th className="bg-primary bg-opacity-15 p-3 w-1/6"></th>
          </tr>
        </thead>

        <tbody>

          {currentSimulations.map((sim, i) => {

            const linkedLead =
              getLeadFromSimulation(sim);

            return (
            <>
              <tr key={i} className="text-center text-textSecondary border-b hover:bg-primary hover:bg-opacity-15">

                <td className="bg-primary bg-opacity-15 p-3">
                  {sim.metier}
                </td>

                <td className="p-3">
                  {sim.tjm} €
                </td>

                <td className="bg-primary bg-opacity-15 p-3">
                  {sim.statut_actuel}
                </td>

                <td className="p-3">
                  {new Date(sim.created_at).toLocaleDateString("fr-FR")}
                </td>

                <td className="bg-primary bg-opacity-15 p-3">
                  <button
                    onClick={() => toggleRow(i)}
                    className="text-secondary hover:underline"
                  >
                    {openIndex === i ? "Voir moins" : "Voir plus"}
                  </button>
                </td>

              </tr>

              {openIndex === i && (

                <tr className="bg-surface">

                  <td colSpan="6">

                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                      <div>
                        <span className="font-semibold">Jours facturables :</span>
                        <p>{sim.jours_facturables}</p>
                      </div>

                      <div>
                        <span className="font-semibold">CA prévisionnel :</span>
                        <p>{sim.ca_previsionnel} €</p>
                      </div>

                      <div>
                        <span className="font-semibold">Objectif(s) :</span>
                        <p>{formatObjectifs(sim.objectif_principal)}</p>
                      </div>

                      <div>
                        <span className="font-semibold">Appétence risque :</span>
                        <p>{sim.appetence_risque}</p>
                      </div>

                      <div>
                        <span className="font-semibold">Situation familiale :</span>
                        <p>
                          {typeof sim.situation_familiale === "object"
                            ? sim.situation_familiale?.statut
                            : sim.situation_familiale || "-"}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold">Autres revenus :</span>
                        <p>{sim.autres_revenus}</p>
                      </div>

                      <div>
                        <span className="font-semibold">Expérience freelance :</span>
                        <p>{sim.experience_freelance}</p>
                      </div>

                      <div>
                        <span className="font-semibold">Type mission :</span>
                        <p>{sim.type_mission}</p>
                      </div>
                      
                      <div>
                      <span className="font-semibold">Rapport PDF :</span>

                        {sim.pdf_url ? (
                          <a
                            href={`${import.meta.env.VITE_API_URL}${sim.pdf_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-secondary hover:underline block"
                          >
                            Télécharger le PDF
                          </a>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold">
                          Lead associé :
                        </span>

                        {linkedLead ? (
                          <p>
                            {linkedLead.prenom} {linkedLead.nom}
                            {linkedLead.email
                              ? ` – ${linkedLead.email}`
                              : ""}
                          </p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>

                    </div>

                  </td>

                </tr>

              )}

            </>
            );
          })}

        </tbody>

      </table>

      <div className="flex justify-center gap-2 mt-6 mb-8">

        <button
            onClick={() => setCurrentPageSimulations(currentPageSimulations - 1)}
            disabled={currentPageSimulations === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
        >
            ←
        </button>

        {Array.from({ length: totalPagesSimulations }, (_, i) => (

            <button
            key={i}
            onClick={() => setCurrentPageSimulations(i + 1)}
            className={`px-3 py-1 border rounded text-white ${
                currentPageSimulations === i + 1
                ? "bg-primary"
                : "hover:bg-white/25"
            }`}
            >
            {i + 1}
            </button>

        ))}

        <button
            onClick={() => setCurrentPageSimulations(currentPageSimulations + 1)}
            disabled={currentPageSimulations === totalPagesSimulations}
            className="px-3 py-1 border rounded disabled:opacity-40"
        >
            →
        </button>

        </div>

    </div>
  );
}