import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-background">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-primary">
          Café Crème
        </Link>

        {/* NAV */}
        <div className="flex items-center gap-6">
          <Link
            to="/simulateur"
            className="text-textSecondary hover:text-primary transition text-sm"
          >
            Simulateur
          </Link>

          {/* CTA HEADER */}
          <Link
            to="/simulateur"
            className="btn-primary">
            Lancer
          </Link>

          {/* LOGIN */}
          <Link
            to="/admin"
            className="text-textSecondary hover:text-primary transition text-sm"
          >
            Connexion
          </Link>
        </div>
      </div>
    </header>
  );
}
