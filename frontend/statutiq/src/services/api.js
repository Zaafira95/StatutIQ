const API_URL = "http://localhost:5000/api";

export async function createSimulation(data) {
  const response = await fetch(`${API_URL}/simulations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erreur API");
  }

  return result;
}
