import { User, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link to="/">Accueil</Link>
      <Link to="/simulateur">Simulateur</Link>
    </nav>
  );
}

