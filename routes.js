const JEEP_ROUTES = {

  // ── 01K: Urgello ↔ Parkmall ──────────────────────────────────────────────
  // Goes: Urgello → V.Rama → Colon → Carbon → Pier → SM → Parkmall
  "01K": {
    name: "Urgello – Parkmall",
    color: "#e63946",
    stops: [
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "V. Rama Ave",         lat: 10.3015, lng: 123.8889 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 },
      { name: "Pier",                lat: 10.2981, lng: 123.9052 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 },
      { name: "Parkmall",            lat: 10.3221, lng: 123.9358 }
    ]
  },

  // ── 02B: South Bus Terminal ↔ Colon ──────────────────────────────────────
  // Goes: CSBT → N.Bacalso → Urgello → Fuente → Colon
  "02B": {
    name: "South Bus Terminal – Colon",
    color: "#457b9d",
    stops: [
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 03A: Mabolo ↔ Carbon ─────────────────────────────────────────────────
  // Goes: Mabolo → SM → IT Park → Ayala → Fuente → Colon → Carbon
  "03A": {
    name: "Mabolo – Carbon",
    color: "#2a9d8f",
    stops: [
      { name: "Mabolo",              lat: 10.3226, lng: 123.9142 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 03B: Mabolo ↔ Carbon (via Maxilom) ───────────────────────────────────
  "03B": {
    name: "Mabolo – Carbon (via Maxilom)",
    color: "#c9a227",
    stops: [
      { name: "Mabolo",              lat: 10.3226, lng: 123.9142 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 03Q: Ayala ↔ SM ───────────────────────────────────────────────────────
  "03Q": {
    name: "Ayala – SM",
    color: "#f4a261",
    stops: [
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 04B: Lahug ↔ Carbon ───────────────────────────────────────────────────
  // Goes: Jy Square → Gorordo → Capitol → Fuente → Robinsons → Colon → Carbon
  "04B": {
    name: "Lahug – Carbon",
    color: "#6a4c93",
    stops: [
      { name: "Lahug (Jy Square)",   lat: 10.3458, lng: 123.8991 },
      { name: "Gorordo Ave",         lat: 10.3380, lng: 123.8990 },
      { name: "Capitol",             lat: 10.3287, lng: 123.8972 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Robinsons Place",     lat: 10.3012, lng: 123.8972 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 04H: Plaza Housing ↔ Carbon ───────────────────────────────────────────
  "04H": {
    name: "Plaza Housing – Carbon",
    color: "#8ecae6",
    stops: [
      { name: "Plaza Housing",       lat: 10.3510, lng: 123.8850 },
      { name: "Lahug (Jy Square)",   lat: 10.3458, lng: 123.8991 },
      { name: "Capitol",             lat: 10.3287, lng: 123.8972 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 04L: Lahug ↔ Ayala ────────────────────────────────────────────────────
  "04L": {
    name: "Lahug – Ayala",
    color: "#219ebc",
    stops: [
      { name: "Lahug (Jy Square)",   lat: 10.3458, lng: 123.8991 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 }
    ]
  },

  // ── 06B: Guadalupe ↔ Carbon ──────────────────────────────────────────────
  // Goes along Osmeña Blvd: Guadalupe → Capitol → Fuente → Robinsons → Colon → Carbon
  "06B": {
    name: "Guadalupe – Carbon",
    color: "#fb8500",
    stops: [
      { name: "Guadalupe",           lat: 10.3069, lng: 123.8756 },
      { name: "Capitol",             lat: 10.3287, lng: 123.8972 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Robinsons Place",     lat: 10.3012, lng: 123.8972 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 06H: Guadalupe ↔ SM ───────────────────────────────────────────────────
  "06H": {
    name: "Guadalupe – SM",
    color: "#023047",
    stops: [
      { name: "Guadalupe",           lat: 10.3069, lng: 123.8756 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 07B: Banawa ↔ Carbon ─────────────────────────────────────────────────
  // Banawa is west of Guadalupe, goes through Fuente area
  "07B": {
    name: "Banawa – Carbon",
    color: "#c77dff",
    stops: [
      { name: "Banawa",              lat: 10.3261, lng: 123.8728 },
      { name: "Guadalupe",           lat: 10.3069, lng: 123.8756 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 08F: Alumnos ↔ SM ─────────────────────────────────────────────────────
  // Alumnos is in Mambaling/south area, goes through Colon then SM
  // Route: Alumnos (Mambaling) → C.Padilla → Colon → Pier → SM
  "08F": {
    name: "Alumnos – SM",
    color: "#80b918",
    stops: [
      { name: "Alumnos",             lat: 10.2906, lng: 123.8771 },
      { name: "Mambaling",           lat: 10.2950, lng: 123.8823 },
      { name: "CSBT",                lat: 10.2976, lng: 123.8935 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Pier",                lat: 10.2981, lng: 123.9052 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 08G: Alumnos ↔ Colon ─────────────────────────────────────────────────
  "08G": {
    name: "Alumnos – Colon",
    color: "#558b2f",
    stops: [
      { name: "Alumnos",             lat: 10.2906, lng: 123.8771 },
      { name: "Mambaling",           lat: 10.2950, lng: 123.8823 },
      { name: "CSBT",                lat: 10.2976, lng: 123.8935 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 09C: Basak (San Nicolas) ↔ Colon ─────────────────────────────────────
  // Starts Quiot → SWU Basak campus → Mambaling flyover → CITU → CSBT → Colon
  "09C": {
    name: "Basak San Nicolas – Colon",
    color: "#d62828",
    stops: [
      { name: "Quiot / Basak San Nicolas", lat: 10.2799, lng: 123.8672 },
      { name: "SWU Basak Campus",    lat: 10.2840, lng: 123.8688 },
      { name: "Mambaling Flyover",   lat: 10.2896, lng: 123.8753 },
      { name: "CITU",                lat: 10.2920, lng: 123.8801 },
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 09G: Basak ↔ Colon (alt) ─────────────────────────────────────────────
  "09G": {
    name: "Basak San Nicolas – Colon (alt)",
    color: "#b71c1c",
    stops: [
      { name: "Quiot / Basak San Nicolas", lat: 10.2799, lng: 123.8672 },
      { name: "Mambaling Flyover",   lat: 10.2896, lng: 123.8753 },
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 10F: Bulacao ↔ Colon ─────────────────────────────────────────────────
  "10F": {
    name: "Bulacao – Colon",
    color: "#003049",
    stops: [
      { name: "Bulacao",             lat: 10.2719, lng: 123.8461 },
      { name: "Tabunok",             lat: 10.2737, lng: 123.8790 },
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 10H: Bulacao ↔ SM ────────────────────────────────────────────────────
  "10H": {
    name: "Bulacao – SM",
    color: "#37474f",
    stops: [
      { name: "Bulacao",             lat: 10.2719, lng: 123.8461 },
      { name: "Tabunok",             lat: 10.2737, lng: 123.8790 },
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 11A: Inayawan ↔ Colon ────────────────────────────────────────────────
  "11A": {
    name: "Inayawan – Colon",
    color: "#6a994e",
    stops: [
      { name: "Inayawan",            lat: 10.2755, lng: 123.8752 },
      { name: "Pardo",               lat: 10.2842, lng: 123.8822 },
      { name: "South Bus Terminal",  lat: 10.2976, lng: 123.8935 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 12D: Labangon ↔ Colon ────────────────────────────────────────────────
  // Goes: Labangon → Urgello → Fuente → Colon
  "12D": {
    name: "Labangon – Colon",
    color: "#0077b6",
    stops: [
      { name: "Labangon Market",     lat: 10.2985, lng: 123.8742 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 12G: Labangon/Punta Princesa ↔ SM ────────────────────────────────────
  // KEY ROUTE through Tisa/Punta Princesa
  "12G": {
    name: "Labangon/Punta Princesa – SM",
    color: "#1976d2",
    stops: [
      { name: "Punta Princesa",      lat: 10.2943, lng: 123.8701 },
      { name: "Miller Hospital",     lat: 10.2960, lng: 123.8718 },
      { name: "CITU",                lat: 10.2920, lng: 123.8801 },
      { name: "Taboan Market",       lat: 10.2943, lng: 123.8910 },
      { name: "City Hall",           lat: 10.2929, lng: 123.9014 },
      { name: "Pier",                lat: 10.2981, lng: 123.9052 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 12I: Labangon ↔ SM (alt) ─────────────────────────────────────────────
  "12I": {
    name: "Labangon – SM (alt)",
    color: "#1565c0",
    stops: [
      { name: "Labangon Market",     lat: 10.2985, lng: 123.8742 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 }
    ]
  },

  // ── 12L: Labangon/Tisa ↔ Ayala ───────────────────────────────────────────
  // KEY ROUTE: Tisa → Punta Princesa → Labangon → N.Bacalso → USC South →
  //            Calamba → V.Sotto → Mango Square → USC North → Ayala
  "12L": {
    name: "Tisa/Labangon – Ayala",
    color: "#0d47a1",
    stops: [
      { name: "Tisa",                lat: 10.3015, lng: 123.8705 },
      { name: "Punta Princesa",      lat: 10.2943, lng: 123.8701 },
      { name: "Miller Hospital",     lat: 10.2960, lng: 123.8718 },
      { name: "Labangon Market",     lat: 10.2985, lng: 123.8742 },
      { name: "N. Bacalso Ave",      lat: 10.3020, lng: 123.8780 },
      { name: "USC South Campus",    lat: 10.3052, lng: 123.8820 },
      { name: "Vicente Sotto Hosp.", lat: 10.3101, lng: 123.8862 },
      { name: "Mango Square / Escario", lat: 10.3140, lng: 123.8895 },
      { name: "USC North Campus",    lat: 10.3172, lng: 123.8928 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 }
    ]
  },

  // ── 13B: Talamban ↔ Carbon ───────────────────────────────────────────────
  "13B": {
    name: "Talamban – Carbon",
    color: "#9b2226",
    stops: [
      { name: "Talamban",            lat: 10.3710, lng: 123.9068 },
      { name: "Pit-os",              lat: 10.3590, lng: 123.9044 },
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "Lahug (Jy Square)",   lat: 10.3458, lng: 123.8991 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 13C: Talamban ↔ Colon ────────────────────────────────────────────────
  "13C": {
    name: "Talamban – Colon",
    color: "#ae2012",
    stops: [
      { name: "Talamban",            lat: 10.3710, lng: 123.9068 },
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "Lahug (Jy Square)",   lat: 10.3458, lng: 123.8991 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 14D: Ayala ↔ Colon ───────────────────────────────────────────────────
  "14D": {
    name: "Ayala – Colon",
    color: "#005f73",
    stops: [
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 }
    ]
  },

  // ── 17B: Apas ↔ Carbon ───────────────────────────────────────────────────
  "17B": {
    name: "Apas – Carbon",
    color: "#0a9396",
    stops: [
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "Capitol",             lat: 10.3287, lng: 123.8972 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Urgello",             lat: 10.3069, lng: 123.8840 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 17C: Apas ↔ Carbon (via IT Park) ─────────────────────────────────────
  "17C": {
    name: "Apas – Carbon (via IT Park)",
    color: "#94d2bd",
    stops: [
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 17D: Apas ↔ Carbon (alt) ─────────────────────────────────────────────
  "17D": {
    name: "Apas – Carbon (alt)",
    color: "#52b788",
    stops: [
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "Capitol",             lat: 10.3287, lng: 123.8972 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  },

  // ── 20A: Mandaue ↔ Ayala ─────────────────────────────────────────────────
  "20A": {
    name: "Mandaue – Ayala",
    color: "#7209b7",
    stops: [
      { name: "Mandaue",             lat: 10.3503, lng: 123.9403 },
      { name: "Parkmall",            lat: 10.3221, lng: 123.9358 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 },
      { name: "Ayala Center Cebu",   lat: 10.3182, lng: 123.9049 }
    ]
  },

  // ── 21A: Mandaue ↔ Cathedral ─────────────────────────────────────────────
  "21A": {
    name: "Mandaue – Cathedral",
    color: "#560bad",
    stops: [
      { name: "Mandaue",             lat: 10.3503, lng: 123.9403 },
      { name: "SM City Cebu",        lat: 10.3114, lng: 123.9178 },
      { name: "Pier",                lat: 10.2981, lng: 123.9052 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 },
      { name: "Cathedral",           lat: 10.2934, lng: 123.9016 }
    ]
  },

  // ── 62B: Pit-os ↔ Carbon ─────────────────────────────────────────────────
  "62B": {
    name: "Pit-os – Carbon",
    color: "#3a0ca3",
    stops: [
      { name: "Pit-os",              lat: 10.3590, lng: 123.9044 },
      { name: "Talamban",            lat: 10.3710, lng: 123.9068 },
      { name: "Apas",                lat: 10.3506, lng: 123.8994 },
      { name: "IT Park",             lat: 10.3296, lng: 123.9050 },
      { name: "Fuente Osmeña",       lat: 10.3073, lng: 123.8944 },
      { name: "Colon",               lat: 10.2929, lng: 123.9020 },
      { name: "Carbon",              lat: 10.2909, lng: 123.9057 }
    ]
  }

};
