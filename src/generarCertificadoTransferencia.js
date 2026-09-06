import { jsPDF } from "jspdf";
import QRCode from "qrcode";

/**
 * Genera un PDF de Certificado de Transferencia de Dominio.
 * Reutiliza el mismo motor visual que generarPedigreePDF (jsPDF + QR),
 * pero con los datos de la transferencia en vez del árbol genealógico.
 *
 * @param {Object} data
 * @param {Object} data.ejemplar        - { nombre, poa }
 * @param {Object} data.titularAnterior - { nombre, dni }
 * @param {Object} data.nuevoTitular    - { nombre, dni, domicilio, localidad, provincia, cp, pais, telefono, email }
 * @param {string} data.fechaEntrega
 * @param {string} data.numeroTramite   - ej "TR-2026-00124"
 */
export async function generarCertificadoTransferencia(data) {
  const {
    ejemplar = {},
    titularAnterior = {},
    nuevoTitular = {},
    fechaEntrega = "",
    numeroTramite = "",
  } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ---------- Encabezado ----------
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("CERTIFICADO DE TRANSFERENCIA DE DOMINIO", pageWidth / 2, 22, {
    align: "center",
  });

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

  // ---------- N° de trámite ----------
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`N° de trámite: ${numeroTramite || "-"}`, margin, 42);

  // ---------- Datos del ejemplar ----------
  let y = 52;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del ejemplar", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Nombre: ${ejemplar.nombre || "-"}`, margin, y);
  y += 6;
  doc.text(`N° POA: ${ejemplar.poa || "-"}`, margin, y);

  // ---------- Titular anterior ----------
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Titular anterior", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Nombre: ${titularAnterior.nombre || "-"}`, margin, y);
  y += 6;
  doc.text(`D.N.I.: ${titularAnterior.dni || "-"}`, margin, y);

  // ---------- Nuevo titular ----------
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Nuevo titular", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`Nombre: ${nuevoTitular.nombre || "-"}`, margin, y);
  y += 6;
  doc.text(`D.N.I.: ${nuevoTitular.dni || "-"}`, margin, y);
  y += 6;
  doc.text(
    `Domicilio: ${nuevoTitular.domicilio || "-"}, ${nuevoTitular.localidad || "-"}, ${nuevoTitular.provincia || "-"}`,
    margin,
    y
  );
  y += 6;
  doc.text(`Código postal: ${nuevoTitular.cp || "-"}   País: ${nuevoTitular.pais || "-"}`, margin, y);
  y += 6;
  doc.text(
    `Teléfono: ${nuevoTitular.telefono || "-"}   Email: ${nuevoTitular.email || "-"}`,
    margin,
    y
  );

  // ---------- Fecha de entrega ----------
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text(`Fecha de entrega del ejemplar: ${fechaEntrega || "-"}`, margin, y);

  // ---------- Declaración ----------
  y += 14;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text(
    "Se deja constancia de que ambas partes declaran contar con la firma correspondiente",
    margin,
    y
  );
  y += 5;
  doc.text(
    "del titular anterior y del nuevo titular para la presente transferencia de dominio.",
    margin,
    y
  );

  // ---------- Firmas ----------
  y += 20;
  doc.setDrawColor(0);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Firma titular anterior", margin, y + 5);
  doc.text("Firma nuevo titular", pageWidth - margin - 70, y + 5);

  // ---------- QR de verificación ----------
  try {
    const qrUrl = `https://poa-digital-demo.vercel.app/verificar/${numeroTramite || "demo"}`;
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

  doc.save(
    `Certificado_Transferencia_${(ejemplar.nombre || "ejemplar").replace(/\s+/g, "_")}.pdf`
  );
}