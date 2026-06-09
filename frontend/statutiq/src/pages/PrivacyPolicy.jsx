import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (

    <>
    <Helmet>
      <title>Politique de confidentialité | StatutIQ</title>
    </Helmet>

    <main className="max-w-4xl mx-auto px-6 py-16 text-textPrimary">
      
      <h1 className="text-4xl font-bold mb-8">
        Politique de confidentialité
      </h1>

      <p className="text-textSecondary mb-8">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      {/* INTRO */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          1. Présentation
        </h2>

        <p className="text-textSecondary leading-relaxed">
          StatutIQ collecte certaines données personnelles afin de fournir
          des simulations personnalisées d’optimisation de statut juridique
          pour les freelances et indépendants.
        </p>
      </section>

      {/* DONNÉES */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          2. Données collectées
        </h2>

        <div className="space-y-4 text-textSecondary leading-relaxed">
          <p>
            Nous pouvons collecter les informations suivantes :
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Données professionnelles et financières fournies dans le simulateur</li>
            <li>Données techniques de navigation</li>
          </ul>
        </div>
      </section>

      {/* FINALITÉ */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          3. Utilisation des données
        </h2>

        <div className="space-y-4 text-textSecondary leading-relaxed">
          <p>
            Les données collectées sont utilisées pour :
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Générer des simulations personnalisées</li>
            <li>Améliorer la qualité du service</li>
            <li>Contacter les utilisateurs ayant demandé un rapport</li>
            <li>Respecter les obligations légales</li>
          </ul>
        </div>
      </section>

      {/* CONSERVATION */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          4. Conservation des données
        </h2>

        <p className="text-textSecondary leading-relaxed">
          Les données sont conservées uniquement pendant la durée nécessaire
          au traitement des simulations et à la relation commerciale.
        </p>
      </section>

      {/* PARTAGE */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          5. Partage des données
        </h2>

        <p className="text-textSecondary leading-relaxed">
          Aucune donnée personnelle n’est vendue à des tiers.
          Certaines données peuvent être traitées par des prestataires
          techniques nécessaires au fonctionnement du service
          (hébergement, base de données, IA).
        </p>
      </section>

      {/* IA */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          6. Utilisation de l’intelligence artificielle
        </h2>

        <p className="text-textSecondary leading-relaxed">
          Les simulations peuvent utiliser des services d’intelligence
          artificielle afin de générer des recommandations et analyses
          personnalisées. Ces traitements sont réalisés uniquement dans
          le cadre de la simulation demandée.
        </p>
      </section>

      {/* DROITS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          7. Vos droits
        </h2>

        <div className="space-y-4 text-textSecondary leading-relaxed">
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Droit d’accès</li>
            <li>Droit de rectification</li>
            <li>Droit de suppression</li>
            <li>Droit d’opposition</li>
            <li>Droit à la portabilité</li>
          </ul>

          <p>
            Vous pouvez exercer ces droits à l’adresse suivante :
          </p>

          <p className="text-primary font-medium">
            contact@statutiq.fr
          </p>
        </div>
      </section>

      {/* SÉCURITÉ */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          8. Sécurité
        </h2>

        <p className="text-textSecondary leading-relaxed">
          Nous mettons en œuvre des mesures techniques et organisationnelles
          afin de protéger les données personnelles contre tout accès non
          autorisé, perte ou divulgation.
        </p>
      </section>

      {/* CONTACT */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          9. Contact
        </h2>

        <p className="text-textSecondary leading-relaxed">
          Pour toute question concernant cette politique de confidentialité,
          vous pouvez nous contacter à :
        </p>

        <p className="mt-3 text-primary font-medium">
          contact@statutiq.fr
        </p>
      </section>

    </main>
    
    </>
  );
}