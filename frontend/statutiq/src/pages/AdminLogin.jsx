import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/data`,
        {
          headers: {
            "x-admin-password": password
          }
        }
      );

      if (!res.ok) {
        setError("Mot de passe incorrect");
        return;
      }

      sessionStorage.setItem("admin-password", password);

      navigate("/admin");

    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-xl w-full max-w-md"
      >

        <h1 className="text-2xl font-bold mb-6">
          Connexion Admin
        </h1>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-white/10 mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Se connecter
        </button>

      </form>

    </div>
  );
}