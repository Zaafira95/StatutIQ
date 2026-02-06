import ResultHeader from "../components/results/ResultHeader";
import StatutComparison from "../components/results/StatutComparison";
import ResultActions from "../components/results/ResultActions";

export default function Result() {

    const handleFetchIA = async (simulation) => {
        try {
            const response = await fetch("/api/ia/simulation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ simulation })
            });

            const data = await response.json();
            console.log("Résultat Claude :", data.iaResult);
            // ici tu peux mettre data.iaResult dans un state pour l'afficher
        } catch (err) {
            console.error("Erreur fetch IA :", err);
        }
    };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <ResultHeader />
      <StatutComparison />
      <ResultActions />
    </div>
  );
}
