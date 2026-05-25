import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateSimulationPdfFile(data, simulationId) {
  return new Promise((resolve, reject) => {
    try {
      const reportsDir = path.join(process.cwd(), "uploads", "reports");

      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const fileName = `simulation-statutIQ-${simulationId}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      const publicUrl = `/uploads/reports/${fileName}`;

      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const PRIMARY = "#1E6BFF";
      const ACCENT = "#4FD1FF";
      const SUCCESS = "#22C55E";
      const WARNING = "#F59E0B";
      const BACKGROUND = "#0B0F14";
      const SURFACE = "#111827";
      const NEUTRAL = "#6B7280";
      const LIGHT = "#F8FAFC";

      const MARGIN_X = 50;
      const CONTENT_WIDTH = doc.page.width - MARGIN_X * 2;

      const reco = data.recommandation_principale || {};
      const gain = Number(reco.gain_vs_actuel || 0);
      const gainPercent = Number(reco.gain_pourcentage || 0);
      const hasPositiveGain = gain > 0;

      const formatEuro = (value) =>
        `${Number(value || 0).toLocaleString("fr-FR")} €`;

      const formatPercent = (value) =>
        `${Number(value || 0).toLocaleString("fr-FR")} %`;

      const resetCursor = () => {
        doc.x = MARGIN_X;
      };

      const checkPageBreak = (height = 80) => {
        if (doc.y + height > doc.page.height - 80) {
          doc.addPage();
          doc.x = MARGIN_X;
          doc.y = 50;
        }
      };

      const sectionTitle = (title) => {
        checkPageBreak(60);
        resetCursor();
        doc.moveDown(1);
        doc.fillColor(PRIMARY).fontSize(16).text(title, MARGIN_X, doc.y, {
          width: CONTENT_WIDTH,
        });
        doc.moveDown(0.8);
        resetCursor();
      };

      const drawMetricCard = (x, y, width, title, value, color = PRIMARY) => {
        doc.roundedRect(x, y, width, 70, 8).fill(LIGHT);

        doc.fillColor(NEUTRAL).fontSize(9).text(title, x + 12, y + 12, {
          width: width - 24,
        });

        doc.fillColor(color).fontSize(15).text(value, x + 12, y + 34, {
          width: width - 24,
        });
      };

      // HEADER
      doc.rect(0, 0, doc.page.width, 95).fill(BACKGROUND);

      doc.fillColor("white").fontSize(24).text("StatutIQ", 50, 28);
      doc
        .fillColor(ACCENT)
        .fontSize(12)
        .text("Rapport de simulation personnalisé", 50, 58);

      doc.y = 120;
      resetCursor();

      // STATUT RECOMMANDÉ
      doc.roundedRect(50, 120, doc.page.width - 100, 150, 12).fill(SURFACE);

      doc.fillColor(ACCENT).fontSize(12).text("Statut recommandé", 70, 140);

      doc
        .fillColor(SUCCESS)
        .fontSize(28)
        .text(reco.statut || "-", 70, 162, {
          width: 250,
          lineBreak: false,
        });

      doc.fillColor("white").fontSize(11).text("Score global", 70, 210);

      doc
        .fillColor("white")
        .fontSize(24)
        .text(`${reco.score_global || 0}`, 70, 228, {
          continued: true,
        })
        .fontSize(12)
        .fillColor("#D1D5DB")
        .text(" / 100");

      if (hasPositiveGain) {
        doc.fillColor("white").fontSize(11).text("Gain net estimé", 285, 210);

        doc
          .fillColor(SUCCESS)
          .fontSize(24)
          .text(`+${formatEuro(gain)}`, 285, 228, {
            width: 250,
            lineBreak: false,
          });

        if (gainPercent > 0) {
          doc
            .fillColor("#D1D5DB")
            .fontSize(10)
            .text(`+${gainPercent}% vs situation actuelle`, 285, 252, {
              width: 250,
            });
        }
      } else {
        doc
          .fillColor("#D1D5DB")
          .fontSize(10)
          .text(
            "Recommandation basée sur le score global, la protection, la fiscalité et les objectifs déclarés.",
            285,
            214,
            {
              width: 250,
              lineGap: 3,
            }
          );
      }

      doc.y = 300;
      resetCursor();

      // DONNÉES COMMUNES
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
        resetCursor();
      }

      // HISTOGRAMME
      sectionTitle("Comparatif des rémunérations nettes");

      const chartStartX = 65;
      let chartY = doc.y;
      const barHeight = 10;
      const maxBarWidth = 180;

      const maxValue = Math.max(
        ...(data.comparatif_statuts || []).map(
          (s) => s.remuneration_nette_annuelle || 0
        )
      );

      (data.comparatif_statuts || []).forEach((statut) => {
        checkPageBreak(30);

        const value = statut.remuneration_nette_annuelle || 0;
        const barWidth = maxValue ? (value / maxValue) * maxBarWidth : 0;

        const isBest = statut.statut === reco.statut;

        doc
          .fillColor(NEUTRAL)
          .fontSize(9)
          .text(statut.statut, chartStartX, chartY, {
            width: 115,
            align: "left",
          });

        doc
          .rect(chartStartX + 125, chartY + 2, barWidth, barHeight)
          .fill(isBest ? SUCCESS : PRIMARY);

        doc
          .fillColor("black")
          .fontSize(9)
          .text(formatEuro(value), chartStartX + 135 + barWidth, chartY, {
            width: 100,
            lineBreak: false,
          });

        chartY += 22;
      });

      doc.y = chartY + 15;
      resetCursor();

      // TABLEAU
      sectionTitle("Tableau comparatif");

      const tableX = 50;
      let tableY = doc.y;

      const tableWidth = 520;
      const headerHeight = 24;
      const rowHeight = 28;

      const cols = {
        statut: 135,
        net: 95,
        charges: 70,
        score: 60,
        risque: 80,
      };

      const drawTableHeader = () => {
        doc.rect(tableX, tableY, tableWidth, headerHeight).fill(PRIMARY);

        doc.fillColor("white").fontSize(9);

        doc.text("Statut", tableX + 8, tableY + 8, {
          width: cols.statut,
          lineBreak: false,
        });

        doc.text("Net annuel", tableX + 145, tableY + 8, {
          width: cols.net,
          lineBreak: false,
        });

        doc.text("Charges", tableX + 245, tableY + 8, {
          width: cols.charges,
          lineBreak: false,
        });

        doc.text("Score", tableX + 320, tableY + 8, {
          width: cols.score,
          lineBreak: false,
        });

        doc.text("Risque", tableX + 385, tableY + 8, {
          width: cols.risque,
          lineBreak: false,
        });

        tableY += headerHeight;
      };

      const checkTablePageBreak = () => {
        if (tableY + rowHeight > doc.page.height - 80) {
          doc.addPage();
          doc.x = MARGIN_X;
          doc.y = 50;
          tableY = doc.y;
          drawTableHeader();
        }
      };

      drawTableHeader();

      (data.comparatif_statuts || []).forEach((s, index) => {
        checkTablePageBreak();

        const rowColor = index % 2 === 0 ? "#F8FAFC" : "#FFFFFF";
        const isBest = s.statut === reco.statut;

        doc.rect(tableX, tableY, tableWidth, rowHeight).fill(rowColor);

        doc.fillColor(isBest ? SUCCESS : "black").fontSize(9);

        doc.text(`${isBest ? "✓ " : ""}${s.statut || "-"}`, tableX + 8, tableY + 9, {
          width: cols.statut,
          lineBreak: false,
        });

        doc.fillColor("black").text(formatEuro(s.remuneration_nette_annuelle), tableX + 145, tableY + 9, {
          width: cols.net,
          lineBreak: false,
        });

        doc.text(formatPercent(s.charges_pourcentage), tableX + 245, tableY + 9, {
          width: cols.charges,
          lineBreak: false,
        });

        doc.text(`${s.score || 0}/100`, tableX + 320, tableY + 9, {
          width: cols.score,
          lineBreak: false,
        });

        doc.text(s.risque_juridique || "-", tableX + 385, tableY + 9, {
          width: cols.risque,
          lineBreak: false,
        });

        tableY += rowHeight;
      });

      doc.y = tableY + 20;
      resetCursor();

      // DÉTAIL STATUT RECOMMANDÉ
      const best = (data.comparatif_statuts || []).find(
        (s) => s.statut === reco.statut
      );

      if (best) {
        sectionTitle("Détail du statut recommandé");

        doc.fillColor("black").fontSize(11);

        doc.text(`Rentabilité : ${best.score_detail?.rentabilite ?? "-"} / 40`);
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
        doc.text(`Frais fixes : ${formatEuro(best.detail_calcul?.fraisFixes)}`);
        doc.text(`Frais de gestion : ${formatEuro(best.detail_calcul?.fraisGestion)}`);
        doc.text(`Épargne entreprise : ${formatEuro(best.epargne_annuelle)}`);

        doc.moveDown(1);
        resetCursor();
      }

      // JUSTIFICATION
      sectionTitle("Pourquoi ce choix ?");

      doc.fillColor("black").fontSize(11).text(reco.justification || "-", MARGIN_X, doc.y, {
        width: CONTENT_WIDTH,
        lineGap: 3,
        align: "left",
      });

      resetCursor();

      // ANALYSE IA
      if (data.explications_ia) {
        sectionTitle("Analyse détaillée");

        const titres = {
          choix_statut: "Pourquoi ce statut est recommandé",
          optimisation_rem: "Optimisation de la rémunération",
          fiscalite_detaillee: "Analyse fiscale détaillée",
          demarches: "Démarches administratives",
        };

        Object.entries(data.explications_ia).forEach(([key, value]) => {
          checkPageBreak(120);
          resetCursor();

          doc.fillColor(PRIMARY).fontSize(12).text(titres[key] || key, MARGIN_X, doc.y, {
            width: CONTENT_WIDTH,
          });

          doc.moveDown(0.3);

          doc.fillColor("black").fontSize(10).text(value, MARGIN_X, doc.y, {
            width: CONTENT_WIDTH,
            lineGap: 3,
          });

          doc.moveDown(1);
          resetCursor();
        });
      }

      // ALERTES
      if (data.alertes?.length > 0) {
        sectionTitle("Notes importantes");

        data.alertes.forEach((alerte) => {
          checkPageBreak(50);
          resetCursor();

          doc.fillColor(WARNING).fontSize(10).text(`• ${alerte.message}`, MARGIN_X, doc.y, {
            width: CONTENT_WIDTH,
            lineGap: 3,
          });

          doc.moveDown(0.5);
          resetCursor();
        });
      }

      // NEXT STEPS
      if (data.next_steps?.length > 0) {
        sectionTitle("Étapes recommandées");

        data.next_steps.forEach((step, i) => {
          checkPageBreak(40);
          resetCursor();

          doc.fillColor("black").fontSize(10).text(`${i + 1}. ${step}`, MARGIN_X, doc.y, {
            width: CONTENT_WIDTH,
            lineGap: 3,
          });

          doc.moveDown(0.5);
          resetCursor();
        });
      }

      // FOOTER LEGAL
      doc.addPage();

      doc.x = MARGIN_X;
      doc.y = 80;

      const footerText = `
AVERTISSEMENT LÉGAL

Ce simulateur fournit des estimations basées sur la législation française en vigueur à la date de génération du rapport. Les résultats sont indicatifs et ne constituent pas un conseil juridique, fiscal ou comptable personnalisé.

Café Crème recommande de consulter un expert-comptable ou avocat fiscaliste avant toute décision de changement de statut.

Les calculs sont effectués par un moteur interne et les explications peuvent être enrichies par une IA. Des erreurs restent possibles. Café Crème ne peut être tenu responsable des décisions prises sur la base de ces simulations.
`;

      doc.fillColor(NEUTRAL).fontSize(9).text(footerText, MARGIN_X, doc.y, {
        width: CONTENT_WIDTH,
        lineGap: 4,
        align: "left",
      });

      doc.end();

      stream.on("finish", () => {
        resolve({
          filePath,
          publicUrl,
        });
      });

      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}