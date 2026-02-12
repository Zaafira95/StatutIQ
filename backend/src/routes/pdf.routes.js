import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/generate", (req, res) => {
  const data = req.body;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=rapport-simulation.pdf"
  );

  doc.pipe(res);

  // ===== Contenu PDF =====

  doc.fontSize(20).text("Rapport de Simulation StatutIQ", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text(
    `Statut recommandé : ${data.recommandation_principale.statut}`
  );

  doc.text(
    `Gain estimé : +${data.recommandation_principale.gain_vs_actuel} €`
  );

  doc.moveDown();

  doc.fontSize(16).text("Explications", { underline: true });
  doc.moveDown(0.5);

  Object.values(data.explications_ia).forEach((section) => {
    doc.fontSize(12).text(section);
    doc.moveDown();
  });

  doc.moveDown();

  doc.fontSize(16).text("Prochaines étapes", { underline: true });

  data.next_steps.forEach((step, i) => {
    doc.fontSize(12).text(`${i + 1}. ${step}`);
  });

  doc.end();
});

export default router;
