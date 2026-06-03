// ── Jee.ply · Jeepney Routes ──────────────────────────────────────────────
// Routes verified via LTFRB Region 7 franchise data and CommuteTour.
//
// Helper: shorthand to build a stop object from COORDS
const stop = (name) => ({ name, ...COORDS[name] });

const JEEP_ROUTES = {

  // ── TRADITIONAL CITY ROUTES ─────────────────────────────────────────────

  "01K": {
    name: "Urgello – Parkmall",
    color: "#e63946",
    stops: [
      stop("Urgello"),
      stop("V. Rama Ave"),
      stop("South Bus Terminal"),
      stop("Colon"),
      stop("Carbon"),
      stop("Pier"),
      stop("SM City Cebu"),
      stop("Parkmall")
    ]
  },

  "02B": {
    name: "South Bus Terminal – Colon",
    color: "#457b9d",
    stops: [
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon")
    ]
  },

  "03A": {
    name: "Mabolo – Carbon",
    color: "#2a9d8f",
    stops: [
      stop("Mabolo"),
      stop("IT Park"),
      stop("Ayala Center Cebu"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon"),
      stop("SM City Cebu")
    ]
  },

  "03B": {
    name: "Mabolo – Carbon (via Maxilom)",
    color: "#c9a227",
    stops: [
      stop("Mabolo"),
      stop("SM City Cebu"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon")
    ]
  },

  "03Q": {
    name: "Ayala – SM",
    color: "#f4a261",
    stops: [
      stop("Ayala Center Cebu"),
      stop("IT Park"),
      stop("SM City Cebu")
    ]
  },

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
      stop("Carbon")
    ]
  },

  "04L": {
    name: "Lahug – Ayala",
    color: "#219ebc",
    stops: [
      stop("Lahug (Jy Square)"),
      stop("IT Park"),
      stop("Ayala Center Cebu")
    ]
  },

  "06B": {
    name: "Guadalupe – Carbon",
    color: "#fb8500",
    stops: [
      stop("Guadalupe"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Robinsons Place"),
      stop("Colon"),
      stop("Carbon")
    ]
  },

  "06H": {
    name: "Guadalupe – SM",
    color: "#023047",
    stops: [
      stop("Guadalupe"),
      stop("Capitol"),
      stop("Ayala Center Cebu"),
      stop("SM City Cebu")
    ]
  },

  "07B": {
    name: "Banawa – Carbon",
    color: "#c77dff",
    stops: [
      stop("Banawa"),
      stop("Guadalupe"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon")
    ]
  },

  "08F": {
    name: "Alumnos – SM",
    color: "#80b918",
    stops: [
      stop("Alumnos"),
      stop("Mambaling"),
      stop("South Bus Terminal"),
      stop("Colon"),
      stop("Pier"),
      stop("SM City Cebu")
    ]
  },

  "09C": {
    name: "Basak San Nicolas – Colon via Punta",
    color: "#d62828",
    stops: [
      stop("Quiot / Basak San Nicolas"),
      stop("Punta Princesa"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Colon")
    ]
  },

  "09G": {
    name: "Basak San Nicolas – Colon via Punta (alt)",
    color: "#b71c1c",
    stops: [
      stop("Quiot / Basak San Nicolas"),
      stop("Punta Princesa"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Colon")
    ]
  },

  // ── SOUTH HIGHWAY ROUTES (Bulacao / Inayawan) ───────────────────────────

  "10F": {
    name: "Bulacao – Colon via Highway",
    color: "#003049",
    stops: [
      stop("Bulacao"),
      stop("Pardo"),
      stop("Basak San Nicolas"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Colon")
    ]
  },

  "10H": {
    name: "Bulacao – SM via Highway",
    color: "#37474f",
    stops: [
      stop("Bulacao"),
      stop("Pardo"),
      stop("Basak San Nicolas"),
      stop("Mambaling Flyover"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Ayala Center Cebu"),
      stop("SM City Cebu")
    ]
  },

  "11A": {
    name: "Inayawan – Colon",
    color: "#6a994e",
    stops: [
      stop("Inayawan"),
      stop("Quiot / Basak San Nicolas"),
      stop("South Bus Terminal"),
      stop("Urgello"),
      stop("Colon")
    ]
  },

  // ── MID/NORTH CITY ROUTES ───────────────────────────────────────────────

  "12D": {
    name: "Labangon – Colon",
    color: "#0077b6",
    stops: [
      stop("Labangon Market"),
      stop("Labangon"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon")
    ]
  },

  "12G": {
    name: "Labangon/Punta Princesa – SM",
    color: "#1976d2",
    stops: [
      stop("Punta Princesa"),
      stop("Labangon Market"),
      stop("Miller Hospital"),
      stop("CITU"),
      stop("Taboan Market"),
      stop("City Hall"),
      stop("Pier"),
      stop("SM City Cebu")
    ]
  },

  "12L": {
    name: "Tisa/Labangon – Ayala",
    color: "#0d47a1",
    stops: [
      stop("Tisa"),
      stop("Punta Princesa"),
      stop("Labangon Market"),
      stop("Miller Hospital"),
      stop("CITU"),
      stop("N. Bacalso Ave"),
      stop("USC South Campus"),
      stop("Vicente Sotto Hosp."),
      stop("Mango Square / Escario"),
      stop("USC North Campus"),
      stop("Ayala Center Cebu")
    ]
  },

  "13C": {
    name: "Talamban – Colon",
    color: "#ae2012",
    stops: [
      stop("Talamban"),
      stop("Apas"),
      stop("Lahug (Jy Square)"),
      stop("Gorordo Ave"),
      stop("Fuente Osmeña"),
      stop("Colon")
    ]
  },

  "14D": {
    name: "Ayala – Colon",
    color: "#005f73",
    stops: [
      stop("Ayala Center Cebu"),
      stop("Escario Central Mall"),
      stop("Urgello"),
      stop("Fuente Osmeña"),
      stop("Colon")
    ]
  },

  "17B": {
    name: "Apas – Carbon",
    color: "#0a9396",
    stops: [
      stop("Apas"),
      stop("IT Park"),
      stop("Capitol"),
      stop("Fuente Osmeña"),
      stop("Urgello"),
      stop("Colon"),
      stop("Carbon")
    ]
  },

  "20A": {
    name: "Mandaue – Ayala",
    color: "#7209b7",
    stops: [
      stop("Mandaue"),
      stop("Parkmall"),
      stop("SM City Cebu"),
      stop("Mabolo"),
      stop("Ayala Center Cebu")
    ]
  },

  "21A": {
    name: "Mandaue – Cathedral",
    color: "#560bad",
    stops: [
      stop("Mandaue"),
      stop("SM City Cebu"),
      stop("Pier"),
      stop("Carbon"),
      stop("Cathedral")
    ]
  },

  "62B": {
    name: "Pit-os – Carbon",
    color: "#3a0ca3",
    stops: [
      stop("Pit-os"),
      stop("Talamban"),
      stop("Mabolo"),
      stop("Apas"),
      stop("IT Park"),
      stop("Fuente Osmeña"),
      stop("Colon"),
      stop("Carbon")
    ]
  },

  // ── DEEP SOUTH / TALISAY (Traditional Lines) ────────────────────────────

  "41D": {
    name: "Tabunok – Taboan via V. Rama",
    color: "#6c757d",
    stops: [
      stop("Tabunok"),
      stop("Bulacao"),
      stop("Pardo"),
      stop("Basak San Nicolas"),
      stop("Mambaling Flyover"),
      stop("CITU"),
      stop("V. Rama Ave"),
      stop("Taboan Market"),
      stop("Carbon")
    ]
  },

  "42D": {
    name: "Talisay – Taboan via V. Rama",
    color: "#495057",
    stops: [
      stop("Talisay City"),
      stop("Tabunok"),
      stop("Bulacao"),
      stop("Pardo"),
      stop("Basak San Nicolas"),
      stop("Mambaling Flyover"),
      stop("CITU"),
      stop("V. Rama Ave"),
      stop("Taboan Market"),
      stop("Carbon")
    ]
  },

  // ── MODERN BUSES & JEEPS ────────────────────────────────────────────────

  "MYB-1": {
    name: "MyBus: SM City ↔ Talisay (via SRP)",
    color: "#118ab2",
    stops: [
      stop("SM City Cebu"),
      stop("Pier"),
      stop("City Hall"),
      stop("SM Seaside City Cebu"),
      stop("Il Corso Lifemalls"),
      stop("Talisay City")
    ]
  },

  "MYB-2": {
    name: "MyBus: Airport ↔ SM City",
    color: "#073b4c",
    stops: [
      stop("Mactan Airport (MCIA)"),
      stop("Lapu-Lapu City (Opon)"),
      stop("Parkmall"),
      stop("North Bus Terminal"),
      stop("SM City Cebu")
    ]
  },

  "MYB-3": {
    name: "MyBus: IT Park ↔ SM Seaside",
    color: "#06d6a0",
    stops: [
      stop("IT Park"),
      stop("SM City Cebu"),
      stop("Pier"),
      stop("SM Seaside City Cebu")
    ]
  },

  "MJ-1": {
    name: "Mango Jeep (Modern): Talisay ↔ IT Park",
    color: "#fca311",
    stops: [
      stop("Poblacion Talisay"),
      stop("Tabunok"),
      stop("Bulacao"),
      stop("Pardo"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Fuente Osmeña"),
      stop("Escario Central Mall"),
      stop("Ayala Center Cebu"),
      stop("IT Park")
    ]
  },

  "CIBUS": {
    name: "CIBus: Seaside ↔ IT Park",
    color: "#ef476f",
    stops: [
      stop("SM Seaside City Cebu"),
      stop("CITU"),
      stop("South Bus Terminal"),
      stop("Fuente Osmeña"),
      stop("Robinsons Place"),
      stop("IT Park")
    ]
  }

};