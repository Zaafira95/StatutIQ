import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 bg-background text-textPrimary">
      <div className="max-w-xl text-center">
        <p className="text-primary font-semibold mb-3">
          Erreur 404
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Page introuvable
        </h1>

        <p className="text-textSecondary mb-8">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary"
          >
            Retour à l’accueil
          </Link>

          <Link
            to="/simulateur"
            className="btn-secondary"
          >
            Lancer une simulation
          </Link>
        </div>
      </div>
    </main>
  );
}