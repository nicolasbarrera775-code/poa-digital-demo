import { jsPDF } from "jspdf";
import QRCode from "qrcode";

/**
 * Genera un PDF de Certificado de Camada.
 * Reutiliza el mismo motor visual que generarPedigreePDF / generarCertificadoTransferencia.
 *
 * @param {Object} data
 * @param {string} data.numeroCamada     - ej "CAM-2026-001"
 * @param {Object} data.criador          - { nombre, afijo }
 * @param {Object} data.padre            - { nombre, poa }
 * @param {Object} data.madre            - { nombre, poa }
 * @param {string} data.fechaNacimiento
 * @param {number} data.cantidadMachos
 * @param {number} data.cantidadHembras
 * @param {Array}  data.cachorros        - [{ nombre, sexo, color, poa }] (opcional, si ya tienen nombre/POA asignado)
 */
export async function generarCertificadoCamada(data) {
  const {
    numeroCamada = "",
    criador = {},
    padre = {},
    madre = {},
    fechaNacimiento = "",
    cantidadMachos = 0,
    cantidadHembras = 0,
    cachorros = [],
  } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ---------- Encabezado ----------
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("CERTIFICADO DE CAMADA", pageWidth / 2, 22, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "Club Argentino de Criadores del Perro Ovejero Alemán (POA)",
    pageWidth / 2,
    29,
    { align: "center" }
  );

  doc.setDrawColor(180);
  doc.line(margin, 34, pageWidth - margin, 34);

  // ---------- N° de camada ----------
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`N° de camada: ${numeroCamada || "-"}`, margin, 42);

  // ---------- Criador ----------
  let y = 52;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Criador / Afijo", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Criador: ${criador.nombre || "-"}`, margin, y);
  y += 6;
  doc.text(`Afijo: ${criador.afijo || "-"}`, margin, y);

  // ---------- Padres ----------
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Padres", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Padre: ${padre.nombre || "-"}  (N° POA: ${padre.poa || "-"})`, margin, y);
  y += 6;
  doc.text(`Madre: ${madre.nombre || "-"}  (N° POA: ${madre.poa || "-"})`, margin, y);

  // ---------- Datos de la camada ----------
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos de la camada", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Fecha de nacimiento: ${fechaNacimiento || "-"}`, margin, y);
  y += 6;
  doc.text(
    `Cantidad de cachorros: ${cantidadMachos + cantidadHembras}  (Machos: ${cantidadMachos}  Hembras: ${cantidadHembras})`,
    margin,
    y
  );

  // ---------- Tabla de cachorros (si hay datos cargados) ----------
  if (cachorros.length > 0) {
    y += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de cachorros", margin, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Nombre", margin, y);
    doc.text("Sexo", margin + 60, y);
    doc.text("Color", margin + 85, y);
    doc.text("N° POA", margin + 115, y);
    y += 4;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    cachorros.forEach((c) => {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
      doc.text(c.nombre || "-", margin, y);
      doc.text(c.sexo || "-", margin + 60, y);
      doc.text(c.color || "-", margin + 85, y);
      doc.text(c.poa || "-", margin + 115, y);
      y += 6;
    });
  }

  // ---------- Declaración ----------
  y += 12;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text(
    "Se deja constancia de que los datos consignados en el presente certificado",
    margin,
    y
  );
  y += 5;
  doc.text(
    "corresponden a la camada registrada ante el Club, conforme a la documentación presentada.",
    margin,
    y
  );

  // ---------- Firma ----------
  y += 20;
  doc.setDrawColor(0);
  doc.line(margin, y, margin + 70, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Firma responsable / Secretaría POA", margin, y + 5);

  // ---------- QR de verificación ----------
  try {
    const qrUrl = `https://poa-digital-demo.vercel.app/verificar/${numeroCamada || "demo"}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 200 });
    doc.addImage(qrDataUrl, "PNG", pageWidth - margin - 28, 20, 28, 28);
    doc.setFontSize(7);
    doc.text("Verificación digital", pageWidth - margin - 28, 50, {
      maxWidth: 28,
    });
  } catch (e) {
    // si falla el QR, el PDF se genera igual sin el código
  }

  // ---------- Pie ----------
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Válido con código QR de verificación. Emitido: ${new Date().toLocaleDateString("es-AR")}`,
    margin,
    285
  );

  doc.save(`Certificado_Camada_${(numeroCamada || "camada").replace(/\s+/g, "_")}.pdf`);
}