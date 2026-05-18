import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-textPrimary">


      {/* HERO */}
      <main>
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-primary font-semibold mb-4">
            Simulateur intelligent pour freelances
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Optimisez votre statut freelance <br />
            <span className="text-primary">en 2 minutes</span>
          </h1>

          <p className="text-textSecondary text-lg max-w-2xl mx-auto mb-10">
            Découvrez quel statut juridique maximise votre rémunération nette
            en 2026 grâce à une analyse personnalisée.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link
              to="/simulateur"
              className="btn-primary">
              Lancer ma simulation
            </Link>

            <a
              href="#how-it-works"
              className="btn-secondary">
              Comment ça marche ?
            </a>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-bold tabular-nums">12 345</p>
              <p className="text-textSecondary mt-2">freelances aidés</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-bold text-success tabular-nums">
                +8 500€
              </p>
              <p className="text-textSecondary mt-2">gagnés en moyenne</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-3xl font-bold tabular-nums">4,9 ⭐</p>
              <p className="text-textSecondary mt-2">note utilisateurs</p>
            </div>
          </div>
        </section>

        {/* PARTENAIRES */}
        <section className="max-w-5xl mx-auto px-6 py-10 text-center border-y border-white/10">
          <p className="text-textSecondary text-sm mb-6">
            Références et sources officielles utilisées dans l’analyse
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-textSecondary font-semibold">
            <span>URSSAF</span>
            <span>BOFIP</span>
            <span>Impôts.gouv</span>
            <span>Experts-Comptables</span>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-primary text-3xl font-bold mb-4">01</div>
              <h3 className="font-semibold text-lg mb-2">
                Répondez à quelques questions
              </h3>
              <p className="text-textSecondary text-sm">
                Métier, TJM, statut actuel, objectifs et situation personnelle.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-primary text-3xl font-bold mb-4">02</div>
              <h3 className="font-semibold text-lg mb-2">
                L’IA compare les statuts
              </h3>
              <p className="text-textSecondary text-sm">
                SASU, EURL, EI, micro-entreprise, portage salarial, CAE et plus.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-success text-3xl font-bold mb-4">03</div>
              <h3 className="font-semibold text-lg mb-2">
                Obtenez votre recommandation
              </h3>
              <p className="text-textSecondary text-sm">
                Une synthèse claire avec score, gain estimé et prochaines étapes.
              </p>
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="bg-white/5 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ils ont optimisé avec nous
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah, UX Designer",
                  text: "J’ai compris en quelques minutes que mon statut n’était plus adapté.",
                  gain: "+6 200€ / an",
                },
                {
                  name: "Mehdi, Dev Fullstack",
                  text: "La comparaison était claire, chiffrée et facile à présenter à mon comptable.",
                  gain: "+8 900€ / an",
                },
                {
                  name: "Claire, Consultante Data",
                  text: "Le rapport m’a aidée à prendre une décision beaucoup plus sereine.",
                  gain: "+5 400€ / an",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-background border border-white/10 rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 mb-4" />
                  <p className="text-textSecondary text-sm mb-4">
                    “{item.text}”
                  </p>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-success font-bold mt-2">{item.gain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MÉDIAS */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-textSecondary text-sm mb-6">
            Vu dans les médias
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-textSecondary font-semibold">
            <span>Les Échos</span>
            <span>BFM Business</span>
            <span>Maddyness</span>
            <span>Forbes</span>
          </div>
        </section>
      </main>


    </div>
  );
}