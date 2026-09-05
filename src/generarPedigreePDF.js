import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generarPedigreePDF(ejemplar, padre, madre, abueloPP, abueloPM, abueloMP, abueloMM) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFillColor(20, 40, 30);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CLUB ARGENTINO DE CRIADORES DEL PERRO OVEJERO ALEMÁN", 105, 12, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("CERTIFICADO DE PEDIGREE OFICIAL", 105, 20, { align: "center" });

  doc.setTextColor(0, 0, 0);

  let y = 42;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(ejemplar.nombre || "Sin nombre", 15, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`POA: ${ejemplar.poa || "-"}`, 15, y);
  y += 6;
  doc.text(`Fecha de nacimiento: ${ejemplar.nacimiento || "-"}`, 15, y);
  y += 6;
  doc.text(`Criador ID: ${ejemplar.criadorId || "-"}`, 15, y);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("GENEALOGÍA", 15, y);
  doc.setFont("helvetica", "normal");
  y += 8;

  doc.setFontSize(9);
  doc.text(`Padre: ${padre?.nombre || "No disponible"}`, 15, y);
  y += 5;
  doc.text(`  Abuelo paterno: ${abueloPP?.nombre || "No disponible"}`, 20, y);
  y += 5;
  doc.text(`  Abuela paterna: ${abueloPM?.nombre || "No disponible"}`, 20, y);
  y += 8;

  doc.text(`Madre: ${madre?.nombre || "No disponible"}`, 15, y);
  y += 5;
  doc.text(`  Abuelo materno: ${abueloMP?.nombre || "No disponible"}`, 20, y);
  y += 5;
  doc.text(`  Abuela materna: ${abueloMM?.nombre || "No disponible"}`, 20, y);

  const urlVerificacion = `https://tu-plataforma.com/verificar/${ejemplar.poa || ""}`;
  const qrDataUrl = await QRCode.toDataURL(urlVerificacion, { margin: 1, width: 200 });
  doc.addImage(qrDataUrl, "PNG", 160, 40, 35, 35);
  doc.setFontSize(7);
  doc.text("Escaneá para verificar", 165, 78);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Documento generado digitalmente. Válido con código QR de verificación. Emitido: ${new Date().toLocaleDateString("es-AR")}`,
    15,
    285
  );

  doc.save(`Pedigree_${(ejemplar.nombre || "ejemplar").replace(/\s+/g, "_")}.pdf`);
}