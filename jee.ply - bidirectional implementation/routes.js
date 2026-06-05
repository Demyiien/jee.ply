// ── Jee.ply · Jeepney Routes ──────────────────────────────────────────────
// Routes verified via LTFRB Region 7 franchise data and CommuteTour guidelines.
//
// Helper: shorthand to build a stop object from COORDS


//Notes: :)) 🐈
//Put the routes going back in inbound: [];
//If the return route is the same as the outbound but in reverse order, you can leave inbound: [] empty.

const stop = (name) => ({ name, ...COORDS[name] });

const JEEP_ROUTES = {

  // ── TRADITIONAL CITY ROUTES ─────────────────────────────────────────────

  "01K": {
    name: "Urgello – Parkmall via SM",
    color: "#e63946",
    directions: {
      outbound: [
        stop("Urgello Transit"),
        stop("Sacred Heart Hospital"),
        stop("SWU PHINMA Transit"),
        stop("ACT Transit"),
        stop("E-Mall (Leon Kilat Entrance)"),
        stop("UC-Main (Leon Kilat Entrance)"),
        stop("Metro Colon Transit"),
        stop("Museo Sugbo"),
        stop("Gen. Maxilom Ave. Transit"),
        stop("GMall of Cebu"),
        stop("SM City Cebu (Xiamen Entrance)"),
        stop("F. Cabahug Transit"),
        stop("SM Hypermarket"),
        stop("M. Logarta Transit"),
        stop("Cebu Doctors University (CDU)"),
        stop("Ouano Ave. Transit"),
        stop("City Times Square Transit (Mantawi)"),
        stop("Parkmall Terminal"),
      ],
      inbound: [
        stop("Parkmall Terminal"),
        stop("E.O. Perez Transit"),
        stop("Albaño Transit"),
        stop("F. Cabahug Transit"),
        stop("Queen City Memorial Garden"),
        stop("G. Gaisano Transit"),
        stop("B. Benedicto Transit"),
        stop("T. Padilla Transit"),
        stop("Legazpi Transit"),
        stop("Leon Kilat Transit"),
        stop("ACT Transit"),
        stop("SWU PHINMA Transit"),
        stop("Sacred Heart Hospital"),
        stop("Urgello Transit"),
      ]
    }
  },

  "02B": {
    name: "South Bus Terminal – Pier via Colon",
    color: "#457b9d",
    directions: {
      outbound: [
        stop("South Bus Terminal"),
        stop("Elizabeth Mall (E-Mall)"),
        stop("Colon"),
        stop("Cathedral"),
        stop("Pier")
      ],
      inbound: [
        
      ]
    }
  },

  "03A": {
    name: "Mabolo – Carbon via Ramos",
    color: "#2a9d8f",
    directions: {
      outbound: [
        stop("Mabolo"),
        stop("SM City Cebu"),
        stop("Fuente Osmeña"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "03B": {
    name: "Mabolo – Carbon (via Maxilom)",
    color: "#c9a227",
    directions: {
      outbound: [
        stop("Mabolo"),
        stop("SM City Cebu"),
        stop("Mango Square / Escario"),
        stop("Fuente Osmeña"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "03Q": {
    name: "Ayala – SM City Cebu",
    color: "#f4a261",
    directions: {
      outbound: [
        stop("Ayala Center Cebu"),
        stop("Mabolo"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "04B": {
    name: "Lahug – Carbon via Jones",
    color: "#6a4c93",
    directions: {
      outbound: [
        stop("Lahug (Jy Square)"),
        stop("Gorordo Ave"),
        stop("Mango Square / Escario"),
        stop("Fuente Osmeña"),
        stop("Robinsons Place"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "04L": {
    name: "Lahug – Ayala Center Cebu",
    color: "#219ebc",
    directions: {
      outbound: [
        stop("Lahug (Jy Square)"),
        stop("Gorordo Ave"),
        stop("Ayala Center Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "06B": {
    name: "Guadalupe – Carbon via Jones",
    color: "#fb8500",
    directions: {
      outbound: [
        stop("Guadalupe"),
        stop("Capitol"),
        stop("Fuente Osmeña"),
        stop("Robinsons Place"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "06H": {
    name: "Guadalupe – SM via Ayala",
    color: "#023047",
    directions: {
      outbound: [
        stop("Guadalupe"),
        stop("Capitol"),
        stop("Escario Central Mall"),
        stop("Ayala Center Cebu"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "07B": {
    name: "Banawa – Carbon",
    color: "#c77dff",
    directions: {
      outbound: [
        stop("Banawa"),
        stop("Guadalupe"),
        stop("Capitol"),
        stop("Fuente Osmeña"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "08F": {
    name: "Alumnos – SM City Cebu",
    color: "#80b918",
    directions: {
      outbound: [
        stop("Alumnos"),
        stop("Mambaling"),
        stop("South Bus Terminal"),
        stop("Colon"),
        stop("Pier"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "09C": {
    name: "Basak San Nicolas – Colon via Punta",
    color: "#d62828",
    directions: {
      outbound: [
        stop("Quiot / Basak San Nicolas"),
        stop("Punta Princesa"),
        stop("CITU"),
        stop("South Bus Terminal"),
        stop("Elizabeth Mall (E-Mall)"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  "09G": {
    name: "Basak San Nicolas – Colon via Punta (Alt)",
    color: "#b71c1c",
    directions: {
      outbound: [
        stop("Quiot / Basak San Nicolas"),
        stop("Punta Princesa"),
        stop("CITU"),
        stop("South Bus Terminal"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  // ── SOUTH HIGHWAY ROUTES (Bulacao / Inayawan) ───────────────────────────

  "10F": {
    name: "Bulacao – Colon via Highway",
    color: "#003049",
    directions: {
      outbound: [
        stop("Bulacao"),
        stop("Pardo"),
        stop("Basak San Nicolas"),
        stop("CITU"),
        stop("South Bus Terminal"),
        stop("Elizabeth Mall (E-Mall)"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  "10H": {
    name: "Bulacao – SM City Cebu via Highway & Imus",
    color: "#37474f",
    directions: {
      outbound: [
        stop("Bulacao"),
        stop("Pardo"),
        stop("Basak San Nicolas"),
        stop("Mambaling Flyover"),
        stop("CITU"),
        stop("South Bus Terminal"),
        stop("Colon"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "11A": {
    name: "Inayawan – Colon via Highway",
    color: "#6a994e",
    directions: {
      outbound: [
        stop("Inayawan"),
        stop("Quiot / Basak San Nicolas"),
        stop("South Bus Terminal"),
        stop("Elizabeth Mall (E-Mall)"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  // ── MID/NORTH CITY ROUTES ───────────────────────────────────────────────

  "12D": {
    name: "Labangon – Colon via V. Rama",
    color: "#0077b6",
    directions: {
      outbound: [
        stop("Labangon Market"),
        stop("V. Rama Ave"),
        stop("South Bus Terminal"),
        stop("Elizabeth Mall (E-Mall)"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  "12G": {
    name: "Punta Princesa – SM City Cebu via V. Rama",
    color: "#1976d2",
    directions: {
      outbound: [
        stop("Punta Princesa"),
        stop("Labangon Market"),
        stop("V. Rama Ave"),
        stop("Taboan Market"),
        stop("City Hall"),
        stop("Pier"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "12L": {
    name: "Tisa/Labangon – Ayala via Tres de Abril",
    color: "#0d47a1",
    directions: {
      outbound: [
        stop("Tisa"),
        stop("Punta Princesa"),
        stop("Labangon"),         // Tres de Abril intersection
        stop("Miller Hospital"),  // Tres de Abril stretch
        stop("N. Bacalso Ave"),
        stop("South Bus Terminal"),
        stop("USC South Campus"),
        stop("Vicente Sotto Hosp."),
        stop("Mango Square / Escario"),
        stop("Ayala Center Cebu")
    ],
      inbound: [
        
      ]
    }
  },

  "13C": {
    name: "Talamban – Colon / Carbon via Ramos",
    color: "#ae2012",
    directions: {
      outbound: [
        stop("Talamban"),
        stop("USC Talamban Campus (TC)"),
        stop("Banilad Town Centre (BTC)"),
        stop("Gaisano Country Mall"),
        stop("Ayala Center Cebu"),
        stop("Fuente Osmeña"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "14D": {
    name: "Ayala – Colon via Ramos",
    color: "#005f73",
    directions: {
      outbound: [
        stop("Ayala Center Cebu"),
        stop("Escario Central Mall"),
        stop("Capitol"),
        stop("Fuente Osmeña"),
        stop("Robinsons Place"),
        stop("Colon")
      ],
      inbound: [
        
      ]
    }
  },

  "17B": {
    name: "Apas – Carbon via Jones",
    color: "#0a9396",
    directions: {
      outbound: [
        stop("Apas"),
        stop("IT Park"),
        stop("Salinas Drive"),
        stop("Lahug (Jy Square)"),
        stop("Capitol"),
        stop("Fuente Osmeña"),
        stop("Robinsons Place"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "20A": {
    name: "Mandaue – Ayala via Mabolo",
    color: "#7209b7",
    directions: {
      outbound: [
        stop("Mandaue"),
        stop("Parkmall"),
        stop("SM City Cebu"),
        stop("Mabolo"),
        stop("Ayala Center Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "21A": {
    name: "Mandaue – Cathedral / Carbon",
    color: "#560bad",
    directions: {
      outbound: [
        stop("Mandaue"),
        stop("SM City Cebu"),
        stop("Pier"),
        stop("Cathedral"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "62B": {
    name: "Pit-os – Carbon via Ayala & Ramos",
    color: "#3a0ca3",
    directions: {
      outbound: [
        stop("Pit-os"),
        stop("Talamban"),
        stop("USC Talamban Campus (TC)"),
        stop("Banilad Town Centre (BTC)"),
        stop("Ayala Center Cebu"),
        stop("Fuente Osmeña"),
        stop("Colon"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  // ── DEEP SOUTH / TALISAY (Traditional Lines) ────────────────────────────

  "41D": {
    name: "Tabunok – Taboan via V. Rama",
    color: "#6c757d",
    directions: {
      outbound: [
        stop("Tabunok"),
        stop("Bulacao"),
        stop("Pardo"),
        stop("Basak San Nicolas"),
        stop("Mambaling Flyover"),
        stop("CITU"),
        stop("V. Rama Ave"),
        stop("Taboan Market"),
        stop("Carbon")
      ],
      inbound: [
        
      ]
    }
  },

  "42D": {
    name: "Talisay – Taboan via V. Rama",
    color: "#495057",
    directions: {
      outbound: [
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
    ],
      inbound: [
        
      ]
    }
  },

  // ── MODERN BUSES & JEEPS ────────────────────────────────────────────────

  "MYB-1": {
    name: "MyBus: SM Seaside to SM City",
    color: "#118ab2",
    directions: {
      outbound: [
        stop("SM Seaside MyBus Pick-Up Area (Mountain Wing)"),
        stop("Plaza Independencia"),
        stop("Robinsons Galleria Transit (Sr. Osmeña)"),
        stop("Radisson Blu Transit"),
        stop("Kaohsiung St. Transit"),
        stop("SM City MyBus Terminal"),
      ],
      inbound: [
        
      ]
    }
  },

  "MYB-2": {
    name: "MyBus: Airport ↔ SM City",
    color: "#073b4c",
    directions: {
      outbound: [
        stop("Mactan Airport (MCIA)"),
        stop("Lapu-Lapu City (Opon)"),
        stop("Parkmall"),
        stop("North Bus Terminal"),
        stop("SM City Cebu")
      ],
      inbound: [
        
      ]
    }
  },

  "MYB-3": {
    name: "MyBus: IT Park ↔ SM Seaside",
    color: "#06d6a0",
    directions: {
      outbound: [
        stop("IT Park"),
        stop("SM City Cebu"),
        stop("Pier"),
        stop("SM Seaside City Cebu")
      ],
      inbound: [
       
      ]
    }
  },

  "MJ-1": {
    name: "Mango Jeep: Talisay - IT Park",
    color: "#fca311",
    directions: {
      outbound: [
        stop("Mango Jeep Terminal (Poblacion)"),
        stop("San Isidro Transit"),
        stop("Gaisano Tabunok Terminal"),
        stop("Bulacao Bus Stop"),
        stop("Shopwise Transit"),
        stop("Tisa Barangay Hall"),
        stop("Katipunan Transit"),
        stop("Cebu City Science High School"),
        stop("Paseo Arcenas Transit"),
        stop("Capitol Square Transit"),
        stop("Sacred Heart - Capitol Transit"),
        stop("Gorordo Ave. Transit"),
        stop("UP Cebu Transit"),
        stop("Sudlon Transit"),
        stop("IT Park Terminal")
      ],
      inbound: [
        
      ]
    }
  },

  "CIBUS": {
    name: "CIBus: Seaside ↔ IT Park",
    color: "#ef476f",
    directions: {
      outbound: [
        stop("SM Seaside City Cebu"),
        stop("CITU"),
        stop("South Bus Terminal"),
        stop("Fuente Osmeña"),
        stop("Robinsons Place"),
        stop("IT Park")
      ],
      inbound: [
        
      ]
    }
  }
};