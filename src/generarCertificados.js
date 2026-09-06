import { jsPDF } from "jspdf";
import QRCode from "qrcode";

// ============================================
// ENCABEZADO COMPARTIDO (mismo estilo que el pedigree)
// ============================================
function encabezado(doc, titulo) {
  doc.setFillColor(20, 40, 30);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CLUB ARGENTINO DE CRIADORES DEL PERRO OVEJERO ALEMÁN", 105, 12, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(titulo, 105, 20, { align: "center" });
  doc.setTextColor(0, 0, 0);
}

function pie(doc, codigoVerificacion) {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Documento generado digitalmente. Válido con código QR de verificación. Emitido: ${new Date().toLocaleDateString("es-AR")}`,
    15,
    285
  );
}

async function agregarQR(doc, url) {
  const qrDataUrl = await QRCode.toDataURL(url, { margin: 1, width: 200 });
  doc.addImage(qrDataUrl, "PNG", 160, 40, 35, 35);
  doc.setFontSize(7);
  doc.text("Escaneá para verificar", 165, 78);
}

// ============================================
// CERTIFICADO DE TRANSFERENCIA
// Uso: generarCertificadoTransferencia(ejemplar, vendedor, comprador)
// vendedor / comprador son objetos simples: { nombre, dni_o_nroSocio }
// ============================================
export async function generarCertificadoTransferencia(ejemplar, vendedor, comprador) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  encabezado(doc, "CERTIFICADO DE TRANSFERENCIA DE PROPIEDAD");

  let y = 45;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Por medio del presente se certifica la transferencia de propiedad del siguiente ejemplar:", 15, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(ejemplar.nombre || "Sin nombre", 15, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 7;
  doc.text(`POA: ${ejemplar.poa || "-"}`, 15, y);
  y += 6;
  doc.text(`Fecha de nacimiento: ${ejemplar.nacimiento || "-"}`, 15, y);
  y += 6;
  doc.text(`Microchip: ${ejemplar.microchip || "-"}`, 15, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("CEDENTE (Vendedor)", 15, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  doc.text(`Nombre: ${vendedor?.nombre || "-"}`, 15, y);
  y += 6;
  doc.text(`N° de Socio / DNI: ${vendedor?.identificacion || "-"}`, 15, y);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("CESIONARIO (Comprador)", 15, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  doc.text(`Nombre: ${comprador?.nombre || "-"}`, 15, y);
  y += 6;
  doc.text(`N° de Socio / DNI: ${comprador?.identificacion || "-"}`, 15, y);

  y += 18;
  doc.setFontSize(9);
  doc.text("Firma Cedente: ___________________________", 15, y);
  y += 15;
  doc.text("Firma Cesionario: _________________________", 15, y);

  const urlVerificacion = `https://tu-plataforma.com/verificar-transferencia/${ejemplar.poa || ""}`;
  await agregarQR(doc, urlVerificacion);
  pie(doc);

  doc.save(`Transferencia_${(ejemplar.nombre || "ejemplar").replace(/\s+/g, "_")}.pdf`);
}

// ============================================
// CERTIFICADO DE CAMADA
// Uso: generarCertificadoCamada(camada, padre, madre, cachorros)
// camada: { codigo, fecha }
// cachorros: array de { nombre, sexo, poa } (puede venir vacío)
// ============================================
export async function generarCertificadoCamada(camada, padre, madre, cachorros = []) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  encabezado(doc, "CERTIFICADO DE CAMADA");

  let y = 45;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Camada: ${camada?.codigo || "-"}`, 15, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(`Fecha de nacimiento: ${camada?.fecha || "-"}`, 15, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("PADRES", 15, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.text(`Padre: ${padre?.nombre || "No disponible"}  (POA ${padre?.poa || "-"})`, 15, y);
  y += 6;
  doc.text(`Madre: ${madre?.nombre || "No disponible"}  (POA ${madre?.poa || "-"})`, 15, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("CACHORROS", 15, y);
  doc.setFont("helvetica", "normal");
  y += 8;

  if (cachorros.length === 0) {
    doc.text("Sin cachorros registrados en el sistema.", 15, y);
  } else {
    cachorros.forEach((c) => {
      doc.text(`- ${c.nombre || "Sin nombre"}  |  Sexo: ${c.sexo || "-"}  |  POA: ${c.poa || "-"}`, 15, y);
      y += 6;
    });
  }

  const urlVerificacion = `https://tu-plataforma.com/verificar-camada/${camada?.codigo || ""}`;
  await agregarQR(doc, urlVerificacion);
  pie(doc);

  doc.save(`Camada_${(camada?.codigo || "camada").replace(/\s+/g, "_")}.pdf`);
}