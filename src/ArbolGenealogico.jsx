import React, { useState } from 'react';

// ============================================
// ÁRBOL GENEALÓGICO INTERACTIVO
// ============================================

export const damianData = {
  nombre: "DAMIÁN VON DER GRUBEM LAND",
  poa: "400683",
  nacimiento: "15/8/2025",
  criador: "Posa Rubén Miguel",
  padre: {
    nombre: "FIGO VON FEZ",
    poa: "—",
    padre: { nombre: "TYSON VOM KÖTTERSBUSCH", poa: "—" },
    madre: { nombre: "VA4 QUENAY DE LA FOLGORE", poa: "—" },
  },
  madre: {
    nombre: "ASIA VON BLAUEN VOGEL",
    poa: "—",
    padre: { nombre: "INLER DEGLI ACHEI", poa: "—" },
    madre: { nombre: "ULKAN MAIKHUS / ARRE VOM HÜHNEGRAB", poa: "—" },
  },
};

function NodoPerro({ data, nivel, onClick }) {
  const colores = {
    0: "bg-amber-100 border-amber-400",
    1: "bg-blue-50 border-blue-300",
    2: "bg-slate-50 border-slate-300",
  };
  return (
    <div
      onClick={() => onClick(data)}
      className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-center shadow-sm hover:shadow-md transition-all ${colores[nivel]}`}
      style={{ minWidth: nivel === 0 ? 180 : nivel === 1 ? 150 : 130 }}
    >
      <p className={`font-semibold leading-tight ${nivel === 0 ? "text-sm" : "text-xs"}`}>
        {data.nombre}
      </p>
      {data.poa && data.poa !== "—" && (
        <p className="text-[10px] text-gray-500 mt-0.5">POA {data.poa}</p>
      )}
    </div>
  );
}

export default function ArbolGenealogico({ ejemplar = damianData }) {
  const [seleccionado, setSeleccionado] = useState(null);
  const coefConsanguinidad = 0.0;

  return (
    <div className="w-full p-6 bg-white rounded-xl border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Árbol Genealógico</h3>
        <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
          Coeficiente de consanguinidad: <strong>{coefConsanguinidad}%</strong>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <NodoPerro data={{ nombre: ejemplar.nombre, poa: ejemplar.poa }} nivel={0} onClick={setSeleccionado} />
        <div className="w-px h-4 bg-gray-300 -mt-6" />
        <div className="flex gap-16 relative">
          <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-32 h-px bg-gray-300" />
          <div className="flex flex-col items-center gap-4">
            <NodoPerro data={ejemplar.padre} nivel={1} onClick={setSeleccionado} />
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex gap-6 relative">
              <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-16 h-px bg-gray-300" />
              <NodoPerro data={ejemplar.padre.padre} nivel={2} onClick={setSeleccionado} />
              <NodoPerro data={ejemplar.padre.madre} nivel={2} onClick={setSeleccionado} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <NodoPerro data={ejemplar.madre} nivel={1} onClick={setSeleccionado} />
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex gap-6 relative">
              <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-16 h-px bg-gray-300" />
              <NodoPerro data={ejemplar.madre.padre} nivel={2} onClick={setSeleccionado} />
              <NodoPerro data={ejemplar.madre.madre} nivel={2} onClick={setSeleccionado} />
            </div>
          </div>
        </div>
      </div>

      {seleccionado && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <p className="font-semibold">{seleccionado.nombre}</p>
          <p className="text-sm text-gray-600">POA: {seleccionado.poa || "No disponible en este nivel"}</p>
          <button onClick={() => setSeleccionado(null)} className="mt-2 text-xs text-blue-600 hover:underline">
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}