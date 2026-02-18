import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/generate", (req, res) => {
  const data = req.body;
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=rapport-simulation-statutIQ.pdf"
  );

  doc.pipe(res);

  // 🎨 COULEURS STATUTIQ
  const PRIMARY = "#D97706";    // orange
  const SECONDARY = "#0EA5E9";  // bleu
  const NEUTRAL = "#6B7280";    // gris
  const LIGHT_BG = "#F8FAFC";

  /* =====================================================
     HEADER
  ===================================================== */
  doc.rect(0, 0, doc.page.width, 90).fill(SECONDARY);

  doc
    .fillColor("white")
    .fontSize(22)
    .text("StatutIQ", 50, 30);

  doc
    .fontSize(14)
    .text("Rapport de simulation personnalisé", 50, 55);

  doc.moveDown(4);

  /* =====================================================
     STATUT RECOMMANDÉ
  ===================================================== */
  doc
    .roundedRect(50, 130, doc.page.width - 100, 120, 10)
    .fill(LIGHT_BG);

  doc
    .fillColor(PRIMARY)
    .fontSize(16)
    .text("Statut recommandé", 70, 145);

  doc
    .fontSize(22)
    .fillColor("black")
    .text(data.recommandation_principale.statut, 70, 170);

  doc
    .fontSize(14)
    .fillColor(PRIMARY)
    .text(
      `Gain estimé : +${data.recommandation_principale.gain_vs_actuel} € (${data.recommandation_principale.gain_pourcentage}%)`,
      70,
      200
    );

  doc.moveDown(6);

  /* =====================================================
     MINI HISTOGRAMME COMPARATIF
  ===================================================== */

    doc
    .fillColor("black")
    .fontSize(16)
    .text("Comparatif des rémunérations nettes", { underline: true });

    doc.moveDown(1.5);

    const chartStartX = 70;
    let chartY = doc.y;

    const barHeight = 12;
    const maxBarWidth = 220; // ✅ réduit pour éviter débordement

    const maxValue = Math.max(
    ...data.comparatif_statuts.map(s => s.remuneration_nette_annuelle)
    );

    data.comparatif_statuts.forEach((statut) => {
    const barWidth =
        (statut.remuneration_nette_annuelle / maxValue) * maxBarWidth;

    // Nom statut
    doc
        .fillColor("#6B7280")
        .fontSize(11)
        .text(statut.statut, chartStartX, chartY, { width: 120 });

    // Barre
    doc
        .rect(chartStartX + 130, chartY, barWidth, barHeight)
        .fill(
        statut.statut === data.recommandation_principale.statut
            ? "#D97706"
            : "#0EA5E9"
        );

    // Valeur €
    doc
        .fillColor("black")
        .fontSize(10)
        .text(
        `${statut.remuneration_nette_annuelle} €`,
        chartStartX + 140 + barWidth,
        chartY + 1,
        { lineBreak: false }
        );

    chartY += 22;
    });

    /* ✅ CRUCIAL : repositionner le curseur */
    doc.y = chartY + 20;
    doc.x = 50; // retour marge gauche
    doc.moveDown();

  /* =====================================================
     JUSTIFICATION
  ===================================================== */
  doc
    .fillColor(PRIMARY)
    .fontSize(16)
    .text("Pourquoi ce choix ?", { underline: true });

  doc.moveDown(0.5);

  doc
    .fillColor("black")
    .fontSize(12)
    .text(data.recommandation_principale.justification);

  doc.moveDown(2);

  /* =====================================================
     ANALYSE DÉTAILLÉE
  ===================================================== */
  doc
    .fillColor(PRIMARY)
    .fontSize(16)
    .text("Analyse détaillée", { underline: true });

  doc.moveDown();

  Object.entries(data.explications_ia).forEach(([key, value]) => {
    doc
      .fillColor(NEUTRAL)
      .fontSize(12)
      .text(key.replace("_", " ").toUpperCase());

    doc.moveDown(0.3);

    doc
      .fillColor("black")
      .fontSize(11)
      .text(value);

    doc.moveDown(2);
  });

  /* =====================================================
     ALERTES
  ===================================================== */
  if (data.alertes?.length > 0) {
    //doc.addPage();

    doc
      .fillColor(PRIMARY)
      .fontSize(16)
      .text("Notes importantes", { underline: true });

    doc.moveDown();

    data.alertes.forEach((alerte) => {
      doc
        .fillColor(PRIMARY)
        .fontSize(12)
        .text(`⚠ ${alerte.message}`);
      doc.moveDown();
    });
  }

  /* =====================================================
     NEXT STEPS
  ===================================================== */
  doc.moveDown(2);

  doc
    .fillColor(PRIMARY)
    .fontSize(16)
    .text("Prochaines étapes", { underline: true });

  doc.moveDown();

  data.next_steps.forEach((step, i) => {
    doc
      .fillColor("black")
      .fontSize(12)
      .text(`${i + 1}. ${step}`);
    doc.moveDown(0.5);
  });

  /* =====================================================
     FOOTER
  ===================================================== */
  doc
    .fontSize(9)
    .fillColor(NEUTRAL)
    .text(
      "Document généré automatiquement par StatutIQ — Simulation indicative à visée informative.",
      50,
      doc.page.height - 50,
      { align: "center" }
    );

  doc.end();
});

export default router;
