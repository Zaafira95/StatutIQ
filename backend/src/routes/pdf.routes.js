import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/generate", (req, res) => {
  const data = req.body;

  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=rapport-simulation-statutIQ.pdf"
  );

  doc.pipe(res);

  // Couleurs nouvelle charte
  const PRIMARY = "#1E6BFF";
  const ACCENT = "#4FD1FF";
  const SUCCESS = "#22C55E";
  const WARNING = "#F59E0B";
  const BACKGROUND = "#0B0F14";
  const SURFACE = "#111827";
  const NEUTRAL = "#6B7280";
  const LIGHT = "#F8FAFC";

  const formatEuro = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR")} €`;

  const formatPercent = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR")} %`;

  const checkPageBreak = (height = 80) => {
    if (doc.y + height > doc.page.height - 80) {
      doc.addPage();
    }
  };

  const sectionTitle = (title) => {
    checkPageBreak(60);
    doc.moveDown(1);
    doc.fillColor(PRIMARY).fontSize(16).text(title);
    doc.moveDown(0.8);
  };

  const drawMetricCard = (x, y, width, title, value, color = PRIMARY) => {
    doc.roundedRect(x, y, width, 70, 8).fill(LIGHT);

    doc.fillColor(NEUTRAL).fontSize(9).text(title, x + 12, y + 12, {
      width: width - 24,
    });

    doc.fillColor(color).fontSize(16).text(value, x + 12, y + 34, {
      width: width - 24,
    });
  };

  /* HEADER */
  doc.rect(0, 0, doc.page.width, 95).fill(BACKGROUND);

  doc.fillColor("white").fontSize(24).text("StatutIQ", 50, 28);
  doc
    .fillColor(ACCENT)
    .fontSize(12)
    .text("Rapport de simulation personnalisé", 50, 58);

  doc.moveDown(5);

  /* STATUT RECOMMANDÉ */
  doc.roundedRect(50, 120, doc.page.width - 100, 135, 12).fill(SURFACE);

  doc.fillColor(ACCENT).fontSize(12).text("Statut recommandé", 70, 140);

  doc
    .fillColor(SUCCESS)
    .fontSize(26)
    .text(data.recommandation_principale?.statut || "-", 70, 162);

  doc.fillColor("white").fontSize(12).text("Score global", 70, 200);

  doc
    .fillColor("white")
    .fontSize(18)
    .text(`${data.recommandation_principale?.score_global || 0} / 100`, 70, 218);

  doc.fillColor("white").fontSize(12).text("Gain estimé", 250, 200);

  doc
    .fillColor(SUCCESS)
    .fontSize(18)
    .text(
      `+${formatEuro(data.recommandation_principale?.gain_vs_actuel)} (${data.recommandation_principale?.gain_pourcentage || 0}%)`,
      250,
      218
    );

  doc.y = 285;

  /* DONNÉES COMMUNES */
  if (data.donnees_communes) {
    sectionTitle("Données communes de simulation");

    const y = doc.y;
    const cardWidth = 95;

    drawMetricCard(
      50,
      y,
      cardWidth,
      "CA prévisionnel",
      formatEuro(data.donnees_communes.ca_previsionnel),
      PRIMARY
    );

    drawMetricCard(
      155,
      y,
      cardWidth,
      "TJM",
      formatEuro(data.donnees_communes.tjm),
      PRIMARY
    );

    drawMetricCard(
      260,
      y,
      cardWidth,
      "Jours facturables",
      `${data.donnees_communes.jours_facturables || 0}`,
      PRIMARY
    );

    drawMetricCard(
      365,
      y,
      cardWidth,
      "Parts fiscales",
      `${data.donnees_communes.parts_fiscales || "-"}`,
      ACCENT
    );

    drawMetricCard(
      470,
      y,
      cardWidth,
      "TMI estimé",
      `${Math.round((data.donnees_communes.tmi || 0) * 100)} %`,
      WARNING
    );

    doc.y = y + 95;
  }

  /* HISTOGRAMME */
  sectionTitle("Comparatif des rémunérations nettes");

  const chartStartX = 65;
  let chartY = doc.y;
  const barHeight = 10;
  const maxBarWidth = 190;

  const maxValue = Math.max(
    ...(data.comparatif_statuts || []).map(
      (s) => s.remuneration_nette_annuelle || 0
    )
  );

  (data.comparatif_statuts || []).forEach((statut) => {
    checkPageBreak(30);

    const value = statut.remuneration_nette_annuelle || 0;
    const barWidth = maxValue ? (value / maxValue) * maxBarWidth : 0;

    const isBest = statut.statut === data.recommandation_principale?.statut;

    doc.fillColor(NEUTRAL).fontSize(9).text(statut.statut, chartStartX, chartY, {
      width: 115,
    });

    doc
      .rect(chartStartX + 125, chartY + 2, barWidth, barHeight)
      .fill(isBest ? SUCCESS : PRIMARY);

    doc
      .fillColor("black")
      .fontSize(9)
      .text(formatEuro(value), chartStartX + 135 + barWidth, chartY, {
        width: 90,
        lineBreak: false,
      });

    chartY += 22;
  });

  doc.y = chartY + 15;
  doc.x = 50;

  /* TABLEAU COMPARATIF */
  sectionTitle("Tableau comparatif");

  const tableX = 50;
  let tableY = doc.y;

  const cols = {
    statut: 135,
    net: 95,
    charges: 70,
    score: 60,
    risque: 80,
  };

  doc.rect(tableX, tableY, 520, 24).fill(PRIMARY);

  doc.fillColor("white").fontSize(9);
  doc.text("Statut", tableX + 8, tableY + 8, { width: cols.statut });
  doc.text("Net annuel", tableX + 145, tableY + 8, { width: cols.net });
  doc.text("Charges", tableX + 245, tableY + 8, { width: cols.charges });
  doc.text("Score", tableX + 320, tableY + 8, { width: cols.score });
  doc.text("Risque", tableX + 385, tableY + 8, { width: cols.risque });

  tableY += 24;

  (data.comparatif_statuts || []).forEach((s, index) => {
    checkPageBreak(35);

    const rowColor = index % 2 === 0 ? "#F8FAFC" : "#FFFFFF";
    doc.rect(tableX, tableY, 520, 28).fill(rowColor);

    doc.fillColor("black").fontSize(9);
    doc.text(s.statut || "-", tableX + 8, tableY + 9, { width: cols.statut });
    doc.text(formatEuro(s.remuneration_nette_annuelle), tableX + 145, tableY + 9, {
      width: cols.net,
    });
    doc.text(formatPercent(s.charges_pourcentage), tableX + 245, tableY + 9, {
      width: cols.charges,
    });
    doc.text(`${s.score || 0}/100`, tableX + 320, tableY + 9, {
      width: cols.score,
    });
    doc.text(s.risque_juridique || "-", tableX + 385, tableY + 9, {
      width: cols.risque,
    });

    tableY += 28;
  });

  doc.y = tableY + 20;

  /* DÉTAIL DU TOP STATUT */
  const best = (data.comparatif_statuts || []).find(
    (s) => s.statut === data.recommandation_principale?.statut
  );

  if (best) {
    sectionTitle("Détail du statut recommandé");

    doc.fillColor("black").fontSize(11);

    doc.text(
      `Rentabilité : ${best.score_detail?.rentabilite ?? "-"} / 40`
    );
    doc.text(
      `Adéquation objectifs : ${best.score_detail?.adequationObjectifs ?? "-"} / 40`
    );
    doc.text(
      `Faisabilité / risque : ${best.score_detail?.faisabiliteRisque ?? "-"} / 20`
    );
    doc.text(
      `Bonus règles métier : ${best.score_detail?.bonusReglesMetier ?? 0} pts`
    );

    doc.moveDown(1);

    doc.fillColor(NEUTRAL).fontSize(11).text("Détail des calculs");
    doc.moveDown(0.4);

    doc.fillColor("black").fontSize(10);
    doc.text(
      `Cotisations sociales : ${formatEuro(best.detail_calcul?.cotisationsSociales)}`
    );
    doc.text(
      `Impôt sur le revenu : ${formatEuro(best.detail_calcul?.impotSurRevenu)}`
    );
    doc.text(
      `Impôt sur les sociétés : ${formatEuro(best.detail_calcul?.impotSurSocietes)}`
    );
    doc.text(
      `Frais fixes : ${formatEuro(best.detail_calcul?.fraisFixes)}`
    );
    doc.text(
      `Frais de gestion : ${formatEuro(best.detail_calcul?.fraisGestion)}`
    );
    doc.text(
      `Épargne entreprise : ${formatEuro(best.epargne_annuelle)}`
    );

    doc.moveDown(1);
  }

  /* JUSTIFICATION */
  sectionTitle("Pourquoi ce choix ?");

  doc
    .fillColor("black")
    .fontSize(11)
    .text(data.recommandation_principale?.justification || "-", {
      lineGap: 3,
    });

  /* ANALYSE IA */
  if (data.explications_ia) {
    sectionTitle("Analyse détaillée");

    const titres = {
      choix_statut: "Pourquoi ce statut est recommandé",
      optimisation_rem: "Optimisation de la rémunération",
      fiscalite_detaillee: "Analyse fiscale détaillée",
      demarches: "Démarches administratives",
    };

    Object.entries(data.explications_ia).forEach(([key, value]) => {
      checkPageBreak(100);

      doc.fillColor(PRIMARY).fontSize(12).text(titres[key] || key);
      doc.moveDown(0.3);

      doc.fillColor("black").fontSize(10).text(value, {
        lineGap: 3,
      });

      doc.moveDown(1);
    });
  }

  /* ALERTES */
  if (data.alertes?.length > 0) {
    sectionTitle("Notes importantes");

    data.alertes.forEach((alerte) => {
      checkPageBreak(50);

      doc
        .fillColor(WARNING)
        .fontSize(10)
        .text(`• ${alerte.message}`, {
          lineGap: 3,
        });

      doc.moveDown(0.5);
    });
  }

  /* NEXT STEPS */
  if (data.next_steps?.length > 0) {
    sectionTitle("Étapes recommandées");

    data.next_steps.forEach((step, i) => {
      checkPageBreak(40);

      doc
        .fillColor("black")
        .fontSize(10)
        .text(`${i + 1}. ${step}`, {
          lineGap: 3,
        });

      doc.moveDown(0.5);
    });
  }

  /* FOOTER LEGAL */
  const footerText = `
AVERTISSEMENT LÉGAL

Ce simulateur fournit des estimations basées sur la législation française en vigueur à la date de génération du rapport. Les résultats sont indicatifs et ne constituent pas un conseil juridique, fiscal ou comptable personnalisé.

Café Crème recommande de consulter un expert-comptable ou avocat fiscaliste avant toute décision de changement de statut.

Les calculs sont effectués par un moteur interne et les explications peuvent être enrichies par une IA. Des erreurs restent possibles. Café Crème ne peut être tenu responsable des décisions prises sur la base de ces simulations.
`;

  doc.addPage();

  doc.fillColor(NEUTRAL).fontSize(9).text(footerText, 50, 80, {
    lineGap: 4,
    align: "left",
  });

  doc.end();
});

export default router;