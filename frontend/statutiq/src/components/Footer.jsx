import { Link } from "react-router-dom";

export default function Footer() {
  return (
      
      <footer className="border-t border-white/10 px-8 py-6 text-sm text-textSecondary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 Café Crème — StatutIQ</p>

          <div className="flex gap-4">
            <Link to="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </Link>
            <Link to="/cgu" className="hover:text-primary">
              CGU
            </Link>
            <Link to="/confidentialite" className="hover:text-primary">
              Politique de confidentialité
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
  );
}