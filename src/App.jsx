import { useState, useMemo } from "react";
import {
  LayoutDashboard, Dog, Users, Building2, Baby, ClipboardList,
  Trophy, Award, Stethoscope, FolderOpen, Wallet, Landmark, UserCog,
  Settings, Search, Bell, ChevronDown, ChevronLeft, ChevronRight, Menu, X,
  ArrowLeft, ShieldCheck, History, Filter, Plus, Check, Circle,
  FileText, CalendarDays, MapPin, Gavel, AlertTriangle, CheckCircle2,
  Layers, ScrollText, BadgeCheck, ExternalLink,
  Scale, PawPrint, ClipboardCheck, Info
} from "lucide-react";
import ArbolGenealogico, { damianData } from './ArbolGenealogico';
import { generarPedigreePDF } from './generarPedigreePDF';
import { generarCertificadoTransferencia } from './generarCertificadoTransferencia';
import { generarCertificadoCamada } from './generarCertificadoCamada';

/* =========================================================================
   POA DIGITAL — DEMO
   Fuente de datos: relevamiento documental real del Club (aranceles,
   categorías, reglamento de torneo). Personas y ejemplares son ficticios
   y están marcados como DEMO en toda la interfaz.
   ========================================================================= */

/* -------------------------- DATA MODEL (MOCK) --------------------------- */

const ORG = {
  nombre: "Club Argentino de Criadores del Perro Ovejero Alemán",
  sigla: "POA",
  personeria: "10 de agosto de 1944",
  domicilio: "Adolfo Alsina 1163, Capital Federal, Buenos Aires",
  plan: "Profesional",
};

const FILIALES = [
  { id: "coa", nombre: "Club Cordobés del Perro Ovejero Alemán", sigla: "COA", ciudad: "Córdoba" },
  { id: "arcoa", nombre: "ARCOA", sigla: "ARCOA", ciudad: "Rosario" },
  { id: "aspoa", nombre: "ASPOA", sigla: "ASPOA", ciudad: "Buenos Aires" },
  { id: "tucuman", nombre: "Club Tucumano", sigla: "C. TUCUMANO", ciudad: "San Miguel de Tucumán" },
  { id: "amoa", nombre: "Club Amoa", sigla: "AMOA", ciudad: "Buenos Aires" },
  { id: "ajpoa", nombre: "AJPOA", sigla: "AJPOA", ciudad: "Jujuy" },
  { id: "coane", nombre: "Club Coane", sigla: "COANE", ciudad: "Buenos Aires" },
  { id: "rafaela", nombre: "Agrupación Rafaela", sigla: "RAFAELA", ciudad: "Rafaela" },
  { id: "argüello", nombre: "Agrupación Juan Carlos Argüello", sigla: "J.C. ARGÜELLO", ciudad: "Córdoba" },
  { id: "libertad", nombre: "Agrupación Libertad", sigla: "LIBERTAD", ciudad: "Granadero Baigorria" },
  { id: "squadra", nombre: "La Squadra", sigla: "LA SQUADRA", ciudad: "Buenos Aires" },
  { id: "cpoa", nombre: "CPOA", sigla: "CPOA", ciudad: "Buenos Aires" },
];

const PERSONAS = {
  p1: { id: "p1", nombre: "Juan Example", dni: "20.111.222", domicilio: "Ruta 5 Km 12", localidad: "Río Cuarto", provincia: "Córdoba", cp: "5800", pais: "Argentina", telefono: "351-000-0001", email: "juan.example@demo.poa", esSocio: true, nroSocio: "21800" },
  p2: { id: "p2", nombre: "María Example", dni: "30.222.333", domicilio: "Av. Siempre Viva 742", localidad: "La Plata", provincia: "Buenos Aires", cp: "1900", pais: "Argentina", telefono: "221-000-0002", email: "maria.example@demo.poa", esSocio: true, nroSocio: "22368" },
  p3: { id: "p3", nombre: "Carlos Demo", dni: "18.444.555", domicilio: "Calle Falsa 123", localidad: "Rosario", provincia: "Santa Fe", cp: "2000", pais: "Argentina", telefono: "341-000-0003", email: "carlos.demo@demo.poa", esSocio: true, nroSocio: "19045" },
  p4: { id: "p4", nombre: "Ana Demo", dni: "35.666.777", domicilio: "Los Aromos 88", localidad: "San Miguel de Tucumán", provincia: "Tucumán", cp: "4000", pais: "Argentina", telefono: "381-000-0004", email: "ana.demo@demo.poa", esSocio: true, nroSocio: "22537" },
  p5: { id: "p5", nombre: "Lucía Demo", dni: "22.888.999", domicilio: "Diagonal 3", localidad: "Córdoba", provincia: "Córdoba", cp: "5000", pais: "Argentina", telefono: "351-000-0005", email: "lucia.demo@demo.poa", esSocio: false, rol: "Juez" },
  p6: { id: "p6", nombre: "Diego Demo", dni: "27.101.202", domicilio: "Cmte. Martín Quenón 825", localidad: "Río Cuarto", provincia: "Córdoba", cp: "5800", pais: "Argentina", telefono: "358-484-9569", email: "diego.demo@demo.poa", esSocio: false, rol: "Veterinario radiólogo" },
};

const CRIADEROS = {
  c1: { id: "c1", afijo: "Von Example", titularId: "p1", registroNacional: "AF-1988", registroInternacional: "INT-3321", estado: "Activo" },
  c2: { id: "c2", afijo: "De Los Demo", titularId: "p3", registroNacional: "AF-2041", registroInternacional: "—", estado: "Activo" },
};

// perros — id, poa, nombre, sexo, nacimiento, pelo, color, señas, criadorId, propietarioId,
// microchip, tatuaje, estado, padreId, madreId, seleccion, cadera, codo, dentario, trabajo[], exposiciones[]
const PERROS = {
  abuelo_p1: { id: "abuelo_p1", poa: "POA 10050", nombre: "REX VON ALTBACH", sexo: "Macho", nacimiento: "2016-04-02", pelo: "Corto", color: "Negro y fuego", criadorId: null, propietarioId: null, microchip: "DEMO-939000100001", tatuaje: "DEMO-AA001", estado: "Histórico", padreId: null, madreId: null, seleccion: { clase: "Clase I", resultado: "Excelente" }, cadera: "Normal", codo: "Normal" },
  abuela_p1: { id: "abuela_p1", poa: "POA 10051", nombre: "LUNA VON ALTBACH", sexo: "Hembra", nacimiento: "2017-01-19", pelo: "Corto", color: "Gris carbón", criadorId: null, propietarioId: null, microchip: "DEMO-939000100002", tatuaje: "DEMO-AA002", estado: "Histórico", padreId: null, madreId: null, seleccion: { clase: "Clase I", resultado: "Muy Bueno" }, cadera: "Casi Normal", codo: "Normal" },
  abuelo_m1: { id: "abuelo_m1", poa: "POA 10090", nombre: "THOR VON EXAMPLE", sexo: "Macho", nacimiento: "2016-08-11", pelo: "Corto", color: "Negro", criadorId: "c1", propietarioId: "p1", microchip: "DEMO-939000100003", tatuaje: "DEMO-AA003", estado: "Histórico", padreId: null, madreId: null, seleccion: { clase: "Clase I", resultado: "Excelente" }, cadera: "Normal", codo: "Todavía permitido" },
  abuela_m1: { id: "abuela_m1", poa: "POA 10091", nombre: "GALA VON EXAMPLE", sexo: "Hembra", nacimiento: "2017-03-27", pelo: "Corto", color: "Negro y fuego", criadorId: "c1", propietarioId: "p1", microchip: "DEMO-939000100004", tatuaje: "DEMO-AA004", estado: "Histórico", padreId: null, madreId: null, seleccion: { clase: "Clase I", resultado: "Muy Bueno" }, cadera: "Normal", codo: "Normal" },

  padre1: { id: "padre1", poa: "POA 12001", nombre: "IKER VON EXAMPLE", sexo: "Macho", nacimiento: "2019-05-06", pelo: "Corto", color: "Negro y fuego", criadorId: "c1", propietarioId: "p1", microchip: "DEMO-939000111111", tatuaje: "DEMO-XA0001", estado: "Activo", padreId: "abuelo_p1", madreId: "abuela_p1", seleccion: { clase: "Clase I IGP1 BH*", resultado: "Excelente" }, cadera: "Normal", codo: "Normal", dentario: "Aprobado", trabajo: [{ tipo: "BH", resultado: "Aprobado", fecha: "2020-09-10" }, { tipo: "IGP1", resultado: "Aprobado", fecha: "2021-04-18" }] },
  madre1: { id: "madre1", poa: "POA 12002", nombre: "FRIDA VON EXAMPLE", sexo: "Hembra", nacimiento: "2020-02-14", pelo: "Corto", color: "Negro y fuego", criadorId: "c1", propietarioId: "p1", microchip: "DEMO-939000111112", tatuaje: "DEMO-XA0002", estado: "Activo", padreId: "abuelo_m1", madreId: "abuela_m1", seleccion: { clase: "Clase I BH*", resultado: "Muy Bueno" }, cadera: "Casi Normal", codo: "Normal", dentario: "Aprobado", trabajo: [{ tipo: "BH", resultado: "Aprobado", fecha: "2021-06-01" }] },

  max: {
    id: "max", poa: "POA 400683", nombre: "DAMIÁN VON DER GRUBEM LAND", sexo: "Macho", nacimiento: "2024-03-14",
    pelo: "Corto", color: "Negro y fuego", señas: "Sin señas particulares",
    criadorId: "c1", propietarioId: "p2", propietarioAnteriorId: "p1",
    microchip: "DEMO-939000123456", tatuaje: "DEMO-ABC123", estado: "Activo",
    padreId: "padre1", madreId: "madre1", camadaId: "cam1",
    seleccion: { clase: "Clase I", resultado: "Muy Bueno", fecha: "2026-02-08", juezId: "p5", lugar: "Córdoba" },
    cadera: "Normal", codoResultado: "Normal", codo: "Normal", dentario: "Aprobado",
    diagnosticos: [
      { tipo: "Cadera", resultado: "Normal", fecha: "2025-11-02", veterinarioId: "p6", ambito: "Nacional", estado: "Validado" },
      { tipo: "Codo", resultado: "Normal", fecha: "2025-11-02", veterinarioId: "p6", ambito: "Nacional", estado: "Validado" },
      { tipo: "Dentario", resultado: "Aprobado", fecha: "2025-06-20", veterinarioId: "p6", ambito: "Nacional", estado: "Validado" },
    ],
    trabajo: [{ tipo: "BH", resultado: "Aprobado", fecha: "2026-01-15" }],
    exposiciones: [{ expoId: "e1", categoria: "Cuarta", calificacion: "Excelente", puesto: 1 }],
    historial: [
      { propietarioId: "p1", desde: "2024-03-14", hasta: "2026-01-20", motivo: "Nacimiento — criador" },
      { propietarioId: "p2", desde: "2026-01-20", hasta: null, motivo: "Transferencia TR-2026-00124" },
    ],
  },

  hermano1: { id: "hermano1", poa: "POA 45873", nombre: "NALA VON EXAMPLE", sexo: "Hembra", nacimiento: "2024-03-14", pelo: "Corto", color: "Negro y fuego", criadorId: "c1", propietarioId: "p3", microchip: "DEMO-939000123457", tatuaje: "DEMO-ABC124", estado: "Activo", padreId: "padre1", madreId: "madre1", camadaId: "cam1", seleccion: null, cadera: null, codo: null },
  hermano2: { id: "hermano2", poa: "POA 45874", nombre: "ROCKY VON EXAMPLE", sexo: "Macho", nacimiento: "2024-03-14", pelo: "Corto", color: "Negro", criadorId: "c1", propietarioId: "p4", microchip: "DEMO-939000123458", tatuaje: "DEMO-ABC125", estado: "Activo", padreId: "padre1", madreId: "madre1", camadaId: "cam1", seleccion: null, cadera: null, codo: null },
};

const CAMADAS = {
  cam1: { id: "cam1", codigo: "CAM-2026-001", padreId: "padre1", madreId: "madre1", criadorId: "c1", fechaServicio: "2023-12-28", fechaNacimiento: "2024-03-14", machos: 3, hembras: 3, cachorroIds: ["max", "hermano1", "hermano2"], estado: "Inscripta" },
};

const SOCIOS = {
  s1: { id: "s1", personaId: "p1", nroSocio: "21800", categoria: "Activo", filialId: "coa", estado: "Activo", ultimaCuota: "2025-09", cuotas: [
    { periodo: "2025-11", importe: 13600, vencimiento: "2025-11-10", estado: "Pagada", fechaPago: "2025-11-05", metodo: "Débito automático" },
    { periodo: "2025-12", importe: 13600, vencimiento: "2025-12-10", estado: "Pagada", fechaPago: "2025-12-08", metodo: "Débito automático" },
    { periodo: "2026-01", importe: 13600, vencimiento: "2026-01-10", estado: "Pendiente", fechaPago: null, metodo: "—" },
  ] },
  s2: { id: "s2", personaId: "p2", nroSocio: "22368", categoria: "Activo", filialId: "aspoa", estado: "Pendiente", ultimaCuota: "2025-10", cuotas: [
    { periodo: "2025-12", importe: 13600, vencimiento: "2025-12-10", estado: "Vencida", fechaPago: null, metodo: "—" },
    { periodo: "2026-01", importe: 13600, vencimiento: "2026-01-10", estado: "Pendiente", fechaPago: null, metodo: "—" },
  ] },
  s3: { id: "s3", personaId: "p3", nroSocio: "19045", categoria: "Vitalicio", filialId: "arcoa", estado: "Activo", ultimaCuota: "—", cuotas: [] },
  s4: { id: "s4", personaId: "p4", nroSocio: "22537", categoria: "Cadete", filialId: "tucuman", estado: "Moroso", ultimaCuota: "2025-06", cuotas: [
    { periodo: "2025-07", importe: 6800, vencimiento: "2025-07-10", estado: "Vencida", fechaPago: null, metodo: "—" },
  ] },
};

const EXPOSICIONES = {
  e1: { id: "e1", nombre: "4ta Fecha — Torneo Regional Córdoba", fecha: "2026-03-15", club: "COA", lugar: "Villa Santa Cruz del Lago, Córdoba", juezId: "p5", inscriptos: 62, estado: "Finalizada" },
  e2: { id: "e2", nombre: "Sieger Argentino 2026", fecha: "2026-05-10", club: "POA", lugar: "Buenos Aires", juezId: "p5", inscriptos: 148, estado: "Próxima" },
  e3: { id: "e3", nombre: "5ta Fecha — Torneo Regional Córdoba", fecha: "2026-07-05", club: "COA", lugar: "Córdoba Capital", juezId: "p5", inscriptos: 0, estado: "Próxima" },
};

const CATEGORIAS_EXPO = [
  { id: "sexta", nombre: "Sexta", desde: 4, hasta: 6, unidad: "meses" },
  { id: "quinta", nombre: "Quinta", desde: 6, hasta: 9, unidad: "meses" },
  { id: "cuarta", nombre: "Cuarta", desde: 9, hasta: 12, unidad: "meses" },
  { id: "tercera", nombre: "Tercera", desde: 12, hasta: 18, unidad: "meses" },
  { id: "segunda", nombre: "Segunda", desde: 18, hasta: 24, unidad: "meses" },
  { id: "seleccionados", nombre: "Seleccionados", desde: 24, hasta: null, unidad: "meses" },
];

const CATALOGO_E1 = [
  { nro: 1, perroId: "max", categoria: "Cuarta", sexo: "Macho", pelo: "Corto", agrupacion: "COA" },
  { nro: 2, perroId: "hermano1", categoria: "Cuarta", sexo: "Hembra", pelo: "Corto", agrupacion: "COA" },
  { nro: 3, perroId: "hermano2", categoria: "Cuarta", sexo: "Macho", pelo: "Corto", agrupacion: "ARCOA" },
  { nro: 4, perroId: "padre1", categoria: "Seleccionados", sexo: "Macho", pelo: "Corto", agrupacion: "COA" },
  { nro: 5, perroId: "madre1", categoria: "Seleccionados", sexo: "Hembra", pelo: "Corto", agrupacion: "COA" },
];

const TORNEOS = {
  t1: {
    id: "t1", nombre: "Torneo Interagrupaciones — Provincia de Córdoba 2026",
    fechas: [
      { nro: 1, mes: "Marzo", sede: "Río Cuarto", juezId: "p5" },
      { nro: 2, mes: "Mayo", sede: "Córdoba (c/prueba de defensa)", juezId: "p5" },
      { nro: 3, mes: "Julio", sede: "Córdoba", juezId: "p5" },
      { nro: 4, mes: "Septiembre", sede: "Córdoba", juezId: "p5" },
      { nro: 5, mes: "Noviembre", sede: "Córdoba (c/prueba de defensa)", juezId: "p5" },
    ],
    rankingAgrupaciones: [
      { agrupacion: "COA", puntos: 145 },
      { agrupacion: "ARCOA", puntos: 132 },
      { agrupacion: "ASPOA", puntos: 98 },
      { agrupacion: "Club Tucumano", puntos: 76 },
    ],
    rankingEjemplares: [
      { perroId: "padre1", categoria: "Machos Seleccionados", puntos: 61 },
      { perroId: "max", categoria: "Cuarta", puntos: 34 },
      { perroId: "madre1", categoria: "Hembras Seleccionadas", puntos: 29 },
    ],
  },
};

// Aranceles — dos versiones reales relevadas del Club (histórico, no editable retroactivamente)
const ARANCELES = [
  {
    id: "v2025-11", vigenteDesde: "2025-11-01", vigenteHasta: "2026-08-31", zona: "General / AMBA donde se indica",
    items: [
      { concepto: "Denuncia de Servicio (numerado)", socio: 58900, noSocio: 67400 },
      { concepto: "Denuncia de Servicio (para exterior)", socio: 117200, noSocio: 131400 },
      { concepto: "Denuncia de Servicio — hasta 30 días", socio: 24100, noSocio: 48200 },
      { concepto: "Denuncia de Servicio — más de 30 días", socio: 71800, noSocio: 102400, condicion: "Condicional" },
      { concepto: "Denuncia de Nacimiento — hasta 10 días", socio: 27900, noSocio: 55900 },
      { concepto: "Denuncia de Nacimiento — 11 a 20 días", socio: 47400, noSocio: 94900 },
      { concepto: "Denuncia de Nacimiento — más de 20 días", socio: 76200, noSocio: 152400, condicion: "Condicional" },
      { concepto: "Inscripción de Cría — hasta 70 días", socio: 24100, noSocio: 48200 },
      { concepto: "Inscripción de Cría — 71 a 90 días", socio: 43100, noSocio: 79200 },
      { concepto: "Inscripción de Cría — más de 90 días", socio: 76200, noSocio: 152400, condicion: "Condicional" },
      { concepto: "Adicional Reconocimiento Internacional (por cachorro)", socio: 4800, noSocio: 4800 },
      { concepto: "Tatuaje por cría", socio: 56000, noSocio: 56000, zona: "AMBA" },
      { concepto: "Colocación de Chip por cría", socio: 56000, noSocio: 56000, zona: "AMBA" },
      { concepto: "Tatuaje + Chip por cría", socio: 84800, noSocio: 84800, zona: "AMBA" },
      { concepto: "Colocación de Chip en Aptos para Cría", socio: 9700, noSocio: 9700, zona: "AMBA" },
      { concepto: "Valor del Chip", socio: 11100, noSocio: 11100 },
      { concepto: "Transferencia — hasta 180 días de vida", socio: 26900, noSocio: 53800 },
      { concepto: "Transferencia — hasta 360 días de vida", socio: 45700, noSocio: 91400 },
      { concepto: "Transferencia — más de 360 días de vida", socio: 56700, noSocio: 109000 },
      { concepto: "Pedigree — Original", socio: 42600, noSocio: 85200 },
      { concepto: "Pedigree — Duplicado", socio: 25300, noSocio: 25300 },
      { concepto: "Arrendamiento (válido por una cría)", socio: 121100, noSocio: 242200 },
      { concepto: "Inscripción de Otras Sociedades", socio: 213000, noSocio: 243000 },
      { concepto: "Registro de Afijo", socio: 128200, noSocio: 245900 },
      { concepto: "Registro de Afijo Internacional", socio: 64000, noSocio: 74000 },
      { concepto: "Apto para Cría", socio: 47900, noSocio: 78400 },
      { concepto: "Selección", socio: 89200, noSocio: 138000 },
      { concepto: "Examen de Adiestramiento BH/BH*/Test de Talento/StPr", socio: 47900, noSocio: 78400 },
      { concepto: "Examen de Adiestramiento IGP–IFH", socio: 89200, noSocio: 155600 },
      { concepto: "Certificación dentaria (15 meses cumplidos)", socio: 10300, noSocio: 12500 },
      { concepto: "Diagnóstico DCF o Codo — Nacional", socio: 21400, noSocio: 24800 },
      { concepto: "Diagnóstico DCF o Codo — Internacional", socio: 165000, noSocio: 178500 },
      { concepto: "Cuota social — Activo", socio: 11800, noSocio: null },
      { concepto: "Cuota social — Cadete", socio: 5900, noSocio: null },
      { concepto: "Cuota social — Activo Familiar", socio: 5900, noSocio: null },
      { concepto: "Cuota de ingreso", socio: 0, noSocio: null },
    ],
  },
  {
    id: "v2026-09", vigenteDesde: "2026-09-01", vigenteHasta: null, zona: "General / AMBA donde se indica",
    items: [
      { concepto: "Denuncia de Servicio (numerado)", socio: 68200, noSocio: 77900 },
      { concepto: "Denuncia de Servicio (para exterior)", socio: 136500, noSocio: 152200 },
      { concepto: "Denuncia de Servicio — hasta 30 días", socio: 27800, noSocio: 55600 },
      { concepto: "Denuncia de Servicio — más de 30 días", socio: 82900, noSocio: 118200, condicion: "Condicional" },
      { concepto: "Denuncia de Nacimiento — hasta 10 días", socio: 32200, noSocio: 64400 },
      { concepto: "Denuncia de Nacimiento — 11 a 20 días", socio: 54800, noSocio: 109600 },
      { concepto: "Denuncia de Nacimiento — más de 20 días", socio: 88000, noSocio: 176000, condicion: "Condicional" },
      { concepto: "Inscripción de Cría + pedigree digital — hasta 70 días", socio: 57800, noSocio: 85600 },
      { concepto: "Inscripción de Cría + pedigree digital — 71 a 90 días", socio: 79800, noSocio: 121450 },
      { concepto: "Inscripción de Cría + pedigree digital — más de 90 días", socio: 118000, noSocio: 206000, condicion: "Condicional" },
      { concepto: "Adicional Reconocimiento Internacional (por cachorro)", socio: 5600, noSocio: 5600 },
      { concepto: "Tatuaje por cría", socio: 64500, noSocio: 64500, zona: "AMBA" },
      { concepto: "Colocación de Chip por cría", socio: 64500, noSocio: 64500, zona: "AMBA" },
      { concepto: "Tatuaje + Chip por cría", socio: 97800, noSocio: 97800, zona: "AMBA" },
      { concepto: "Colocación de Chip en Aptos para Cría", socio: 11000, noSocio: 11000, zona: "AMBA" },
      { concepto: "Valor del Chip", socio: 12800, noSocio: 12800 },
      { concepto: "Transferencia", socio: 20000, noSocio: 30000 },
      { concepto: "Pedigree — Original", socio: 49300, noSocio: 98600 },
      { concepto: "Pedigree — Duplicado", socio: 29300, noSocio: 29300 },
      { concepto: "Arrendamiento", socio: 13650, noSocio: 27300 },
      { concepto: "Inscripción de Otras Sociedades", socio: 245700, noSocio: 280350 },
      { concepto: "Registro de Afijo", socio: 148000, noSocio: 284000 },
      { concepto: "Registro de Afijo Internacional", socio: 73900, noSocio: 85500 },
      { concepto: "Apto para Cría", socio: 55300, noSocio: 90500 },
      { concepto: "Selección", socio: 103000, noSocio: 159400 },
      { concepto: "Examen de Adiestramiento BH/BH*/Test de Talento/StPr", socio: 55300, noSocio: 90500 },
      { concepto: "Examen de Adiestramiento IGP–IFH", socio: 103000, noSocio: 179800 },
      { concepto: "Certificación dentaria (15 meses cumplidos)", socio: 11800, noSocio: 14500 },
      { concepto: "Diagnóstico DCF o Codo — Nacional", socio: 24700, noSocio: 28700 },
      { concepto: "Diagnóstico DCF o Codo — Internacional", socio: 190500, noSocio: 206200 },
      { concepto: "Cuota social — Activo", socio: 13600, noSocio: null },
      { concepto: "Cuota social — Cadete", socio: 6800, noSocio: null },
      { concepto: "Cuota social — Activo Familiar", socio: 6800, noSocio: null },
      { concepto: "Cuota de ingreso", socio: 0, noSocio: null },
    ],
  },
];

const TRAMITE_TIPOS = [
  "Transferencia", "Denuncia de servicio", "Denuncia de nacimiento", "Inscripción de cría",
  "Apto para cría", "Selección", "Pedigree", "Microchip", "Tatuaje", "Diagnóstico",
  "Certificación dentaria", "Afijo", "Arrendamiento", "Reconocimiento internacional",
  "Inscripción de otras sociedades",
];

const TRAMITES = {
  "TR-2026-00124": {
    id: "TR-2026-00124", tipo: "Transferencia", personaId: "p2", perroId: "max",
    fecha: "2026-01-22", estado: "En revisión", importe: 20000, responsable: "Secretaría POA",
    detalle: { titularAnteriorId: "p1", nuevoTitularId: "p2", fechaEntrega: "2026-01-20", fechaPresentacion: "2026-01-22", documentacion: ["Informe de Transferencia de Dominio", "Formulario de Cambio de Titularidad"], firmas: "Ambas partes — firmadas" },
    timeline: [
      { estado: "Solicitud recibida", fecha: "2026-01-22", ok: true },
      { estado: "Documentación cargada", fecha: "2026-01-22", ok: true },
      { estado: "En revisión", fecha: "2026-01-24", ok: "current" },
      { estado: "Aprobación", fecha: null, ok: false },
      { estado: "Finalización", fecha: null, ok: false },
    ],
  },
  "TR-2026-00098": { id: "TR-2026-00098", tipo: "Denuncia de servicio", personaId: "p1", perroId: "padre1", fecha: "2023-12-30", estado: "Finalizado", importe: 58900, responsable: "Secretaría POA", detalle: { reproductorId: "padre1", reproductoraId: "madre1", fechaServicio: "2023-12-28", nacionalExterior: "Nacional" }, timeline: [{ estado: "Solicitud recibida", fecha: "2023-12-30", ok: true }, { estado: "Documentación cargada", fecha: "2023-12-30", ok: true }, { estado: "En revisión", fecha: "2023-12-31", ok: true }, { estado: "Aprobación", fecha: "2024-01-02", ok: true }, { estado: "Finalización", fecha: "2024-01-02", ok: true }] },
  "TR-2026-00099": { id: "TR-2026-00099", tipo: "Denuncia de nacimiento", personaId: "p1", perroId: null, fecha: "2024-03-20", estado: "Finalizado", importe: 27900, responsable: "Secretaría POA", detalle: { camadaId: "cam1", machos: 3, hembras: 3 }, timeline: [{ estado: "Solicitud recibida", fecha: "2024-03-20", ok: true }, { estado: "Aprobación", fecha: "2024-03-22", ok: true }, { estado: "Finalización", fecha: "2024-03-22", ok: true }] },
  "TR-2026-00100": { id: "TR-2026-00100", tipo: "Inscripción de cría", personaId: "p1", perroId: "max", fecha: "2024-05-10", estado: "Finalizado", importe: 43100, responsable: "Secretaría POA", detalle: { camadaId: "cam1" }, timeline: [{ estado: "Solicitud recibida", fecha: "2024-05-10", ok: true }, { estado: "Aprobación", fecha: "2024-05-14", ok: true }, { estado: "Finalización", fecha: "2024-05-14", ok: true }] },
  "TR-2026-00131": { id: "TR-2026-00131", tipo: "Selección", personaId: "p1", perroId: "max", fecha: "2026-02-08", estado: "Aprobado", importe: 89200, responsable: "Comisión de Jueces", detalle: { juezId: "p5", clase: "Clase I", resultado: "Muy Bueno" }, timeline: [{ estado: "Solicitud recibida", fecha: "2026-02-01", ok: true }, { estado: "En revisión", fecha: "2026-02-05", ok: true }, { estado: "Aprobación", fecha: "2026-02-08", ok: true }, { estado: "Finalización", fecha: null, ok: false }] },
  "TR-2026-00140": { id: "TR-2026-00140", tipo: "Diagnóstico", personaId: "p2", perroId: "max", fecha: "2025-11-02", estado: "Observado", importe: 21400, responsable: "Secretaría POA", detalle: { tipo: "Cadera / Codo", veterinarioId: "p6", ambito: "Nacional" }, timeline: [{ estado: "Solicitud recibida", fecha: "2025-11-02", ok: true }, { estado: "En revisión", fecha: "2025-11-04", ok: true }, { estado: "Observado", fecha: "2025-11-06", ok: "current" }, { estado: "Finalización", fecha: null, ok: false }] },
  "TR-2026-00151": { id: "TR-2026-00151", tipo: "Afijo", personaId: "p3", perroId: null, fecha: "2026-02-15", estado: "Pendiente", importe: 148000, responsable: "Secretaría POA", detalle: { afijoPropuesto: "De Los Demo" }, timeline: [{ estado: "Solicitud recibida", fecha: "2026-02-15", ok: true }, { estado: "En revisión", fecha: null, ok: false }] },
  "TR-2026-00088": { id: "TR-2026-00088", tipo: "Apto para cría", personaId: "p1", perroId: "padre1", fecha: "2021-04-01", estado: "Finalizado", importe: 47900, responsable: "Secretaría POA", detalle: {}, timeline: [{ estado: "Solicitud recibida", fecha: "2021-04-01", ok: true }, { estado: "Finalización", fecha: "2021-04-10", ok: true }] },
  "TR-2026-00160": { id: "TR-2026-00160", tipo: "Reconocimiento internacional", personaId: "p1", perroId: "max", fecha: "2024-05-10", estado: "Rechazado", importe: 5600, responsable: "Secretaría POA", detalle: { motivoRechazo: "Documentación incompleta (DEMO)" }, timeline: [{ estado: "Solicitud recibida", fecha: "2024-05-10", ok: true }, { estado: "En revisión", fecha: "2024-05-12", ok: true }, { estado: "Rechazado", fecha: "2024-05-15", ok: "reject" }] },
};

const DOCUMENTOS = [
  { id: "d1", tipo: "Pedigree", nombre: "Pedigree — MAX VON EXAMPLE (POA 400683)", relacion: { perroId: "max" }, estado: "Validado", fecha: "2024-05-14" },
  { id: "d2", tipo: "Informe de transferencia", nombre: "Informe de Transferencia de Dominio — TR-2026-00124", relacion: { tramiteId: "TR-2026-00124", perroId: "max" }, estado: "Pendiente", fecha: "2026-01-22" },
  { id: "d3", tipo: "Solicitud de socio", nombre: "Solicitud de Socio — María Example", relacion: { personaId: "p2" }, estado: "Validado", fecha: "2023-08-01" },
  { id: "d4", tipo: "Certificado", nombre: "Certificado de Diagnóstico DCF/Codo — MAX VON EXAMPLE", relacion: { perroId: "max", tramiteId: "TR-2026-00140" }, estado: "Observado", fecha: "2025-11-02" },
  { id: "d5", tipo: "Catálogo", nombre: "Catálogo — 4ta Fecha Torneo Regional Córdoba", relacion: { exposicionId: "e1" }, estado: "Validado", fecha: "2026-03-15" },
  { id: "d6", tipo: "Reglamento", nombre: "Reglamento Torneo Interagrupaciones — Córdoba 2026", relacion: {}, estado: "Validado", fecha: "2026-01-01" },
  { id: "d7", tipo: "Arancel", nombre: "Tabla de Aranceles — vigente desde 01/09/2026", relacion: {}, estado: "Validado", fecha: "2026-09-01" },
];

const ROLES = [
  { id: "superadmin", nombre: "Superadmin", desc: "Administra organizaciones, usuarios, módulos y configuración global." },
  { id: "admin", nombre: "Admin POA", desc: "Gestión completa dentro de la organización POA." },
  { id: "secretaria", nombre: "Secretaría", desc: "Carga y resuelve trámites, socios y documentación." },
  { id: "filial", nombre: "Filial", desc: "Gestiona datos de su propia agrupación." },
  { id: "criador", nombre: "Criador", desc: "Ve y gestiona sus propios ejemplares, camadas y trámites." },
  { id: "socio", nombre: "Socio", desc: "Consulta su ficha, cuotas y trámites." },
  { id: "juez", nombre: "Juez", desc: "Carga resultados de exposición y selección." },
  { id: "veterinario", nombre: "Veterinario", desc: "Carga diagnósticos de cadera, codo y dentario." },
  { id: "publico", nombre: "Consulta pública", desc: "Accede únicamente al Portal Público." },
];

const AUDITORIA = [
  { id: "a1", usuario: "secretaria.demo", accion: "Actualizó propietario", entidad: "Ejemplar POA 400683", fecha: "2026-01-24 10:12", anterior: "Juan Example", nuevo: "María Example" },
  { id: "a2", usuario: "veterinario.demo", accion: "Cargó diagnóstico", entidad: "Ejemplar POA 400683 — Cadera", fecha: "2025-11-02 09:03", anterior: "—", nuevo: "Normal" },
  { id: "a3", usuario: "admin.poa", accion: "Publicó nuevo período de aranceles", entidad: "Aranceles — vigente 01/09/2026", fecha: "2026-08-28 16:40", anterior: "v2025-11", nuevo: "v2026-09" },
  { id: "a4", usuario: "juez.demo", accion: "Cargó resultado de Selección", entidad: "Ejemplar POA 400683", fecha: "2026-02-08 12:00", anterior: "—", nuevo: "Clase I / Muy Bueno" },
];

/* ------------------------------ HELPERS ---------------------------------- */

const peso = (n) => n == null ? "—" : "$ " + n.toLocaleString("es-AR");
const fmtDate = (iso) => !iso ? "—" : new Date(iso + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const persona = (id) => PERSONAS[id];
const perro = (id) => id ? PERROS[id] : null;
const criadero = (id) => id ? CRIADEROS[id] : null;
const filial = (id) => FILIALES.find(f => f.id === id);
const exposicion = (id) => EXPOSICIONES[id];

function monthsBetween(a, b) {
  const d1 = new Date(a + "T00:00:00"), d2 = new Date(b + "T00:00:00");
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + (d2.getDate() >= d1.getDate() ? 0 : -1);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}
function categoriaPorEdad(nacimientoIso, refIso) {
  const m = monthsBetween(nacimientoIso, refIso);
  if (m < 4) return null;
  if (m <= 6) return "Sexta";
  if (m <= 9) return "Quinta";
  if (m <= 12) return "Cuarta";
  if (m <= 18) return "Tercera";
  if (m <= 24) return "Segunda";
  return "Seleccionados";
}
function arancelVigente(fechaIso) {
  const f = fechaIso || new Date().toISOString().slice(0, 10);
  return ARANCELES.slice().reverse().find(v => v.vigenteDesde <= f) || ARANCELES[0];
}
function buscarConcepto(version, texto) {
  return version.items.find(i => i.concepto.toLowerCase().includes(texto.toLowerCase()));
}

const STATUS_STYLE = {
  "Activo": "ok", "Aprobado": "ok", "Aprobada": "ok", "Finalizado": "ok", "Finalizada": "ok", "Validado": "ok", "Pagada": "ok", "Excelente": "ok",
  "Pendiente": "warn", "En revisión": "warn", "Próxima": "warn", "Muy Bueno": "warn", "Bueno": "warn",
  "Observado": "warn2", "Vencida": "danger", "Moroso": "danger", "Rechazado": "danger", "Inactivo": "muted", "Histórico": "muted", "Bonificada": "info", "Inscripta": "info",
};

/* ------------------------------ UI PRIMITIVES ----------------------------- */

function GlobalStyles() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        :root{
          --ink:#1B2330; --ink2:#242E3D; --ink3:#303B4D;
          --paper:#FFFFFF; --parchment:#F5F3EE; --hairline:#DED8C7; --hairline-2:#E7E2D4;
          --slate:#3D4451; --slate2:#6B7280; --slate3:#93989F;
          --oxblood:#7A2E2E; --oxblood-dark:#5C2222; --oxblood-tint:#F4E7E4;
          --brass:#A9812E; --brass-tint:#F6EDDA;
          --green:#3F6B4E; --green-tint:#E7EFE7;
          --amber:#B8863B; --amber-tint:#FBF0DE;
          --red:#A23B3B; --red-tint:#F6E6E4;
          --blue:#3A5A78; --blue-tint:#E7EEF3;
        }
        .poa-root{ font-family:'IBM Plex Sans',sans-serif; background:var(--parchment); color:var(--slate); }
        .poa-serif{ font-family:'Newsreader',serif; }
        .poa-mono{ font-family:'IBM Plex Mono',monospace; }
        .poa-card{ background:var(--paper); border:1px solid var(--hairline-2); border-radius:6px; }
        .poa-hairline{ border-color:var(--hairline-2); }
        .poa-scroll::-webkit-scrollbar{ width:8px; height:8px; }
        .poa-scroll::-webkit-scrollbar-thumb{ background:var(--hairline); border-radius:4px; }
        .poa-badge-ok{ background:var(--green-tint); color:var(--green); }
        .poa-badge-warn{ background:var(--amber-tint); color:var(--amber); }
        .poa-badge-warn2{ background:var(--brass-tint); color:var(--brass); }
        .poa-badge-danger{ background:var(--red-tint); color:var(--red); }
        .poa-badge-info{ background:var(--blue-tint); color:var(--blue); }
        .poa-badge-muted{ background:#EEEDE8; color:var(--slate2); }
        .poa-row:hover{ background:#FBFAF7; }
        .poa-nav-item{ transition: background-color .12s ease, color .12s ease; }
        .poa-focus:focus-visible{ outline:2px solid var(--brass); outline-offset:2px; }
      `}</style>
    </>
  );
}

function DemoPill({ className = "" }) {
  return (
    <span className={`poa-mono text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded border ${className}`}
      style={{ borderColor: "var(--brass)", color: "var(--brass)", background: "var(--brass-tint)" }}>
      Demo
    </span>
  );
}

function Badge({ children, tone }) {
  const cls = STATUS_STYLE[tone] || STATUS_STYLE[children] || "muted";
  return <span className={`poa-badge-${cls} text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap`}>{children}</span>;
}

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-[var(--slate3)] mb-0.5">{label}</div>
      <div className="text-sm text-[var(--ink)] truncate">{children ?? "—"}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[var(--oxblood)]" />}
        <h3 className="poa-serif text-[15px] text-[var(--ink)]">{children}</h3>
      </div>
      {action}
    </div>
  );
}

function Empty({ icon: Icon = Info, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 text-[var(--slate3)]">
      <Icon size={28} className="mb-2 opacity-60" />
      <div className="text-sm font-medium text-[var(--slate2)]">{title}</div>
      {sub && <div className="text-xs mt-1 max-w-xs">{sub}</div>}
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`text-left text-xs font-medium text-[var(--slate3)] uppercase tracking-wide px-3 py-2 border-b poa-hairline ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2.5 text-sm border-b poa-hairline align-middle ${className}`}>{children}</td>;
}

function MetricCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="poa-card p-4 flex items-start justify-between">
      <div>
        <div className="text-xs text-[var(--slate3)] mb-1">{label}</div>
        <div className="poa-serif text-2xl text-[var(--ink)]">{value}</div>
        {hint && <div className="text-xs text-[var(--slate3)] mt-1">{hint}</div>}
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--oxblood-tint)" }}>
        <Icon size={15} style={{ color: "var(--oxblood)" }} />
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-5 border-b poa-hairline overflow-x-auto poa-scroll">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`poa-focus shrink-0 py-2.5 text-sm border-b-2 transition-colors ${active === t.id ? "border-[var(--oxblood)] text-[var(--ink)] font-medium" : "border-transparent text-[var(--slate3)] hover:text-[var(--slate)]"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Timeline({ steps }) {
  return (
    <div className="flex flex-col">
      {steps.map((s, i) => {
        const isReject = s.ok === "reject";
        const isCurrent = s.ok === "current";
        const isDone = s.ok === true;
        const color = isReject ? "var(--red)" : isDone ? "var(--green)" : isCurrent ? "var(--amber)" : "var(--slate3)";
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: isDone ? "var(--green-tint)" : isCurrent ? "var(--amber-tint)" : isReject ? "var(--red-tint)" : "#EEEDE8" }}>
                {isDone ? <Check size={12} style={{ color }} /> : isReject ? <X size={12} style={{ color }} /> : <Circle size={7} fill={color} style={{ color }} />}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 min-h-[22px]" style={{ background: "var(--hairline)" }} />}
            </div>
            <div className="pb-5">
              <div className="text-sm font-medium" style={{ color: isReject ? "var(--red)" : "var(--ink)" }}>{s.estado}</div>
              <div className="text-xs text-[var(--slate3)]">{s.fecha ? fmtDate(s.fecha) : "Pendiente"}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DogChip({ p, onOpen, small }) {
  if (!p) return <span className="text-xs text-[var(--slate3)] italic">Sin dato en el registro</span>;
  return (
    <button onClick={() => onOpen(p.id)} className="poa-focus text-left hover:underline decoration-[var(--oxblood)] underline-offset-2">
      <span className={small ? "text-sm" : "text-sm font-medium"} style={{ color: "var(--ink)" }}>{p.nombre}</span>
      <span className="poa-mono text-[11px] text-[var(--slate3)] ml-1.5">{p.poa}</span>
    </button>
  );
}

function PedigreeCard({ id, onOpen, role }) {
  const p = perro(id);
  if (!p) {
    return (
      <div className="poa-card px-3 py-2 opacity-60">
        <div className="text-[10px] uppercase tracking-wide text-[var(--slate3)] mb-0.5">{role}</div>
        <div className="text-xs italic text-[var(--slate3)]">Sin dato en el registro</div>
      </div>
    );
  }
  return (
    <button onClick={() => onOpen(p.id)} className="poa-focus poa-card px-3 py-2 text-left hover:border-[var(--oxblood)] transition-colors w-full">
      <div className="text-[10px] uppercase tracking-wide text-[var(--slate3)] mb-0.5">{role}</div>
      <div className="text-sm font-medium text-[var(--ink)] leading-tight">{p.nombre}</div>
      <div className="poa-mono text-[11px] text-[var(--slate3)]">{p.poa}</div>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {p.seleccion && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--brass-tint)", color: "var(--brass)" }}>{p.seleccion.clase}</span>}
        {p.cadera && <span className="text-[10px] px-1.5 py-0.5 rounded poa-badge-muted">Cadera: {p.cadera}</span>}
        {p.codo && <span className="text-[10px] px-1.5 py-0.5 rounded poa-badge-muted">Codo: {p.codo}</span>}
      </div>
    </button>
  );
}

function PedigreeTree({ perroId, onOpen }) {
  const [solicitado, setSolicitado] = useState(false);
  const p = perro(perroId);
  if (!p) return <Empty title="Ejemplar no encontrado" />;
  const padre = perro(p.padreId), madre = perro(p.madreId);
  const abueloPP = padre ? perro(padre.padreId) : null, abuelaPP = padre ? perro(padre.madreId) : null;
  const abueloMM = madre ? perro(madre.padreId) : null, abuelaMM = madre ? perro(madre.madreId) : null;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-3 items-stretch">
        <div className="flex items-center">
          <PedigreeCard id={p.id} onOpen={onOpen} role="Ejemplar" />
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <PedigreeCard id={p.padreId} onOpen={onOpen} role="Padre" />
          <PedigreeCard id={p.madreId} onOpen={onOpen} role="Madre" />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <PedigreeCard id={padre?.padreId} onOpen={onOpen} role="Abuelo paterno" />
          <PedigreeCard id={padre?.madreId} onOpen={onOpen} role="Abuela paterna" />
          <PedigreeCard id={madre?.padreId} onOpen={onOpen} role="Abuelo materno" />
          <PedigreeCard id={madre?.madreId} onOpen={onOpen} role="Abuela materna" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-[var(--slate3)]">Genealogía visible: 2 generaciones. La estructura admite ampliarse a más generaciones cuando se conecte el registro histórico completo.</p>
        {solicitado ? (
  <p className="text-xs" style={{color:'#16a34a'}}>✓ Solicitud enviada — nos pondremos en contacto por correo</p>
) : (
  <button onClick={() => setSolicitado(true)} className="poa-focus text-xs font-medium px-3 py-1.5 rounded-md border">
    Solicitar Certificado de Origen físico
  </button>
)}
        <button onClick={() => generarPedigreePDF(p, padre, madre, abueloPP, perro(padre?.madreId), perro(madre?.padreId), abueloMM)} className="poa-focus text-xs font-medium px-3 py-1.5 rounded-md border" style={{marginLeft: '8px'}}>          Descargar Pedigree Digital (PDF)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ NAVIGATION -------------------------------- */

const NAV_GROUPS = [
  { items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Registro genealógico", items: [
      { id: "ejemplares", label: "Ejemplares", icon: Dog },
      { id: "criadores", label: "Criadores y Afijos", icon: Building2 },
      { id: "camadas", label: "Camadas", icon: Baby },
    ]
  },
  {
    label: "Institución", items: [
      { id: "socios", label: "Socios", icon: Users },
      { id: "filiales", label: "Filiales", icon: Landmark },
    ]
  },
  {
    label: "Gestión", items: [
      { id: "tramites", label: "Trámites", icon: ClipboardList },
      { id: "aranceles", label: "Pagos y Aranceles", icon: Wallet },
      { id: "diagnosticos", label: "Diagnósticos", icon: Stethoscope },
      { id: "documentos", label: "Documentos", icon: FolderOpen },
    ]
  },
  {
    label: "Deporte y cría", items: [
      { id: "exposiciones", label: "Exposiciones", icon: Award },
      { id: "torneos", label: "Torneos", icon: Trophy },
    ]
  },
  {
    label: "Sistema", items: [
      { id: "usuarios", label: "Usuarios", icon: UserCog },
      { id: "configuracion", label: "Configuración", icon: Settings },
    ]
  },
];

function Sidebar({ current, onNav, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const width = collapsed ? "w-[68px]" : "w-[248px]";
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full ${width} shrink-0 flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "var(--ink)" }}>
        <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b" style={{ borderColor: "var(--ink3)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--brass)" }}>
            <PawPrint size={16} color="var(--ink)" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="poa-serif text-white text-[15px] leading-none">POA Digital</div>
              <div className="text-[10px] text-white/50 mt-0.5">Panel de gestión</div>
            </div>
          )}
          <button className="md:hidden ml-auto text-white/70" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto poa-scroll py-3 px-2">
          {NAV_GROUPS.map((g, gi) => (
            <div key={gi} className="mb-3">
              {g.label && !collapsed && <div className="text-[10px] uppercase tracking-wide text-white/35 px-2.5 mb-1 mt-2">{g.label}</div>}
              {g.items.map(it => {
                const Icon = it.icon;
                const active = current === it.id;
                return (
                  <button key={it.id} onClick={() => { onNav(it.id); setMobileOpen(false); }}
                    title={collapsed ? it.label : undefined}
                    className={`poa-nav-item poa-focus w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm mb-0.5 ${active ? "text-white" : "text-white/60 hover:text-white/90 hover:bg-white/5"}`}
                    style={active ? { background: "var(--oxblood)" } : {}}>
                    <Icon size={16} className="shrink-0" />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t" style={{ borderColor: "var(--ink3)" }}>
          <button onClick={() => onNav("portal")} className="poa-focus w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm text-white/60 hover:text-white/90 hover:bg-white/5 mb-1">
            <ExternalLink size={16} className="shrink-0" />
            {!collapsed && <span>Portal público</span>}
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="poa-focus hidden md:flex w-full items-center gap-2.5 px-2.5 py-2 rounded text-sm text-white/50 hover:text-white/80 hover:bg-white/5">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Contraer menú</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function buildSearchIndex() {
  const idx = [];
  Object.values(PERROS).forEach(p => idx.push({ cat: "Perros", label: p.nombre, sub: `${p.poa} · ${p.microchip}`, action: { module: "ejemplarFicha", id: p.id } }));
  Object.values(SOCIOS).forEach(s => idx.push({ cat: "Socios", label: `Socio DEMO — ${persona(s.personaId)?.nombre}`, sub: `N.º ${s.nroSocio}`, action: { module: "socioFicha", id: s.id } }));
  Object.values(CRIADEROS).forEach(c => idx.push({ cat: "Criaderos", label: c.afijo, sub: persona(c.titularId)?.nombre, action: { module: "criaderoFicha", id: c.id } }));
  Object.values(TRAMITES).forEach(t => idx.push({ cat: "Trámites", label: t.id, sub: t.tipo, action: { module: "tramiteDetalle", id: t.id } }));
  Object.values(PERSONAS).forEach(p => idx.push({ cat: "Personas", label: p.nombre, sub: p.email, action: null }));
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

function GlobalSearch({ onNav }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const l = q.toLowerCase();
    return SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(l) || (r.sub || "").toLowerCase().includes(l)).slice(0, 8);
  }, [q]);
  const grouped = results.reduce((acc, r) => { (acc[r.cat] = acc[r.cat] || []).push(r); return acc; }, {});
  return (
    <div className="relative flex-1 max-w-md">
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border poa-hairline bg-[var(--parchment)]">
        <Search size={15} className="text-[var(--slate3)] shrink-0" />
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="Buscar perro, N.º POA, microchip, socio, criadero, trámite…"
          className="bg-transparent outline-none text-sm w-full placeholder:text-[var(--slate3)]" />
      </div>
      {open && q.trim() && (
        <div className="absolute mt-1 w-full poa-card shadow-lg z-50 max-h-80 overflow-y-auto poa-scroll" onMouseLeave={() => { }}>
          {results.length === 0 && <div className="p-3 text-sm text-[var(--slate3)]">Sin resultados para "{q}".</div>}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="border-b poa-hairline last:border-b-0">
              <div className="text-[10px] uppercase tracking-wide text-[var(--slate3)] px-3 pt-2 pb-1">{cat}</div>
              {items.map((r, i) => (
                <button key={i} disabled={!r.action} onClick={() => { if (r.action) { onNav(r.action); setOpen(false); setQ(""); } }}
                  className={`poa-row w-full text-left px-3 py-2 flex items-center justify-between ${r.action ? "" : "opacity-50 cursor-default"}`}>
                  <span className="text-sm text-[var(--ink)]">{r.label}</span>
                  <span className="text-xs text-[var(--slate3)] poa-mono">{r.sub}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

function Header({ onNav, onToggleMobile, breadcrumb, onBack }) {
  return (
    <header className="sticky top-0 z-20 bg-[var(--paper)] border-b poa-hairline">
      <div className="h-16 flex items-center gap-3 px-4 md:px-6">
        <button className="md:hidden text-[var(--ink)]" onClick={onToggleMobile}><Menu size={20} /></button>
        <GlobalSearch onNav={onNav} />
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <DemoPill />
          <button className="poa-focus relative text-[var(--slate2)] hover:text-[var(--ink)]"><Bell size={18} /><span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: "var(--oxblood)" }} /></button>
          <button className="poa-focus flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: "var(--slate)" }}>SP</div>
            <ChevronDown size={14} className="text-[var(--slate3)] hidden sm:block" />
          </button>
        </div>
      </div>
      {breadcrumb && breadcrumb.length > 1 && (
        <div className="flex items-center gap-1.5 px-4 md:px-6 pb-2.5 -mt-1 text-xs text-[var(--slate3)] overflow-x-auto poa-scroll">
          <button onClick={onBack} className="poa-focus flex items-center gap-1 text-[var(--slate2)] hover:text-[var(--oxblood)] shrink-0 mr-1">
            <ArrowLeft size={12} /> Volver
          </button>
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && <ChevronRight size={11} />}
              <span className={i === breadcrumb.length - 1 ? "text-[var(--ink)] font-medium" : ""}>{b}</span>
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

/* ------------------------------ DASHBOARD --------------------------------- */

function ActividadItem({ icon: Icon, text, time, tone = "info" }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `var(--${tone === "danger" ? "red" : tone === "warn" ? "amber" : tone === "ok" ? "green" : "blue"}-tint)` }}>
        <Icon size={13} style={{ color: `var(--${tone === "danger" ? "red" : tone === "warn" ? "amber" : tone === "ok" ? "green" : "blue"})` }} />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-[var(--ink)]">{text}</div>
        <div className="text-xs text-[var(--slate3)]">{time}</div>
      </div>
    </div>
  );
}

function Dashboard({ go }) {
  const tramitesArr = Object.values(TRAMITES);
  const porEstado = ["Pendiente", "En revisión", "Observado", "Aprobado", "Finalizado"].map(e => ({
    estado: e, n: tramitesArr.filter(t => t.estado === e).length,
  }));
  const proximas = Object.values(EXPOSICIONES).filter(e => e.estado === "Próxima");

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="poa-serif text-[26px] text-[var(--ink)]">Buenos días</h1>
        <p className="text-sm text-[var(--slate2)] mt-0.5">Panel general de POA Digital <DemoPill className="ml-1 align-middle" /></p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <MetricCard label="Ejemplares registrados" value={Object.keys(PERROS).length} icon={Dog} />
        <MetricCard label="Socios activos" value={Object.values(SOCIOS).filter(s => s.estado === "Activo").length} icon={Users} />
        <MetricCard label="Criaderos registrados" value={Object.keys(CRIADEROS).length} icon={Building2} />
        <MetricCard label="Trámites pendientes" value={tramitesArr.filter(t => ["Pendiente", "En revisión", "Observado"].includes(t.estado)).length} icon={ClipboardList} />
        <MetricCard label="Exposiciones próximas" value={proximas.length} icon={Award} />
        <MetricCard label="Camadas registradas" value={Object.keys(CAMADAS).length} icon={Baby} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="poa-card p-4 lg:col-span-1">
          <SectionTitle icon={History}>Actividad reciente</SectionTitle>
          <div className="divide-y poa-hairline">
            <ActividadItem icon={ClipboardList} text="Nueva transferencia recibida — MAX VON EXAMPLE (POA 400683)" time="Hace 2 días" tone="warn" />
            <ActividadItem icon={Stethoscope} text="Nuevo diagnóstico cargado — Cadera / Codo, MAX VON EXAMPLE" time="Hace 3 días" tone="info" />
            <ActividadItem icon={Baby} text="Nueva camada registrada — CAM-2026-001 (Von Example)" time="Hace 1 semana" tone="ok" />
            <ActividadItem icon={Users} text="Nuevo socio aprobado — Ana Demo (Cadete)" time="Hace 2 semanas" tone="ok" />
            <ActividadItem icon={Award} text="Nueva inscripción a exposición — Sieger Argentino 2026" time="Hace 3 semanas" tone="info" />
          </div>
        </div>

        <div className="poa-card p-4 lg:col-span-1">
          <SectionTitle icon={ClipboardList} action={<button onClick={() => go("tramites")} className="poa-focus text-xs text-[var(--oxblood)] font-medium">Ver todos</button>}>
            Trámites por estado
          </SectionTitle>
          <div className="space-y-2.5 mt-1">
            {porEstado.map(r => (
              <div key={r.estado}>
                <div className="flex justify-between text-xs mb-1"><span className="text-[var(--slate2)]">{r.estado}</span><span className="poa-mono text-[var(--ink)]">{r.n}</span></div>
                <div className="h-1.5 rounded-full bg-[#EEEDE8] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(r.n / tramitesArr.length) * 100}%`, background: "var(--oxblood)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="poa-card p-4 lg:col-span-1">
          <SectionTitle icon={CalendarDays} action={<button onClick={() => go("exposiciones")} className="poa-focus text-xs text-[var(--oxblood)] font-medium">Ver todas</button>}>
            Próximas exposiciones
          </SectionTitle>
          <div className="space-y-3">
            {proximas.map(e => (
              <button key={e.id} onClick={() => go({ module: "exposicionDetalle", id: e.id })} className="poa-focus w-full text-left p-2.5 rounded border poa-hairline hover:border-[var(--oxblood)]">
                <div className="text-sm font-medium text-[var(--ink)]">{e.nombre}</div>
                <div className="text-xs text-[var(--slate3)] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span className="flex items-center gap-1"><CalendarDays size={11} />{fmtDate(e.fecha)}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{e.lugar}</span>
                  <span className="flex items-center gap-1"><Gavel size={11} />{persona(e.juezId)?.nombre}</span>
                  <span>{e.inscriptos} inscriptos</span>
                </div>
              </button>
            ))}
            {proximas.length === 0 && <Empty title="No hay exposiciones próximas" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ EJEMPLARES --------------------------------- */

function EjemplaresList({ go }) {
  const [q, setQ] = useState("");
  const [sexo, setSexo] = useState("");
  const [pelo, setPelo] = useState("");
  const [estado, setEstado] = useState("");
  const rows = Object.values(PERROS).filter(p =>
    (!q || p.nombre.toLowerCase().includes(q.toLowerCase()) || p.poa.toLowerCase().includes(q.toLowerCase())) &&
    (!sexo || p.sexo === sexo) && (!pelo || p.pelo === pelo) && (!estado || p.estado === estado)
  );
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="poa-serif text-2xl text-[var(--ink)]">Registro de Ejemplares</h1>
          <p className="text-sm text-[var(--slate3)]">{rows.length} de {Object.keys(PERROS).length} ejemplares <DemoPill className="ml-1 align-middle" /></p>
        </div>
        <button className="poa-focus flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-2 rounded-md" style={{ background: "var(--oxblood)" }}>
          <Plus size={15} /> Nuevo ejemplar
        </button>
      </div>

      <div className="poa-card p-3 mb-4 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border poa-hairline flex-1 min-w-[220px]">
          <Search size={14} className="text-[var(--slate3)]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o N.º POA…" className="text-sm outline-none bg-transparent w-full" />
        </div>
        <Filter size={14} className="text-[var(--slate3)]" />
        <select value={sexo} onChange={e => setSexo(e.target.value)} className="text-sm border poa-hairline rounded px-2 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Sexo</option><option>Macho</option><option>Hembra</option>
        </select>
        <select value={pelo} onChange={e => setPelo(e.target.value)} className="text-sm border poa-hairline rounded px-2 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Pelo</option><option>Corto</option><option>Largo</option>
        </select>
        <select value={estado} onChange={e => setEstado(e.target.value)} className="text-sm border poa-hairline rounded px-2 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Estado</option><option>Activo</option><option>Histórico</option>
        </select>
      </div>

      <div className="poa-card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead><tr>
            <Th>Ejemplar</Th><Th>N.º POA</Th><Th>Sexo</Th><Th>Nacimiento</Th><Th>Pelo</Th>
            <Th>Criador</Th><Th>Propietario</Th><Th>Microchip</Th><Th>Estado</Th>
          </tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="poa-row cursor-pointer" onClick={() => go({ module: "ejemplarFicha", id: p.id })}>
                <Td className="font-medium text-[var(--ink)]">{p.nombre}</Td>
                <Td className="poa-mono">{p.poa}</Td>
                <Td>{p.sexo}</Td>
                <Td>{fmtDate(p.nacimiento)}</Td>
                <Td>{p.pelo}</Td>
                <Td>{criadero(p.criadorId)?.afijo || "—"}</Td>
                <Td>{persona(p.propietarioId)?.nombre || "—"}</Td>
                <Td className="poa-mono text-xs">{p.microchip}</Td>
                <Td><Badge tone={p.estado}>{p.estado}</Badge></Td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9}><Empty title="Sin resultados" sub="Probá ajustar los filtros de búsqueda." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------- FICHA DE EJEMPLAR ------------------------------ */

function EjemplarFicha({ id, go, tab, setTab }) {
  const p = perro(id);
  if (!p) return <div className="p-6"><Empty title="Ejemplar no encontrado" /></div>;
  const c = criadero(p.criadorId);
  const propietario = persona(p.propietarioId);
  const tabs = [
    { id: "resumen", label: "Resumen" }, { id: "pedigree", label: "Pedigree" }, { id: "salud", label: "Salud" },
    { id: "seleccion", label: "Selección" }, { id: "trabajo", label: "Trabajo" }, { id: "exposiciones", label: "Exposiciones" },
    { id: "descendencia", label: "Descendencia" }, { id: "tramites", label: "Trámites" }, { id: "documentos", label: "Documentos" }, { id: "historial", label: "Historial" },
  ];
  const openDog = (pid) => go({ module: "ejemplarFicha", id: pid });
  const tramitesDelPerro = Object.values(TRAMITES).filter(t => t.perroId === id);
  const documentosDelPerro = DOCUMENTOS.filter(d => d.relacion.perroId === id);
  const descendientes = Object.values(PERROS).filter(x => x.padreId === id || x.madreId === id);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-28 h-28 rounded-md shrink-0 flex items-center justify-center" style={{ background: "var(--parchment)", border: "1px dashed var(--hairline)" }}>
            <Dog size={34} className="text-[var(--slate3)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="poa-mono text-xs text-[var(--slate3)]">{p.poa}</span>
              <Badge tone={p.estado}>{p.estado}</Badge>
              <DemoPill />
            </div>
            <h1 className="poa-serif text-2xl text-[var(--ink)] mt-0.5">{p.nombre}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <Field label="Sexo">{p.sexo}</Field>
              <Field label="Pelo">{p.pelo}</Field>
              <Field label="Nacimiento">{fmtDate(p.nacimiento)}</Field>
              <Field label="Color">{p.color}</Field>
              <Field label="Microchip"><span className="poa-mono">{p.microchip}</span></Field>
              <Field label="Tatuaje"><span className="poa-mono">{p.tatuaje}</span></Field>
              <Field label="Criador">{c ? <button onClick={() => go({ module: "criaderoFicha", id: c.id })} className="poa-focus hover:underline text-[var(--oxblood)]">{c.afijo}</button> : "—"}</Field>
              <Field label="Propietario actual">{propietario ? <button onClick={() => go({ module: "socioFicha", id: Object.values(SOCIOS).find(s => s.personaId === propietario.id)?.id })} className="poa-focus hover:underline text-[var(--oxblood)]">{propietario.nombre}</button> : "—"}</Field>
            </div>
          </div>
        </div>
      </div>

      <div className="poa-card p-5">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="pt-5">
          {tab === "resumen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Señas particulares">{p.señas}</Field>
              <Field label="Afijo del criadero">{c?.afijo}</Field>
              <Field label="Selección">{p.seleccion ? `${p.seleccion.clase} — ${p.seleccion.resultado}` : "Sin registrar"}</Field>
              <Field label="Diagnóstico cadera">{p.cadera || "Sin registrar"}</Field>
              <Field label="Diagnóstico codo">{p.codo || "Sin registrar"}</Field>
              <Field label="Certificación dentaria">{p.dentario || "Sin registrar"}</Field>
            </div>
          )}
          {tab === "pedigree" && <PedigreeTree perroId={id} onOpen={openDog} />}
          {tab === "salud" && (
            <div>
              <SectionTitle icon={Stethoscope}>Diagnósticos</SectionTitle>
              {p.diagnosticos?.length ? (
                <div className="poa-card overflow-x-auto">
                  <table className="w-full"><thead><tr><Th>Tipo</Th><Th>Resultado</Th><Th>Fecha</Th><Th>Veterinario</Th><Th>Ámbito</Th><Th>Estado</Th></tr></thead>
                    <tbody>{p.diagnosticos.map((d, i) => (
                      <tr key={i}><Td className="font-medium text-[var(--ink)]">{d.tipo}</Td><Td>{d.resultado}</Td><Td>{fmtDate(d.fecha)}</Td><Td>{persona(d.veterinarioId)?.nombre}</Td><Td>{d.ambito}</Td><Td><Badge tone={d.estado}>{d.estado}</Badge></Td></tr>
                    ))}</tbody></table>
                </div>
              ) : <Empty icon={Stethoscope} title="Sin diagnósticos cargados" />}
            </div>
          )}
          {tab === "seleccion" && (
            <div>
              <SectionTitle icon={BadgeCheck}>Historial de Selección</SectionTitle>
              {p.seleccion ? (
                <div className="poa-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="Clase">{p.seleccion.clase}</Field>
                  <Field label="Resultado">{p.seleccion.resultado}</Field>
                  <Field label="Fecha">{fmtDate(p.seleccion.fecha)}</Field>
                  <Field label="Juez">{persona(p.seleccion.juezId)?.nombre}</Field>
                </div>
              ) : <Empty icon={BadgeCheck} title="Sin resultado de Selección" />}
            </div>
          )}
          {tab === "trabajo" && (
            <div>
              <SectionTitle icon={ShieldCheck}>Exámenes de adiestramiento</SectionTitle>
              {p.trabajo?.length ? (
                <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>Examen</Th><Th>Resultado</Th><Th>Fecha</Th></tr></thead>
                  <tbody>{p.trabajo.map((t, i) => <tr key={i}><Td className="font-medium text-[var(--ink)]">{t.tipo}</Td><Td><Badge tone={t.resultado}>{t.resultado}</Badge></Td><Td>{fmtDate(t.fecha)}</Td></tr>)}</tbody>
                </table></div>
              ) : <Empty icon={ShieldCheck} title="Sin exámenes registrados" />}
            </div>
          )}
          {tab === "exposiciones" && (
            <div>
              <SectionTitle icon={Award}>Historial de exposiciones</SectionTitle>
              {p.exposiciones?.length ? (
                <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>Exposición</Th><Th>Categoría</Th><Th>Calificación</Th><Th>Puesto</Th></tr></thead>
                  <tbody>{p.exposiciones.map((e, i) => (
                    <tr key={i} className="poa-row cursor-pointer" onClick={() => go({ module: "exposicionDetalle", id: e.expoId })}>
                      <Td className="font-medium text-[var(--oxblood)]">{exposicion(e.expoId)?.nombre}</Td><Td>{e.categoria}</Td><Td><Badge tone={e.calificacion}>{e.calificacion}</Badge></Td><Td>{e.puesto}°</Td>
                    </tr>
                  ))}</tbody></table></div>
              ) : <Empty icon={Award} title="Sin participaciones registradas" />}
            </div>
          )}
          {tab === "descendencia" && (
            <div>
              <SectionTitle icon={Baby}>Descendencia</SectionTitle>
              {descendientes.length ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {descendientes.map(d => (
                    <button key={d.id} onClick={() => openDog(d.id)} className="poa-focus poa-card p-3 text-left hover:border-[var(--oxblood)]">
                      <div className="text-sm font-medium text-[var(--ink)]">{d.nombre}</div>
                      <div className="poa-mono text-xs text-[var(--slate3)]">{d.poa} · {d.sexo}</div>
                    </button>
                  ))}
                </div>
              ) : <Empty icon={Baby} title="Sin camadas descendientes registradas" />}
            </div>
          )}
          {tab === "tramites" && (
            <div>
              <SectionTitle icon={ClipboardList}>Trámites relacionados</SectionTitle>
              {tramitesDelPerro.length ? (
                <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>ID</Th><Th>Tipo</Th><Th>Fecha</Th><Th>Estado</Th><Th>Importe</Th></tr></thead>
                  <tbody>{tramitesDelPerro.map(t => (
                    <tr key={t.id} className="poa-row cursor-pointer" onClick={() => go({ module: "tramiteDetalle", id: t.id })}>
                      <Td className="poa-mono text-[var(--oxblood)] font-medium">{t.id}</Td><Td>{t.tipo}</Td><Td>{fmtDate(t.fecha)}</Td><Td><Badge tone={t.estado}>{t.estado}</Badge></Td><Td>{peso(t.importe)}</Td>
                    </tr>
                  ))}</tbody></table></div>
              ) : <Empty icon={ClipboardList} title="Sin trámites asociados" />}
            </div>
          )}
          {tab === "documentos" && (
            <div>
              <SectionTitle icon={FolderOpen}>Documentos asociados</SectionTitle>
              {documentosDelPerro.length ? (
                <div className="space-y-2">{documentosDelPerro.map(d => (
                  <div key={d.id} className="poa-card p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0"><FileText size={16} className="text-[var(--slate3)] shrink-0" /><div className="min-w-0"><div className="text-sm text-[var(--ink)] truncate">{d.nombre}</div><div className="text-xs text-[var(--slate3)]">{d.tipo} · {fmtDate(d.fecha)}</div></div></div>
                    <Badge tone={d.estado}>{d.estado}</Badge>
                  </div>
                ))}</div>
              ) : <Empty icon={FolderOpen} title="Sin documentos cargados" />}
            </div>
          )}
          {tab === "historial" && (
            <div>
              <SectionTitle icon={History}>Historial de propietarios</SectionTitle>
              {p.historial?.length ? (
                <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>Propietario</Th><Th>Desde</Th><Th>Hasta</Th><Th>Motivo</Th></tr></thead>
                  <tbody>{p.historial.map((h, i) => <tr key={i}><Td className="font-medium text-[var(--ink)]">{persona(h.propietarioId)?.nombre}</Td><Td>{fmtDate(h.desde)}</Td><Td>{h.hasta ? fmtDate(h.hasta) : "Actual"}</Td><Td>{h.motivo}</Td></tr>)}</tbody>
                </table></div>
              ) : <Empty icon={History} title="Sin historial registrado" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- SOCIOS ------------------------------------ */

function SociosList({ go }) {
  const rows = Object.values(SOCIOS);
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="poa-serif text-2xl text-[var(--ink)]">Socios</h1><p className="text-sm text-[var(--slate3)]">{rows.length} socios registrados <DemoPill className="ml-1 align-middle" /></p></div>
        <button className="poa-focus flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-2 rounded-md" style={{ background: "var(--oxblood)" }}><Plus size={15} /> Nuevo socio</button>
      </div>
      <div className="poa-card overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead><tr><Th>N.º socio</Th><Th>Nombre</Th><Th>Categoría</Th><Th>Filial</Th><Th>Estado</Th><Th>Última cuota</Th></tr></thead>
          <tbody>{rows.map(s => (
            <tr key={s.id} className="poa-row cursor-pointer" onClick={() => go({ module: "socioFicha", id: s.id })}>
              <Td className="poa-mono">{s.nroSocio}</Td>
              <Td className="font-medium text-[var(--ink)]">{persona(s.personaId)?.nombre}</Td>
              <Td>{s.categoria}</Td>
              <Td>{filial(s.filialId)?.sigla}</Td>
              <Td><Badge tone={s.estado}>{s.estado}</Badge></Td>
              <Td>{s.ultimaCuota}</Td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function SocioFicha({ id, go }) {
  const [tab, setTab] = useState("datos");
  const s = SOCIOS[id];
  if (!s) return <div className="p-6"><Empty title="Socio no encontrado" /></div>;
  const pe = persona(s.personaId);
  const perros = Object.values(PERROS).filter(p => p.propietarioId === pe.id);
  const tramitesDelSocio = Object.values(TRAMITES).filter(t => t.personaId === pe.id);
  const documentosDelSocio = DOCUMENTOS.filter(d => d.relacion.personaId === pe.id);
  const tabs = [{ id: "datos", label: "Datos personales" }, { id: "membresia", label: "Membresía" }, { id: "cuotas", label: "Cuotas" }, { id: "tramites", label: "Trámites" }, { id: "perros", label: "Perros" }, { id: "documentos", label: "Documentos" }, { id: "historial", label: "Historial" }];
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-1"><span className="poa-mono text-xs text-[var(--slate3)]">N.º {s.nroSocio}</span><Badge tone={s.estado}>{s.estado}</Badge><DemoPill /></div>
        <h1 className="poa-serif text-2xl text-[var(--ink)]">{pe.nombre}</h1>
        <div className="text-sm text-[var(--slate3)] mt-1">{s.categoria} · {filial(s.filialId)?.nombre}</div>
      </div>
      <div className="poa-card p-5">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="pt-5">
          {tab === "datos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="DNI">{pe.dni}</Field><Field label="Domicilio">{pe.domicilio}</Field><Field label="Localidad">{pe.localidad}</Field>
              <Field label="Provincia">{pe.provincia}</Field><Field label="C.P.">{pe.cp}</Field><Field label="País">{pe.pais}</Field>
              <Field label="Teléfono">{pe.telefono}</Field><Field label="Email">{pe.email}</Field>
            </div>
          )}
          {tab === "membresia" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="Categoría">{s.categoria}</Field><Field label="Filial">{filial(s.filialId)?.nombre}</Field><Field label="Estado">{s.estado}</Field>
              <Field label="N.º de socio">{s.nroSocio}</Field><Field label="Última cuota">{s.ultimaCuota}</Field>
            </div>
          )}
          {tab === "cuotas" && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="poa-card p-3"><div className="text-xs text-[var(--slate3)]">Pagadas</div><div className="poa-serif text-xl text-[var(--green)]">{s.cuotas.filter(c => c.estado === "Pagada").length}</div></div>
                <div className="poa-card p-3"><div className="text-xs text-[var(--slate3)]">Pendientes</div><div className="poa-serif text-xl text-[var(--amber)]">{s.cuotas.filter(c => c.estado === "Pendiente").length}</div></div>
                <div className="poa-card p-3"><div className="text-xs text-[var(--slate3)]">Vencidas</div><div className="poa-serif text-xl text-[var(--red)]">{s.cuotas.filter(c => c.estado === "Vencida").length}</div></div>
              </div>
              {s.cuotas.length ? (
                <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>Período</Th><Th>Importe</Th><Th>Vencimiento</Th><Th>Estado</Th><Th>Fecha de pago</Th><Th>Método</Th></tr></thead>
                  <tbody>{s.cuotas.map((c, i) => <tr key={i}><Td className="font-medium text-[var(--ink)]">{c.periodo}</Td><Td>{peso(c.importe)}</Td><Td>{fmtDate(c.vencimiento)}</Td><Td><Badge tone={c.estado}>{c.estado}</Badge></Td><Td>{c.fechaPago ? fmtDate(c.fechaPago) : "—"}</Td><Td>{c.metodo}</Td></tr>)}</tbody>
                </table></div>
              ) : <Empty title="Socio Vitalicio — sin cuotas periódicas" />}
            </div>
          )}
          {tab === "tramites" && (tramitesDelSocio.length ? (
            <div className="poa-card overflow-x-auto"><table className="w-full"><thead><tr><Th>ID</Th><Th>Tipo</Th><Th>Fecha</Th><Th>Estado</Th></tr></thead>
              <tbody>{tramitesDelSocio.map(t => <tr key={t.id} className="poa-row cursor-pointer" onClick={() => go({ module: "tramiteDetalle", id: t.id })}><Td className="poa-mono text-[var(--oxblood)] font-medium">{t.id}</Td><Td>{t.tipo}</Td><Td>{fmtDate(t.fecha)}</Td><Td><Badge tone={t.estado}>{t.estado}</Badge></Td></tr>)}</tbody>
            </table></div>
          ) : <Empty icon={ClipboardList} title="Sin trámites asociados" />)}
          {tab === "perros" && (perros.length ? (
            <div className="grid sm:grid-cols-2 gap-3">{perros.map(p => (
              <button key={p.id} onClick={() => go({ module: "ejemplarFicha", id: p.id })} className="poa-focus poa-card p-3 text-left hover:border-[var(--oxblood)]">
                <div className="text-sm font-medium text-[var(--ink)]">{p.nombre}</div><div className="poa-mono text-xs text-[var(--slate3)]">{p.poa}</div>
              </button>
            ))}</div>
          ) : <Empty icon={Dog} title="No figura como propietario de ejemplares" />)}
          {tab === "documentos" && (documentosDelSocio.length ? (
            <div className="space-y-2">{documentosDelSocio.map(d => (
              <div key={d.id} className="poa-card p-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2.5 min-w-0"><FileText size={16} className="text-[var(--slate3)] shrink-0" /><div className="text-sm text-[var(--ink)] truncate">{d.nombre}</div></div><Badge tone={d.estado}>{d.estado}</Badge></div>
            ))}</div>
          ) : <Empty icon={FolderOpen} title="Sin documentos cargados" />)}
          {tab === "historial" && <Empty icon={History} title="Sin modificaciones registradas en esta sesión" />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------- CRIADORES Y AFIJOS ------------------------------ */

function CriadoresList({ go }) {
  const rows = Object.values(CRIADEROS);
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Criadores y Afijos</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">{rows.length} criaderos registrados <DemoPill className="ml-1 align-middle" /></p>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map(c => {
          const nPerros = Object.values(PERROS).filter(p => p.criadorId === c.id).length;
          return (
            <button key={c.id} onClick={() => go({ module: "criaderoFicha", id: c.id })} className="poa-focus poa-card p-4 text-left hover:border-[var(--oxblood)]">
              <div className="flex items-center justify-between"><div className="poa-serif text-lg text-[var(--ink)]">{c.afijo}</div><Badge tone={c.estado}>{c.estado}</Badge></div>
              <div className="text-sm text-[var(--slate3)] mt-1">Titular: {persona(c.titularId)?.nombre}</div>
              <div className="text-xs text-[var(--slate3)] mt-2">{nPerros} ejemplares · Afijo nacional {c.registroNacional}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CriaderoFicha({ id, go }) {
  const c = CRIADEROS[id];
  if (!c) return <div className="p-6"><Empty title="Criadero no encontrado" /></div>;
  const titular = persona(c.titularId);
  const perros = Object.values(PERROS).filter(p => p.criadorId === id);
  const camadas = Object.values(CAMADAS).filter(cm => cm.criadorId === id);
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-1"><Badge tone={c.estado}>{c.estado}</Badge><DemoPill /></div>
        <h1 className="poa-serif text-2xl text-[var(--ink)]">{c.afijo}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          <Field label="Titular">{titular?.nombre}</Field>
          <Field label="Registro nacional">{c.registroNacional}</Field>
          <Field label="Registro internacional">{c.registroInternacional}</Field>
          <Field label="Estado">{c.estado}</Field>
        </div>
      </div>
      <div className="poa-card p-5 mb-4">
        <SectionTitle icon={Dog}>Perros del criadero</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          {perros.map(p => (
            <button key={p.id} onClick={() => go({ module: "ejemplarFicha", id: p.id })} className="poa-focus poa-card p-3 text-left hover:border-[var(--oxblood)]">
              <div className="text-sm font-medium text-[var(--ink)]">{p.nombre}</div><div className="poa-mono text-xs text-[var(--slate3)]">{p.poa} · {p.sexo}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="poa-card p-5">
        <SectionTitle icon={Baby}>Camadas</SectionTitle>
        {camadas.length ? camadas.map(cm => (
          <button key={cm.id} onClick={() => go({ module: "camadaFicha", id: cm.id })} className="poa-focus poa-card p-3 w-full text-left hover:border-[var(--oxblood)] mb-2">
            <span className="poa-mono text-sm text-[var(--ink)] font-medium">{cm.codigo}</span> — {cm.machos + cm.hembras} cachorros
          </button>
        )) : <Empty icon={Baby} title="Sin camadas registradas" />}
      </div>
    </div>
  );
}

/* ------------------------------- CAMADAS ------------------------------------ */

function CamadasList({ go }) {
  const rows = Object.values(CAMADAS);
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Camadas</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">{rows.length} camadas registradas <DemoPill className="ml-1 align-middle" /></p>
      <div className="poa-card overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead><tr><Th>ID</Th><Th>Padre</Th><Th>Madre</Th><Th>Criador</Th><Th>F. servicio</Th><Th>F. nacimiento</Th><Th>Cachorros</Th><Th>Estado</Th></tr></thead>
          <tbody>{rows.map(cm => (
            <tr key={cm.id} className="poa-row cursor-pointer" onClick={() => go({ module: "camadaFicha", id: cm.id })}>
              <Td className="poa-mono font-medium text-[var(--ink)]">{cm.codigo}</Td>
              <Td>{perro(cm.padreId)?.nombre}</Td><Td>{perro(cm.madreId)?.nombre}</Td><Td>{criadero(cm.criadorId)?.afijo}</Td>
              <Td>{fmtDate(cm.fechaServicio)}</Td><Td>{fmtDate(cm.fechaNacimiento)}</Td>
              <Td>{cm.machos + cm.hembras} ({cm.machos}M / {cm.hembras}H)</Td><Td><Badge tone={cm.estado}>{cm.estado}</Badge></Td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function CamadaFicha({ id, go }) {
  const cm = CAMADAS[id];
  if (!cm) return <div className="p-6"><Empty title="Camada no encontrada" /></div>;
  const padre = perro(cm.padreId), madre = perro(cm.madreId);
  const cachorros = cm.cachorroIds.map(perro);
const criadorInfo = criadero(cm.criadorId) || {};
  return (
    <div className="p-4 md:p-6 max-w-[900px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-1"><Badge tone={cm.estado}>{cm.estado}</Badge><DemoPill /></div>
        <h1 className="poa-serif text-2xl text-[var(--ink)] poa-mono">{cm.codigo}</h1>
        <button onClick={() => generarCertificadoCamada({
  numeroCamada: cm.codigo,
  criador: { nombre: criadorInfo.nombre || "-", afijo: criadorInfo.afijo || "-" },
  padre: { nombre: padre?.nombre || "-", poa: padre?.poa || "-" },
  madre: { nombre: madre?.nombre || "-", poa: madre?.poa || "-" },
  fechaNacimiento: cm.fechaNacimiento,
  cantidadMachos: cm.machos,
  cantidadHembras: cm.hembras,
  cachorros: cachorros.map(c => ({ nombre: c?.nombre || "-", sexo: c?.sexo || "-", color: c?.color || "-", poa: c?.poa || "-" })),
})} className="poa-focus text-xs font-medium px-4 py-2 rounded-lg bg-[var(--brass)] text-white mt-2">
  Descargar Certificado de Camada PDF
</button>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          <Field label="Criador">{criadero(cm.criadorId)?.afijo}</Field>
          <Field label="Fecha de servicio">{fmtDate(cm.fechaServicio)}</Field>
          <Field label="Fecha de nacimiento">{fmtDate(cm.fechaNacimiento)}</Field>
          <Field label="Cachorros">{cm.machos} machos / {cm.hembras} hembras</Field>
        </div>
      </div>
      <div className="poa-card p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <PedigreeCard id={padre?.id} onOpen={(pid) => go({ module: "ejemplarFicha", id: pid })} role="Padre" />
            <PedigreeCard id={madre?.id} onOpen={(pid) => go({ module: "ejemplarFicha", id: pid })} role="Madre" />
          </div>
          <div className="h-6 w-px" style={{ background: "var(--hairline)" }} />
          <div className="text-xs uppercase tracking-wide text-[var(--slate3)]">Camada</div>
          <div className="h-6 w-px" style={{ background: "var(--hairline)" }} />
          <div className="grid sm:grid-cols-3 gap-3 w-full">
            {cachorros.map(p => (
              <button key={p.id} onClick={() => go({ module: "ejemplarFicha", id: p.id })} className="poa-focus poa-card p-3 text-left hover:border-[var(--oxblood)]">
                <div className="text-sm font-medium text-[var(--ink)]">{p.nombre}</div>
                <div className="poa-mono text-xs text-[var(--slate3)]">{p.poa} · {p.sexo}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- TRAMITES ------------------------------------ */

function TramitesList({ go }) {
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const rows = Object.values(TRAMITES).filter(t => (!tipo || t.tipo === tipo) && (!estado || t.estado === estado));
  const ESTADOS = ["Pendiente", "En revisión", "Observado", "Aprobado", "Rechazado", "Finalizado"];
  return (
    <div className="p-4 md:p-6 max-w-[1300px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="poa-serif text-2xl text-[var(--ink)]">Gestión de trámites</h1>
          <p className="text-sm text-[var(--slate3)]">{rows.length} de {Object.keys(TRAMITES).length} trámites <DemoPill className="ml-1 align-middle" /></p>
        </div>
        <button onClick={() => go("transferenciaForm")} className="poa-focus flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-2 rounded-md" style={{ background: "var(--oxblood)" }}><Plus size={15} /> Nuevo trámite</button>
      </div>
      <p className="text-xs text-[var(--slate3)] -mt-2 mb-4">El botón abre el formulario DEMO de Cambio de Titularidad. Los demás tipos de trámite comparten esta misma estructura de carga.</p>

      <div className="poa-card p-3 mb-4 flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-[var(--slate3)]" />
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="text-sm border poa-hairline rounded px-2 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Todos los tipos</option>{TRAMITE_TIPOS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={estado} onChange={e => setEstado(e.target.value)} className="text-sm border poa-hairline rounded px-2 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Todos los estados</option>{ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
        <div className="flex gap-1 ml-auto flex-wrap">
          {ESTADOS.map(e => {
            const n = Object.values(TRAMITES).filter(t => t.estado === e).length;
            return <button key={e} onClick={() => setEstado(e === estado ? "" : e)} className="poa-focus"><Badge tone={e}>{e} · {n}</Badge></button>;
          })}
        </div>
      </div>

      <div className="poa-card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead><tr><Th>ID</Th><Th>Tipo</Th><Th>Persona</Th><Th>Ejemplar</Th><Th>Fecha</Th><Th>Estado</Th><Th>Importe</Th><Th>Responsable</Th></tr></thead>
          <tbody>{rows.map(t => (
            <tr key={t.id} className="poa-row cursor-pointer" onClick={() => go({ module: "tramiteDetalle", id: t.id })}>
              <Td className="poa-mono font-medium text-[var(--oxblood)]">{t.id}</Td>
              <Td>{t.tipo}</Td>
              <Td>{persona(t.personaId)?.nombre}</Td>
              <Td>{perro(t.perroId)?.nombre || "—"}</Td>
              <Td>{fmtDate(t.fecha)}</Td>
              <Td><Badge tone={t.estado}>{t.estado}</Badge></Td>
              <Td>{peso(t.importe)}</Td>
              <Td>{t.responsable}</Td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={8}><Empty title="Sin trámites para estos filtros" /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ESTADO_FLOW = ["Pendiente", "En revisión", "Observado", "Aprobado", "Finalizado"];

function TramiteDetalle({ id, go }) {
  const [overrideEstado, setOverrideEstado] = useState(null);
  const base = TRAMITES[id];
  if (!base) return <div className="p-6"><Empty title="Trámite no encontrado" /></div>;
  const t = { ...base, estado: overrideEstado || base.estado };
  const pe = persona(t.personaId);
  const pr = perro(t.perroId);
  const version = arancelVigente(t.fecha);

  const setEstado = (nuevo) => setOverrideEstado(nuevo);

  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--oxblood)] font-medium mb-1">{t.tipo}</div>
            <h1 className="poa-serif text-2xl text-[var(--ink)] poa-mono">{t.id}</h1>
          </div>
          <div className="flex items-center gap-2"><Badge tone={t.estado}>{t.estado}</Badge><DemoPill /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <Field label="Ejemplar">{pr ? <button onClick={() => go({ module: "ejemplarFicha", id: pr.id })} className="poa-focus hover:underline text-[var(--oxblood)]">{pr.nombre}</button> : "—"}</Field>
          <Field label="Persona">{pe?.nombre}</Field>
          <Field label="Fecha de presentación">{fmtDate(t.fecha)}</Field>
          <Field label="Responsable">{t.responsable}</Field>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="poa-card p-5 lg:col-span-2">
          <SectionTitle icon={FileText}>Detalle</SectionTitle>
          {t.tipo === "Transferencia" && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <Field label="Titular anterior">{persona(t.detalle.titularAnteriorId)?.nombre}</Field>
              <Field label="Nuevo titular">{persona(t.detalle.nuevoTitularId)?.nombre}</Field>
              <Field label="Fecha de entrega">{fmtDate(t.detalle.fechaEntrega)}</Field>
              <Field label="Fecha de presentación">{fmtDate(t.detalle.fechaPresentacion)}</Field>
              <Field label="Firmas">{t.detalle.firmas}</Field>
              <Field label="Documentación">{t.detalle.documentacion?.join(", ")}</Field>
            </div>
          )}
          {t.tipo !== "Transferencia" && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              {Object.keys(t.detalle).length === 0 && <Field label="Detalle">Sin datos adicionales cargados</Field>}
              {Object.entries(t.detalle).map(([k, v]) => {
                const label = { reproductorId: "Reproductor", reproductoraId: "Reproductora", camadaId: "Camada", veterinarioId: "Veterinario", juezId: "Juez", afijoPropuesto: "Afijo propuesto", nacionalExterior: "Nacional / Exterior", motivoRechazo: "Motivo de rechazo", clase: "Clase", resultado: "Resultado", tipo: "Tipo", ambito: "Ámbito", machos: "Machos", hembras: "Hembras" }[k] || k;
                let val = v;
                if (k.endsWith("Id") && typeof v === "string") {
                  if (PERSONAS[v]) val = PERSONAS[v].nombre;
                  else if (PERROS[v]) val = PERROS[v].nombre;
                  else if (CAMADAS[v]) val = CAMADAS[v].codigo;
                }
                return <Field key={k} label={label}>{typeof val === "string" || typeof val === "number" ? val : JSON.stringify(val)}</Field>;
              })}
            </div>
          )}
          <div className="mt-3 p-3 rounded border poa-hairline text-xs text-[var(--slate2)] flex items-start gap-2" style={{ background: "var(--parchment)" }}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[var(--brass)]" />
            Los formularios oficiales deben presentarse completos, sin enmiendas ni tachaduras.
          </div>

          <div className="mt-5 p-3 rounded border poa-hairline flex items-center justify-between" style={{ background: "var(--parchment)" }}>
            <div>
              <div className="text-xs text-[var(--slate3)]">Arancel aplicable ({t.tipo})</div>
              <div className="poa-serif text-lg text-[var(--ink)]">{peso(t.importe)}</div>
            </div>
            <div className="text-xs text-[var(--slate3)] text-right">Tabla vigente desde<br /><span className="poa-mono">{fmtDate(version.vigenteDesde)}</span></div>
          </div>

          <SectionTitle icon={ClipboardCheck}>Acciones</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEstado("Aprobado")} className="poa-focus text-sm font-medium px-3 py-1.5 rounded-md text-white" style={{ background: "var(--green)" }}>Aprobar</button>
            <button onClick={() => setEstado("Observado")} className="poa-focus text-sm font-medium px-3 py-1.5 rounded-md text-white" style={{ background: "var(--amber)" }}>Observar</button>
            <button onClick={() => setEstado("Rechazado")} className="poa-focus text-sm font-medium px-3 py-1.5 rounded-md text-white" style={{ background: "var(--red)" }}>Rechazar</button>
            <button onClick={() => setEstado("En revisión")} className="poa-focus text-sm font-medium px-3 py-1.5 rounded-md border poa-hairline text-[var(--ink)]">Solicitar documentación</button>
          </div>
          <p className="text-xs text-[var(--slate3)] mt-2">Los botones modifican el estado únicamente en esta sesión de la demo (no hay backend conectado).</p>
        </div>

        <div className="poa-card p-5">
          <SectionTitle icon={History}>Historial de estados</SectionTitle>
          <Timeline steps={overrideEstado ? [...t.timeline.filter(s => s.ok === true), { estado: overrideEstado, fecha: new Date().toISOString().slice(0, 10), ok: overrideEstado === "Rechazado" ? "reject" : overrideEstado === "Finalizado" || overrideEstado === "Aprobado" ? true : "current" }] : t.timeline} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- FORMULARIO DE TRANSFERENCIA --------------------- */

const Input = ({ k, label, placeholder, form, errors, set }) => (
    <div>
      <label className="text-xs text-[var(--slate3)] mb-1 block">{label}</label>
      <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className={`w-full text-sm border rounded px-2.5 py-2 bg-white text-[var(--ink)] poa-focus ${errors[k] ? "border-[var(--red)]" : "poa-hairline"}`} />
      {errors[k] && <div className="text-[11px] text-[var(--red)] mt-0.5">{errors[k]}</div>}
    </div>
  );

function TransferenciaForm({ go }) {
  const [form, setForm] = useState({ nuevoPropietario: "", dni: "", domicilio: "", localidad: "", provincia: "", cp: "", pais: "Argentina", telefono: "", email: "", nroSocio: "", titularAnterior: "Juan Example", fechaEntrega: "", firma: false });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const required = ["nuevoPropietario", "dni", "domicilio", "localidad", "provincia", "fechaEntrega"];

  const submit = () => {
    const e = {};
    required.forEach(k => { if (!form[k]) e[k] = "Campo obligatorio"; });
    if (!form.firma) e.firma = "Debe confirmar la firma de ambas partes";
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="p-4 md:p-6 max-w-[700px] mx-auto">
        <div className="poa-card p-8 text-center">
          <CheckCircle2 size={32} className="mx-auto mb-3" style={{ color: "var(--green)" }} />
          <h2 className="poa-serif text-xl text-[var(--ink)] mb-1">Solicitud registrada (DEMO)</h2>
          <p className="text-sm text-[var(--slate3)] mb-4">Se generó un trámite de transferencia de ejemplo. En la plataforma real, esto crearía el registro en Trámites y notificaría a Secretaría.</p>
          <button onClick={() => generarCertificadoTransferencia({
  ejemplar: { nombre: "MAX VON EXAMPLE", poa: "400683" },
  titularAnterior: { nombre: form.titularAnterior || "Juan Example", dni: "" },
  nuevoTitular: {
    nombre: form.nuevoPropietario,
    dni: form.dni,
    domicilio: form.domicilio,
    localidad: form.localidad,
    provincia: form.provincia,
    cp: form.cp,
    pais: form.pais,
    telefono: form.telefono,
    email: form.email,
  },
  fechaEntrega: form.fechaEntrega,
  numeroTramite: "TR-2026-00124",
})} className="poa-focus text-xs font-medium px-4 py-2 rounded-lg bg-[var(--brass)] text-white mb-3">
  Descargar Certificado PDF
</button>
          <button onClick={() => go({ module: "tramiteDetalle", id: "TR-2026-00124" })} className="poa-focus text-sm font-medium text-white px-4 py-2 rounded-md" style={{ background: "var(--oxblood)" }}>Ver trámite de ejemplo</button>
        </div>
      </div>
    );
  }

  

  return (
    <div className="p-4 md:p-6 max-w-[800px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Cambio de Titularidad</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Formulario DEMO — MAX VON EXAMPLE (POA 400683) <DemoPill className="ml-1 align-middle" /></p>
      <div className="poa-card p-5 space-y-4">
        <div className="p-3 rounded border poa-hairline text-xs text-[var(--slate2)] flex items-start gap-2" style={{ background: "var(--parchment)" }}>
          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[var(--brass)]" />
          Los formularios oficiales deben presentarse completos, sin enmiendas ni tachaduras.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input k="nuevoPropietario" label="Nombre y apellido — nuevo propietario" form={form} errors={errors} set={set} />
          <Input k="dni" label="D.N.I." form={form} errors={errors} set={set} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input k="domicilio" label="Domicilio" form={form} errors={errors} set={set} />
          <Input k="localidad" label="Localidad" form={form} errors={errors} set={set} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input k="provincia" label="Provincia" form={form} errors={errors} set={set} />
          <Input k="cp" label="Código postal" form={form} errors={errors} set={set} />
          <Input k="pais" label="País" form={form} errors={errors} set={set} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input k="telefono" label="Teléfono" form={form} errors={errors} set={set} />
          <Input k="email" label="Email" form={form} errors={errors} set={set} />
          <Input k="nroSocio" label="N.º de socio (si corresponde)" form={form} errors={errors} set={set} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input k="titularAnterior" label="Titular anterior" form={form} errors={errors} set={set} />
          <div>
            <label className="text-xs text-[var(--slate3)] mb-1 block">Fecha de entrega del ejemplar</label>
            <input type="date" value={form.fechaEntrega} onChange={e => set("fechaEntrega", e.target.value)} className={`w-full text-sm border rounded px-2.5 py-2 bg-white text-[var(--ink)] poa-focus ${errors.fechaEntrega ? "border-[var(--red)]" : "poa-hairline"}`} />
            {errors.fechaEntrega && <div className="text-[11px] text-[var(--red)] mt-0.5">{errors.fechaEntrega}</div>}
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-[var(--ink)]">
          <input type="checkbox" checked={form.firma} onChange={e => set("firma", e.target.checked)} className="mt-0.5" />
          Declaro contar con la firma del titular anterior y del nuevo titular.
        </label>
        {errors.firma && <div className="text-[11px] text-[var(--red)]">{errors.firma}</div>}
        <button onClick={submit} className="poa-focus text-sm font-medium text-white px-4 py-2.5 rounded-md w-full" style={{ background: "var(--oxblood)" }}>Enviar solicitud (DEMO)</button>
      </div>
    </div>
  );
}

/* ------------------------------- ARANCELES ------------------------------------ */

function ArancelesModule({ go }) {
  const [versionId, setVersionId] = useState(ARANCELES[ARANCELES.length - 1].id);
  const version = ARANCELES.find(v => v.id === versionId);
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="poa-serif text-2xl text-[var(--ink)]">Aranceles</h1>
          <p className="text-sm text-[var(--slate3)]">Datos relevados de la documentación oficial del Club <DemoPill className="ml-1 align-middle" /></p>
        </div>
        <button className="poa-focus flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-2 rounded-md" style={{ background: "var(--oxblood)" }}><Plus size={15} /> Nuevo período de aranceles</button>
      </div>

      <div className="poa-card p-4 mb-4">
        <SectionTitle icon={Layers}>Versionado histórico</SectionTitle>
        <p className="text-xs text-[var(--slate3)] mb-3">Cada actualización de aranceles crea un nuevo período. Los valores históricos no se sobrescriben: cada trámite calcula su arancel según la versión vigente en su fecha.</p>
        <div className="flex flex-wrap gap-2">
          {ARANCELES.map(v => (
            <button key={v.id} onClick={() => setVersionId(v.id)}
              className={`poa-focus px-3 py-2 rounded-md border text-left text-sm ${versionId === v.id ? "border-[var(--oxblood)]" : "poa-hairline"}`}
              style={versionId === v.id ? { background: "var(--oxblood-tint)" } : {}}>
              <div className="font-medium text-[var(--ink)]">Vigente desde {fmtDate(v.vigenteDesde)}</div>
              <div className="text-xs text-[var(--slate3)]">{v.vigenteHasta ? `Hasta ${fmtDate(v.vigenteHasta)}` : "Vigencia actual"}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="poa-card overflow-x-auto mb-4">
        <table className="w-full min-w-[700px]">
          <thead><tr><Th>Concepto</Th><Th>Socio</Th><Th>No socio</Th><Th>Condición</Th><Th>Zona</Th></tr></thead>
          <tbody>{version.items.map((it, i) => (
            <tr key={i} className="poa-row">
              <Td className="text-[var(--ink)]">{it.concepto}</Td>
              <Td className="poa-mono">{peso(it.socio)}</Td>
              <Td className="poa-mono">{peso(it.noSocio)}</Td>
              <Td>{it.condicion ? <Badge tone="warn">{it.condicion}</Badge> : "—"}</Td>
              <Td className="text-xs text-[var(--slate3)]">{it.zona || version.zona}</Td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <CalculadorAranceles />
    </div>
  );
}

function CalculadorAranceles() {
  const [tramite, setTramite] = useState("Transferencia");
  const [esSocio, setEsSocio] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [fechaRef, setFechaRef] = useState("2024-03-14");
  const [zona, setZona] = useState("General");

  const version = arancelVigente(fecha);

  const resultado = useMemo(() => {
    let item = null, nota = "";
    if (tramite === "Transferencia") {
      const edadDias = daysBetween(fechaRef, fecha);
      item = buscarConcepto(version, "Transferencia — hasta 180") && edadDias <= 180 ? buscarConcepto(version, "hasta 180 días") :
        buscarConcepto(version, "hasta 360 días") && edadDias <= 360 ? buscarConcepto(version, "hasta 360 días") :
          buscarConcepto(version, "más de 360 días") ||
          buscarConcepto(version, "Transferencia"); // versión sin escalones
      nota = `Edad del ejemplar al momento del trámite: ${edadDias} días.`;
    } else if (tramite === "Denuncia de servicio") {
      const dias = daysBetween(fechaRef, fecha);
      item = dias <= 30 ? buscarConcepto(version, "hasta 30 días") : buscarConcepto(version, "más de 30 días");
      nota = `Presentado a los ${dias} días del servicio.`;
    } else if (tramite === "Denuncia de nacimiento") {
      const dias = daysBetween(fechaRef, fecha);
      item = dias <= 10 ? buscarConcepto(version, "hasta 10 días") : dias <= 20 ? buscarConcepto(version, "11 a 20 días") : buscarConcepto(version, "más de 20 días");
      nota = `Presentado a los ${dias} días del nacimiento.`;
    } else if (tramite === "Inscripción de cría") {
      const dias = daysBetween(fechaRef, fecha);
      item = dias <= 70 ? buscarConcepto(version, "hasta 70 días") : dias <= 90 ? buscarConcepto(version, "71 a 90 días") : buscarConcepto(version, "más de 90 días");
      nota = `Presentado a los ${dias} días del nacimiento.`;
    } else if (tramite === "Apto para cría") {
      item = buscarConcepto(version, "Apto para Cría");
    } else if (tramite === "Selección") {
      item = buscarConcepto(version, "Selección");
    } else if (tramite === "Pedigree") {
      item = buscarConcepto(version, "Pedigree — Original");
    } else if (tramite === "Registro de Afijo") {
      item = buscarConcepto(version, "Registro de Afijo") ;
    }
    const tarifa = item ? (esSocio ? item.socio : (item.noSocio ?? item.socio)) : null;
    return { item, tarifa, nota, condicion: item?.condicion };
  }, [tramite, esSocio, fecha, fechaRef, zona, version]);

  return (
    <div className="poa-card p-5">
      <SectionTitle icon={Scale}>Calculador de aranceles</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--slate3)] mb-1 block">Tipo de trámite</label>
            <select value={tramite} onChange={e => setTramite(e.target.value)} className="w-full text-sm border poa-hairline rounded px-2.5 py-2 bg-white text-[var(--ink)]">
              {["Transferencia", "Denuncia de servicio", "Denuncia de nacimiento", "Inscripción de cría", "Apto para cría", "Selección", "Pedigree", "Registro de Afijo"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--slate3)] mb-1 block">¿Es socio?</label>
              <div className="flex gap-2">
                <button onClick={() => setEsSocio(true)} className={`poa-focus flex-1 text-sm py-2 rounded border ${esSocio ? "border-[var(--oxblood)] text-[var(--oxblood)]" : "poa-hairline text-[var(--slate2)]"}`}>Sí</button>
                <button onClick={() => setEsSocio(false)} className={`poa-focus flex-1 text-sm py-2 rounded border ${!esSocio ? "border-[var(--oxblood)] text-[var(--oxblood)]" : "poa-hairline text-[var(--slate2)]"}`}>No</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--slate3)] mb-1 block">Zona</label>
              <select value={zona} onChange={e => setZona(e.target.value)} className="w-full text-sm border poa-hairline rounded px-2.5 py-2 bg-white text-[var(--ink)]"><option>General</option><option>AMBA</option><option>Zona distante</option></select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-[var(--slate3)] mb-1 block">Fecha del trámite</label><input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full text-sm border poa-hairline rounded px-2.5 py-2 bg-white text-[var(--ink)]" /></div>
            <div><label className="text-xs text-[var(--slate3)] mb-1 block">Fecha de referencia (nacimiento / servicio)</label><input type="date" value={fechaRef} onChange={e => setFechaRef(e.target.value)} className="w-full text-sm border poa-hairline rounded px-2.5 py-2 bg-white text-[var(--ink)]" /></div>
          </div>
        </div>
        <div className="poa-card p-4" style={{ background: "var(--parchment)" }}>
          <div className="text-xs text-[var(--slate3)] mb-2">{resultado.nota || "Concepto tarifado según la tabla vigente."}</div>
          <div className="flex justify-between text-sm py-1.5 border-b poa-hairline"><span className="text-[var(--slate2)]">Concepto</span><span className="text-[var(--ink)] font-medium text-right max-w-[60%]">{resultado.item?.concepto || "No aplica en esta tabla"}</span></div>
          <div className="flex justify-between text-sm py-1.5 border-b poa-hairline"><span className="text-[var(--slate2)]">Condición</span><span>{resultado.condicion ? <Badge tone="warn">{resultado.condicion}</Badge> : "Normal"}</span></div>
          <div className="flex justify-between text-sm py-1.5 border-b poa-hairline"><span className="text-[var(--slate2)]">Vigencia aplicada</span><span className="poa-mono text-xs text-[var(--ink)]">desde {fmtDate(version.vigenteDesde)}</span></div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-sm text-[var(--slate2)]">Arancel aplicable</span>
            <span className="poa-serif text-2xl text-[var(--oxblood)]">{resultado.tarifa != null ? peso(resultado.tarifa) : "—"}</span>
          </div>
          <div className="text-[11px] text-[var(--slate3)] mt-2 flex items-center gap-1"><Info size={11} /> Valores DEMO tomados del relevamiento documental — verificar contra la tabla oficial vigente.</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ EXPOSICIONES ------------------------------- */

function ExposicionesList({ go }) {
  const rows = Object.values(EXPOSICIONES);
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="poa-serif text-2xl text-[var(--ink)]">Exposiciones</h1><p className="text-sm text-[var(--slate3)]">{rows.length} eventos <DemoPill className="ml-1 align-middle" /></p></div>
        <button className="poa-focus flex items-center gap-1.5 text-sm font-medium text-white px-3.5 py-2 rounded-md" style={{ background: "var(--oxblood)" }}><Plus size={15} /> Nueva exposición</button>
      </div>
      <div className="space-y-3">
        {rows.map(e => (
          <button key={e.id} onClick={() => go({ module: "exposicionDetalle", id: e.id })} className="poa-focus poa-card p-4 w-full text-left hover:border-[var(--oxblood)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-[var(--ink)]">{e.nombre}</div>
              <div className="text-xs text-[var(--slate3)] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span className="flex items-center gap-1"><CalendarDays size={11} />{fmtDate(e.fecha)}</span>
                <span className="flex items-center gap-1"><MapPin size={11} />{e.lugar}</span>
                <span className="flex items-center gap-1"><Gavel size={11} />{persona(e.juezId)?.nombre}</span>
                <span>Club {e.club}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--slate3)]">{e.inscriptos} inscriptos</span>
              <Badge tone={e.estado}>{e.estado}</Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExposicionDetalle({ id, go }) {
  const e = EXPOSICIONES[id];
  if (!e) return <div className="p-6"><Empty title="Exposición no encontrada" /></div>;
  const catalogo = id === "e1" ? CATALOGO_E1 : [];
  const [catFiltro, setCatFiltro] = useState("");
  const [sexoFiltro, setSexoFiltro] = useState("");
  const filas = catalogo.filter(c => (!catFiltro || c.categoria === catFiltro) && (!sexoFiltro || c.sexo === sexoFiltro));
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <div className="poa-card p-5 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-1"><Badge tone={e.estado}>{e.estado}</Badge><DemoPill /></div>
        <h1 className="poa-serif text-2xl text-[var(--ink)]">{e.nombre}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          <Field label="Fecha">{fmtDate(e.fecha)}</Field>
          <Field label="Club / Agrupación">{e.club}</Field>
          <Field label="Lugar">{e.lugar}</Field>
          <Field label="Juez">{persona(e.juezId)?.nombre}</Field>
        </div>
      </div>

      <div className="poa-card p-5 mb-4">
        <SectionTitle icon={Layers}>Categorías de exposición</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIAS_EXPO.map(c => (
            <div key={c.id} className="poa-card p-2.5 text-center">
              <div className="text-sm font-medium text-[var(--ink)]">{c.nombre}</div>
              <div className="text-xs text-[var(--slate3)]">{c.desde} {c.hasta ? `a ${c.hasta}` : "en adelante"} {c.unidad}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="poa-card p-5">
        <SectionTitle icon={ScrollText} action={
          <div className="flex gap-2">
            <select value={catFiltro} onChange={e => setCatFiltro(e.target.value)} className="text-xs border poa-hairline rounded px-2 py-1 bg-white"><option value="">Categoría</option>{CATEGORIAS_EXPO.map(c => <option key={c.id}>{c.nombre}</option>)}</select>
            <select value={sexoFiltro} onChange={e => setSexoFiltro(e.target.value)} className="text-xs border poa-hairline rounded px-2 py-1 bg-white"><option value="">Sexo</option><option>Macho</option><option>Hembra</option></select>
          </div>
        }>Catálogo digital</SectionTitle>
        {filas.length ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[800px]">
            <thead><tr><Th>N.º</Th><Th>Ejemplar</Th><Th>N.º POA</Th><Th>Nacimiento</Th><Th>Categoría</Th><Th>Sexo/Pelo</Th><Th>Criador</Th><Th>Agrupación</Th></tr></thead>
            <tbody>{filas.map(c => {
              const p = perro(c.perroId);
              return (
                <tr key={c.nro} className="poa-row cursor-pointer" onClick={() => go({ module: "ejemplarFicha", id: c.perroId })}>
                  <Td className="poa-mono">{c.nro}</Td><Td className="font-medium text-[var(--ink)]">{p.nombre}</Td><Td className="poa-mono">{p.poa}</Td>
                  <Td>{fmtDate(p.nacimiento)}</Td><Td>{c.categoria}</Td><Td>{c.sexo} / {c.pelo}</Td><Td>{criadero(p.criadorId)?.afijo}</Td><Td>{c.agrupacion}</Td>
                </tr>
              );
            })}</tbody>
          </table></div>
        ) : <Empty icon={ScrollText} title="Sin inscriptos cargados para esta exposición" />}
      </div>
    </div>
  );
}

/* -------------------------------- TORNEOS ----------------------------------- */

function TorneosList({ go }) {
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Torneos</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">1 torneo activo <DemoPill className="ml-1 align-middle" /></p>
      {Object.values(TORNEOS).map(t => (
        <button key={t.id} onClick={() => go({ module: "torneoDetalle", id: t.id })} className="poa-focus poa-card p-4 w-full text-left hover:border-[var(--oxblood)]">
          <div className="poa-serif text-lg text-[var(--ink)]">{t.nombre}</div>
          <div className="text-xs text-[var(--slate3)] mt-1">{t.fechas.length} fechas programadas</div>
        </button>
      ))}
    </div>
  );
}

function TorneoDetalle({ id, go }) {
  const t = TORNEOS[id];
  if (!t) return <div className="p-6"><Empty title="Torneo no encontrado" /></div>;
  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-4">{t.nombre}</h1>

      <div className="poa-card p-5 mb-4">
        <SectionTitle icon={CalendarDays}>Torneo → Fechas → Exposiciones → Inscripciones → Resultados → Puntajes → Ranking</SectionTitle>
        <div className="flex overflow-x-auto poa-scroll gap-3 pb-1">
          {t.fechas.map(f => (
            <div key={f.nro} className="poa-card p-3 min-w-[160px] shrink-0">
              <div className="text-xs text-[var(--slate3)]">Fecha {f.nro}</div>
              <div className="text-sm font-medium text-[var(--ink)]">{f.mes}</div>
              <div className="text-xs text-[var(--slate3)] mt-1">{f.sede}</div>
              <div className="text-xs text-[var(--slate3)] flex items-center gap-1 mt-1"><Gavel size={11} />{persona(f.juezId)?.nombre}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="poa-card p-5">
          <SectionTitle icon={Trophy}>Ranking de agrupaciones</SectionTitle>
          {t.rankingAgrupaciones.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b poa-hairline last:border-b-0">
              <span className="poa-serif text-lg w-6 text-[var(--slate3)]">{i + 1}</span>
              <span className="flex-1 text-sm text-[var(--ink)]">{r.agrupacion}</span>
              <span className="poa-mono text-sm text-[var(--oxblood)] font-medium">{r.puntos} pts</span>
            </div>
          ))}
        </div>
        <div className="poa-card p-5">
          <SectionTitle icon={Award}>Ranking de ejemplares</SectionTitle>
          {t.rankingEjemplares.map((r, i) => (
            <button key={i} onClick={() => go({ module: "ejemplarFicha", id: r.perroId })} className="poa-focus w-full flex items-center gap-3 py-2 border-b poa-hairline last:border-b-0 text-left hover:bg-[#FBFAF7]">
              <span className="poa-serif text-lg w-6 text-[var(--slate3)]">{i + 1}</span>
              <span className="flex-1 min-w-0"><span className="text-sm text-[var(--ink)] font-medium">{perro(r.perroId)?.nombre}</span><span className="text-xs text-[var(--slate3)] block">{r.categoria}</span></span>
              <span className="poa-mono text-sm text-[var(--oxblood)] font-medium">{r.puntos} pts</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- FILIALES ----------------------------------- */

function FilialesList({ go }) {
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Filiales y Agrupaciones</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Datos de referencia extraídos del relevamiento documental <DemoPill className="ml-1 align-middle" /></p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FILIALES.map(f => {
          const nSocios = Object.values(SOCIOS).filter(s => s.filialId === f.id).length;
          return (
            <div key={f.id} className="poa-card p-4">
              <div className="flex items-center gap-2"><Landmark size={15} className="text-[var(--oxblood)]" /><span className="poa-mono text-xs text-[var(--slate3)]">{f.sigla}</span></div>
              <div className="text-sm font-medium text-[var(--ink)] mt-1">{f.nombre}</div>
              <div className="text-xs text-[var(--slate3)] mt-1">{f.ciudad} · {nSocios} socios en el padrón DEMO</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[var(--slate3)] mt-4">No se completó información adicional (autoridades, contacto) que no figuraba en el relevamiento documental.</p>
    </div>
  );
}

/* ------------------------------- DOCUMENTOS ----------------------------------- */

function DocumentosModule({ go }) {
  const [tipo, setTipo] = useState("");
  const rows = DOCUMENTOS.filter(d => !tipo || d.tipo === tipo);
  const tipos = [...new Set(DOCUMENTOS.map(d => d.tipo))];
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="poa-serif text-2xl text-[var(--ink)]">Documentos</h1><p className="text-sm text-[var(--slate3)]">Repositorio documental <DemoPill className="ml-1 align-middle" /></p></div>
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="text-sm border poa-hairline rounded px-2.5 py-1.5 bg-white text-[var(--ink)]">
          <option value="">Todos los tipos</option>{tipos.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {rows.map(d => (
          <div key={d.id} className="poa-card p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText size={18} className="text-[var(--slate3)] shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-[var(--ink)] truncate">{d.nombre}</div>
                <div className="text-xs text-[var(--slate3)] flex flex-wrap gap-x-2">
                  <span>{d.tipo}</span><span>·</span><span>{fmtDate(d.fecha)}</span>
                  {d.relacion.perroId && <><span>·</span><button onClick={() => go({ module: "ejemplarFicha", id: d.relacion.perroId })} className="poa-focus text-[var(--oxblood)] hover:underline">{perro(d.relacion.perroId)?.nombre}</button></>}
                  {d.relacion.personaId && <><span>·</span><span>{persona(d.relacion.personaId)?.nombre}</span></>}
                  {d.relacion.tramiteId && <><span>·</span><button onClick={() => go({ module: "tramiteDetalle", id: d.relacion.tramiteId })} className="poa-focus text-[var(--oxblood)] hover:underline poa-mono">{d.relacion.tramiteId}</button></>}
                </div>
              </div>
            </div>
            <Badge tone={d.estado}>{d.estado}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ DIAGNOSTICOS (GLOBAL) -------------------------- */

function DiagnosticosModule({ go }) {
  const rows = Object.values(PERROS).flatMap(p => (p.diagnosticos || []).map(d => ({ ...d, perroId: p.id })));
  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Diagnósticos</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Cadera · Codo · Certificación dentaria <DemoPill className="ml-1 align-middle" /></p>
      <div className="poa-card overflow-x-auto mb-4">
        <table className="w-full min-w-[800px]">
          <thead><tr><Th>Ejemplar</Th><Th>Tipo</Th><Th>Resultado</Th><Th>Fecha</Th><Th>Veterinario</Th><Th>Ámbito</Th><Th>Estado</Th></tr></thead>
          <tbody>{rows.map((d, i) => (
            <tr key={i} className="poa-row cursor-pointer" onClick={() => go({ module: "ejemplarFicha", id: d.perroId })}>
              <Td className="font-medium text-[var(--oxblood)]">{perro(d.perroId)?.nombre}</Td>
              <Td>{d.tipo}</Td><Td>{d.resultado}</Td><Td>{fmtDate(d.fecha)}</Td><Td>{persona(d.veterinarioId)?.nombre}</Td><Td>{d.ambito}</Td>
              <Td><Badge tone={d.estado}>{d.estado}</Badge></Td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="poa-card p-4 text-xs text-[var(--slate3)] flex items-start gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        Resultados visibles en el relevamiento: <strong className="text-[var(--slate2)] mx-1">Normal</strong>, <strong className="text-[var(--slate2)] mx-1">Casi Normal</strong> y <strong className="text-[var(--slate2)] mx-1">Todavía permitido</strong>. La interfaz queda preparada para incorporar categorías adicionales cuando se confirmen contra el reglamento oficial.
      </div>
    </div>
  );
}

/* ------------------------------ PORTAL PÚBLICO --------------------------------- */

function QRDemo({ seed = "poa-45872" }) {
  // patrón determinístico (no es un QR real y decodificable — solo representación visual DEMO)
  const size = 21;
  const cells = [];
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 8) / 16777216; };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cells.push(rand() > 0.56);
  const isFinder = (x, y) => (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="152" height="152" style={{ background: "white" }}>
      {cells.map((on, i) => {
        const x = i % size, y = Math.floor(i / size);
        if (isFinder(x, y)) return null;
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1B2330" /> : null;
      })}
      {[[0, 0], [size - 7, 0], [0, size - 7]].map(([fx, fy], k) => (
        <g key={k} transform={`translate(${fx},${fy})`}>
          <rect width="7" height="7" fill="#1B2330" />
          <rect x="1" y="1" width="5" height="5" fill="white" />
          <rect x="2" y="2" width="3" height="3" fill="#1B2330" />
        </g>
      ))}
    </svg>
  );
}

function PortalPublico({ go, id }) {
  const [q, setQ] = useState(id ? PERROS[id]?.poa || "" : "");
  const [found, setFound] = useState(id ? PERROS[id] : null);
  const buscar = () => {
    const p = Object.values(PERROS).find(x => x.poa.replace(/\D/g, "") === q.replace(/\D/g, "") || x.nombre.toLowerCase() === q.toLowerCase() || x.microchip.toLowerCase() === q.toLowerCase() || x.tatuaje.toLowerCase() === q.toLowerCase());
    setFound(p || null);
  };
  return (
    <div className="min-h-full" style={{ background: "var(--ink)" }}>
      <div className="max-w-[720px] mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--brass)" }}><PawPrint size={17} color="var(--ink)" /></div>
            <div><div className="poa-serif text-white text-base leading-none">POA Digital</div><div className="text-[10px] text-white/50">Consulta de ejemplares</div></div>
          </div>
          <button onClick={() => go("dashboard")} className="poa-focus text-xs text-white/60 hover:text-white flex items-center gap-1"><ArrowLeft size={12} /> Panel interno</button>
        </div>

        <h1 className="poa-serif text-3xl text-white mb-1">Consulta de ejemplares</h1>
        <p className="text-white/50 text-sm mb-6">Buscá por N.º POA, nombre, microchip o tatuaje. <DemoPill /></p>

        <div className="flex gap-2 mb-8">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && buscar()} placeholder="Ej: 45872 o MAX VON EXAMPLE"
            className="flex-1 px-4 py-3 rounded-md text-sm outline-none" style={{ background: "#2A3340", color: "white" }} />
          <button onClick={buscar} className="poa-focus px-5 rounded-md text-sm font-medium text-white" style={{ background: "var(--oxblood)" }}>Buscar</button>
        </div>

        {found === null && q && <div className="text-white/50 text-sm">Sin resultados para "{q}".</div>}

        {found && (
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="poa-mono text-xs text-[var(--slate3)]">{found.poa}</div>
                <h2 className="poa-serif text-2xl text-[var(--ink)]">{found.nombre}</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label="Fecha de nacimiento">{fmtDate(found.nacimiento)}</Field>
                  <Field label="Sexo">{found.sexo}</Field>
                  <Field label="Afijo">{criadero(found.criadorId)?.afijo}</Field>
                  <Field label="Criador">{persona(criadero(found.criadorId)?.titularId)?.nombre}</Field>
                  <Field label="Pedigree">Emitido — vigente</Field>
                  <Field label="Estado registral">{found.estado}</Field>
                  <Field label="Selección">{found.seleccion ? `${found.seleccion.clase} — ${found.seleccion.resultado}` : "Sin registrar"}</Field>
                  <Field label="Resultados autorizados">{found.exposiciones?.length ? `${found.exposiciones.length} participación(es)` : "—"}</Field>
                </div>
                <p className="text-[11px] text-[var(--slate3)] mt-4">No se muestran datos personales (DNI, domicilio, teléfono o email) por tratarse de información privada.</p>
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="p-2 border poa-hairline rounded"><QRDemo seed={found.poa} /></div>
                <div className="text-[10px] text-[var(--slate3)] poa-mono text-center">/public/ejemplar/{found.id}</div>
                <span className="text-[10px] text-[var(--slate3)]">QR de demostración</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------- USUARIOS / SUPERADMIN / AUDITORIA / CONFIG ----------- */

function UsuariosModule() {
  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Usuarios y roles</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Permisos preparados por rol <DemoPill className="ml-1 align-middle" /></p>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {ROLES.map(r => (
          <div key={r.id} className="poa-card p-4">
            <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[var(--oxblood)]" /><span className="text-sm font-medium text-[var(--ink)]">{r.nombre}</span></div>
            <p className="text-xs text-[var(--slate3)] mt-1.5">{r.desc}</p>
          </div>
        ))}
      </div>
      <div className="poa-card p-5">
        <SectionTitle icon={UserCog}>Superadmin</SectionTitle>
        <p className="text-sm text-[var(--slate2)] mb-3">El Superadmin administra la plataforma más allá de una única organización.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["Organizaciones", "Usuarios", "Roles", "Módulos", "Configuración", "Aranceles", "Filiales", "Auditoría"].map(m => (
            <div key={m} className="text-xs text-center py-2 rounded border poa-hairline text-[var(--slate2)]">{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditoriaModule() {
  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Auditoría</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Registro de eventos del sistema <DemoPill className="ml-1 align-middle" /></p>
      <div className="poa-card">
        {AUDITORIA.map((a, i) => (
          <div key={a.id} className={`p-4 flex gap-3 ${i > 0 ? "border-t poa-hairline" : ""}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--blue-tint)" }}><History size={13} style={{ color: "var(--blue)" }} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[var(--ink)]">{a.accion} — <span className="font-medium">{a.entidad}</span></div>
              <div className="text-xs text-[var(--slate3)] mt-0.5">{a.usuario} · {a.fecha}</div>
              <div className="text-xs mt-1 flex items-center gap-2"><span className="poa-mono px-1.5 py-0.5 rounded bg-[#F6E6E4] text-[var(--red)]">{a.anterior}</span><ChevronRight size={11} className="text-[var(--slate3)]" /><span className="poa-mono px-1.5 py-0.5 rounded bg-[#E7EFE7] text-[var(--green)]">{a.nuevo}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfiguracionModule() {
  const secciones = ["Organización", "Identidad visual", "Usuarios", "Roles", "Categorías", "Tipos de trámites", "Estados", "Aranceles", "Filiales", "Reglas", "Notificaciones", "Seguridad"];
  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto">
      <h1 className="poa-serif text-2xl text-[var(--ink)] mb-1">Configuración</h1>
      <p className="text-sm text-[var(--slate3)] mb-4">Editable por el Superadmin / Admin POA <DemoPill className="ml-1 align-middle" /></p>

      <div className="poa-card p-5 mb-4">
        <SectionTitle icon={Building2}>Organización</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre">{ORG.nombre}</Field>
          <Field label="Sigla">{ORG.sigla}</Field>
          <Field label="Personería jurídica">{ORG.personeria}</Field>
          <Field label="Domicilio">{ORG.domicilio}</Field>
        </div>
      </div>

      <div className="poa-card p-5 mb-4">
        <SectionTitle icon={Settings}>Secciones</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {secciones.map(s => <div key={s} className="text-sm px-3 py-2 rounded border poa-hairline text-[var(--slate2)] flex items-center justify-between">{s}<ChevronRight size={13} className="text-[var(--slate3)]" /></div>)}
        </div>
      </div>

      <div className="poa-card p-5">
        <SectionTitle icon={Layers}>Plan de suscripción</SectionTitle>
        <div className="flex items-center justify-between">
          <div>
            <div className="poa-serif text-lg text-[var(--ink)]">Plan Profesional — DEMO</div>
            <div className="text-xs text-[var(--slate3)]">Estructura preparada para facturación; sin cobros reales en esta demo.</div>
          </div>
          <Badge tone="Activo">Activo</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {["Ejemplares", "Socios", "Pedigrees", "Trámites", "Exposiciones", "Torneos", "Documentos", "Aranceles"].map(m => (
            <div key={m} className="text-xs flex items-center gap-1.5 text-[var(--slate2)]"><Check size={12} style={{ color: "var(--green)" }} />{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- APP ------------------------------------- */

function labelFor(node) {
  const m = typeof node === "string" ? node : node.module;
  const id = typeof node === "string" ? null : node.id;
  const map = {
    dashboard: "Dashboard", ejemplares: "Ejemplares", criadores: "Criadores y Afijos", camadas: "Camadas",
    socios: "Socios", filiales: "Filiales", tramites: "Trámites", aranceles: "Pagos y Aranceles",
    diagnosticos: "Diagnósticos", documentos: "Documentos", exposiciones: "Exposiciones", torneos: "Torneos",
    usuarios: "Usuarios y roles", configuracion: "Configuración", portal: "Portal público",
    ejemplarFicha: perro(id)?.nombre || "Ejemplar", socioFicha: SOCIOS[id] ? persona(SOCIOS[id].personaId)?.nombre : "Socio",
    criaderoFicha: CRIADEROS[id]?.afijo || "Criadero", camadaFicha: CAMADAS[id]?.codigo || "Camada",
    tramiteDetalle: id || "Trámite", exposicionDetalle: EXPOSICIONES[id]?.nombre || "Exposición",
    torneoDetalle: TORNEOS[id]?.nombre || "Torneo", transferenciaForm: "Nueva transferencia",
  };
  return map[m] || m;
}

const ROOT_OF = {
  ejemplarFicha: "ejemplares", socioFicha: "socios", criaderoFicha: "criadores", camadaFicha: "camadas",
  tramiteDetalle: "tramites", transferenciaForm: "tramites", exposicionDetalle: "exposiciones", torneoDetalle: "torneos",
};

export default function App() {
  const [stack, setStack] = useState([{ module: "dashboard" }]);
  const [ejemplarTab, setEjemplarTab] = useState("resumen");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = stack[stack.length - 1];

  const navRoot = (moduleId) => {
    setStack([{ module: moduleId }]);
    setEjemplarTab("resumen");
  };
  const go = (next) => {
    const node = typeof next === "string" ? { module: next } : next;
    if (node.module === "ejemplarFicha") setEjemplarTab("resumen");
    // if navigating to a root-level module directly (e.g. from sidebar handled by navRoot), else push
    const rootOfNode = ROOT_OF[node.module] || node.module;
    setStack(s => {
      // avoid deep unbounded stacks: if same module+id already top, no-op
      const top = s[s.length - 1];
      if (top.module === node.module && top.id === node.id) return s;
      return [...s, node];
    });
  };
  const back = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));

  const breadcrumb = stack.map(labelFor);
  const activeSidebar = ROOT_OF[current.module] || current.module;

  let content;
  switch (current.module) {
    case "dashboard": content = <Dashboard go={go} />; break;
    case "ejemplares": content = <EjemplaresList go={go} />; break;
    case "ejemplarFicha": content = <EjemplarFicha id={current.id} go={go} tab={ejemplarTab} setTab={setEjemplarTab} />; break;
    case "criadores": content = <CriadoresList go={go} />; break;
    case "criaderoFicha": content = <CriaderoFicha id={current.id} go={go} />; break;
    case "camadas": content = <CamadasList go={go} />; break;
    case "camadaFicha": content = <CamadaFicha id={current.id} go={go} />; break;
    case "socios": content = <SociosList go={go} />; break;
    case "socioFicha": content = <SocioFicha id={current.id} go={go} />; break;
    case "filiales": content = <FilialesList go={go} />; break;
    case "tramites": content = <TramitesList go={go} />; break;
    case "tramiteDetalle": content = <TramiteDetalle id={current.id} go={go} />; break;
    case "transferenciaForm": content = <TransferenciaForm go={go} />; break;
    case "aranceles": content = <ArancelesModule go={go} />; break;
    case "diagnosticos": content = <DiagnosticosModule go={go} />; break;
    case "documentos": content = <DocumentosModule go={go} />; break;
    case "exposiciones": content = <ExposicionesList go={go} />; break;
    case "exposicionDetalle": content = <ExposicionDetalle id={current.id} go={go} />; break;
    case "torneos": content = <TorneosList go={go} />; break;
    case "torneoDetalle": content = <TorneoDetalle id={current.id} go={go} />; break;
    case "usuarios": content = <UsuariosModule />; break;
    case "configuracion": content = <ConfiguracionModule />; break;
    case "portal": content = <PortalPublico go={navRoot} id={current.id} />; break;
    default: content = <Dashboard go={go} />;
  }

  if (current.module === "portal") {
    return (
      <div className="poa-root min-h-screen">
        <GlobalStyles />
        {content}
      </div>
    );
  }

  return (
    <div className="poa-root min-h-screen flex">
      <GlobalStyles />
      <Sidebar current={activeSidebar} onNav={navRoot} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onNav={go} onToggleMobile={() => setMobileOpen(true)} breadcrumb={breadcrumb} onBack={back} />
        <main className="flex-1 min-w-0">{content}</main>
        <footer className="px-6 py-4 text-center text-[11px] text-[var(--slate3)] border-t poa-hairline">
          POA Digital — Entorno de demostración. Los datos mostrados son ficticios y no representan registros oficiales del Club.
        </footer>
      </div>
    </div>
  );
}
