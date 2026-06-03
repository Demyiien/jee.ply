// ── Jee.ply · Jeepney Routes ──────────────────────────────────────────────
// Coordinates are pulled from coordinates.js — do not hardcode lat/lng here.
// To fix a coordinate, edit coordinates.js only.
//
// Helper: shorthand to build a stop object from COORDS
const stop = (name) => ({ name, ...COORDS[name] });

const JEEP_ROUTES = {

  // ── 01K: Urgello ↔ Parkmall ──────────────────────────────────────────────
  "01K": {
    name: "Urgello – Parkmall",
    color: "#e63946",
    stops: [
      stop("Urgello"),
      stop("V. Rama Ave"),
      stop("Colon"),
      stop("Carbon"),
      stop("Pier"),
      stop("SM City Cebu"),
      stop("Parkmall"),
    ]
  },

  // ── 02B: South Bus Terminal ↔ Colon ──────────────────────────────────────
  "02B": {
    name: "South Bus Terminal – Colon",
    color: "#457b9d",
    stops: [
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon"),
    ]
  },

  // ── 03A: Mabolo ↔ Carbon ─────────────────────────────────────────────────
  "03A": {
    name: "Mabolo – Carbon",
    color: "#2a9d8f",
    stops: [
      stop("Mabolo"),
      stop("SM City Cebu"),
      stop("IT Park"),
      stop("Ayala Center Cebu"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 03B: Mabolo ↔ Carbon (via Maxilom) ───────────────────────────────────
  "03B": {
    name: "Mabolo – Carbon (via Maxilom)",
    color: "#c9a227",
    stops: [
      stop("Mabolo"),
      stop("SM City Cebu"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 03Q: Ayala ↔ SM ───────────────────────────────────────────────────────
  "03Q": {
    name: "Ayala – SM",
    color: "#f4a261",
    stops: [
      stop("Ayala Center Cebu"),
      stop("IT Park"),
      stop("SM City Cebu"),
    ]
  },

  // ── 04B: Lahug ↔ Carbon ───────────────────────────────────────────────────
  "04B": {
    name: "Lahug – Carbon",
    color: "#6a4c93",
    stops: [
      stop("Lahug (Jy Square)"),
      stop("Gorordo Ave"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Robinsons Place"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 04H: Plaza Housing ↔ Carbon ───────────────────────────────────────────
  "04H": {
    name: "Plaza Housing – Carbon",
    color: "#8ecae6",
    stops: [
      stop("Plaza Housing"),
      stop("Lahug (Jy Square)"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 04L: Lahug ↔ Ayala ────────────────────────────────────────────────────
  "04L": {
    name: "Lahug – Ayala",
    color: "#219ebc",
    stops: [
      stop("Lahug (Jy Square)"),
      stop("IT Park"),
      stop("Ayala Center Cebu"),
    ]
  },

  // ── 06B: Guadalupe ↔ Carbon ──────────────────────────────────────────────
  "06B": {
    name: "Guadalupe – Carbon",
    color: "#fb8500",
    stops: [
      stop("Guadalupe"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Robinsons Place"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 06H: Guadalupe ↔ SM ───────────────────────────────────────────────────
  "06H": {
    name: "Guadalupe – SM",
    color: "#023047",
    stops: [
      stop("Guadalupe"),
      stop("Ayala Center Cebu"),
      stop("SM City Cebu"),
    ]
  },

  // ── 07B: Banawa ↔ Carbon ─────────────────────────────────────────────────
  "07B": {
    name: "Banawa – Carbon",
    color: "#c77dff",
    stops: [
      stop("Banawa"),
      stop("Guadalupe"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 08F: Alumnos ↔ SM ─────────────────────────────────────────────────────
  "08F": {
    name: "Alumnos – SM",
    color: "#80b918",
    stops: [
      stop("Alumnos"),
      stop("Mambaling"),
      stop("CSBT"),
      stop("Colon"),
      stop("Pier"),
      stop("SM City Cebu"),
    ]
  },

  // ── 08G: Alumnos ↔ Colon ─────────────────────────────────────────────────
  "08G": {
    name: "Alumnos – Colon",
    color: "#558b2f",
    stops: [
      stop("Alumnos"),
      stop("Mambaling"),
      stop("CSBT"),
      stop("Colon"),
    ]
  },

  // ── 09C: Basak San Nicolas ↔ Colon ───────────────────────────────────────
  "09C": {
    name: "Basak San Nicolas – Colon",
    color: "#d62828",
    stops: [
      stop("Quiot / Basak San Nicolas"),
      stop("SWU Basak Campus"),
      stop("Mambaling Flyover"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Colon"),
    ]
  },

  // ── 09G: Basak San Nicolas ↔ Colon (alt) ─────────────────────────────────
  "09G": {
    name: "Basak San Nicolas – Colon (alt)",
    color: "#b71c1c",
    stops: [
      stop("Quiot / Basak San Nicolas"),
      stop("Mambaling Flyover"),
      stop("South Bus Terminal"),
      stop("Colon"),
    ]
  },

  // ── 10F: Bulacao ↔ Colon ─────────────────────────────────────────────────
  "10F": {
    name: "Bulacao – Colon",
    color: "#003049",
    stops: [
      stop("Bulacao"),
      stop("Tabunok"),
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Colon"),
    ]
  },

  // ── 10H: Bulacao ↔ SM ────────────────────────────────────────────────────
  "10H": {
    name: "Bulacao – SM",
    color: "#37474f",
    stops: [
      stop("Bulacao"),
      stop("Tabunok"),
      stop("South Bus Terminal"),
      stop("Ayala Center Cebu"),
      stop("SM City Cebu"),
    ]
  },

  // ── 11A: Inayawan ↔ Colon ────────────────────────────────────────────────
  "11A": {
    name: "Inayawan – Colon",
    color: "#6a994e",
    stops: [
      stop("Inayawan"),
      stop("Pardo"),
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Colon"),
    ]
  },

  // ── 12D: Labangon ↔ Colon ────────────────────────────────────────────────
  "12D": {
    name: "Labangon – Colon",
    color: "#0077b6",
    stops: [
      stop("Labangon Market"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon"),
    ]
  },

  // ── 12G: Labangon/Punta Princesa ↔ SM ────────────────────────────────────
  "12G": {
    name: "Labangon/Punta Princesa – SM",
    color: "#1976d2",
    stops: [
      stop("Punta Princesa"),
      stop("Miller Hospital"),
      stop("CITU"),
      stop("Taboan Market"),
      stop("City Hall"),
      stop("Pier"),
      stop("SM City Cebu"),
    ]
  },

  // ── 12I: Labangon ↔ SM (alt) ─────────────────────────────────────────────
  "12I": {
    name: "Labangon – SM (alt)",
    color: "#1565c0",
    stops: [
      stop("Labangon Market"),
      stop("Urgello"),
      stop("Ayala Center Cebu"),
      stop("SM City Cebu"),
    ]
  },

  // ── 12L: Tisa/Labangon ↔ Ayala ───────────────────────────────────────────
  "12L": {
    name: "Tisa/Labangon – Ayala",
    color: "#0d47a1",
    stops: [
      stop("Tisa"),
      stop("Punta Princesa"),
      stop("Miller Hospital"),
      stop("Labangon Market"),
      stop("N. Bacalso Ave"),
      stop("USC South Campus"),
      stop("Vicente Sotto Hosp."),
      stop("Mango Square / Escario"),
      stop("USC North Campus"),
      stop("Ayala Center Cebu"),
    ]
  },

  // ── 13B: Talamban ↔ Carbon ───────────────────────────────────────────────
  "13B": {
    name: "Talamban – Carbon",
    color: "#9b2226",
    stops: [
      stop("Talamban"),
      stop("Pit-os"),
      stop("Apas"),
      stop("Lahug (Jy Square)"),
      stop("IT Park"),
      stop("Ayala Center Cebu"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 13C: Talamban ↔ Colon ────────────────────────────────────────────────
  "13C": {
    name: "Talamban – Colon",
    color: "#ae2012",
    stops: [
      stop("Talamban"),
      stop("Apas"),
      stop("Lahug (Jy Square)"),
      stop("Fuente Osmeña"),
      stop("Colon"),
    ]
  },

  // ── 14D: Ayala ↔ Colon ───────────────────────────────────────────────────
  "14D": {
    name: "Ayala – Colon",
    color: "#005f73",
    stops: [
      stop("Ayala Center Cebu"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon"),
    ]
  },

  // ── 17B: Apas ↔ Carbon ───────────────────────────────────────────────────
  "17B": {
    name: "Apas – Carbon",
    color: "#0a9396",
    stops: [
      stop("Apas"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Urgello"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 17C: Apas ↔ Carbon (via IT Park) ─────────────────────────────────────
  "17C": {
    name: "Apas – Carbon (via IT Park)",
    color: "#94d2bd",
    stops: [
      stop("Apas"),
      stop("IT Park"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 17D: Apas ↔ Carbon (alt) ─────────────────────────────────────────────
  "17D": {
    name: "Apas – Carbon (alt)",
    color: "#52b788",
    stops: [
      stop("Apas"),
      stop("Capitol"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

  // ── 20A: Mandaue ↔ Ayala ─────────────────────────────────────────────────
  "20A": {
    name: "Mandaue – Ayala",
    color: "#7209b7",
    stops: [
      stop("Mandaue"),
      stop("Parkmall"),
      stop("SM City Cebu"),
      stop("Ayala Center Cebu"),
    ]
  },

  // ── 21A: Mandaue ↔ Cathedral ─────────────────────────────────────────────
  "21A": {
    name: "Mandaue – Cathedral",
    color: "#560bad",
    stops: [
      stop("Mandaue"),
      stop("SM City Cebu"),
      stop("Pier"),
      stop("Carbon"),
      stop("Cathedral"),
    ]
  },

  // ── 62B: Pit-os ↔ Carbon ─────────────────────────────────────────────────
  "62B": {
    name: "Pit-os – Carbon",
    color: "#3a0ca3",
    stops: [
      stop("Pit-os"),
      stop("Talamban"),
      stop("Apas"),
      stop("IT Park"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
    ]
  },

};
