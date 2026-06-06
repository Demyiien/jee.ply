// ── Jee.ply · Landmarks ───────────────────────────────────────────────────
// Coordinates are pulled from coordinates.js — do not hardcode lat/lng here.
// To fix a coordinate, edit coordinates.js only.

const LANDMARKS = [

  // ── Terminals / Major Hubs ────────────────────────────────────────────────
  { name: "Carbon Public Market",              ...COORDS["Carbon"] },
  { name: "Colon Street",                      ...COORDS["Colon"] },
  { name: "Fuente Osmeña Circle",              ...COORDS["Fuente Osmeña"] },
  { name: "SM City Cebu",                      ...COORDS["SM City Cebu"] },
  { name: "Ayala Center Cebu",                 ...COORDS["Ayala Center Cebu"] },
  { name: "Parkmall",                          ...COORDS["Parkmall"] },
  { name: "IT Park",                           ...COORDS["IT Park"] },
  { name: "South Bus Terminal (CSBT)",         ...COORDS["South Bus Terminal"] },
  { name: "North Bus Terminal (NBT)",          ...COORDS["North Bus Terminal"] },
  { name: "Pier 1",                            ...COORDS["Pier"] },
  { name: "Alumnos Terminal",                  ...COORDS["Alumnos"] },

  // ── Modern Mega-Developments ──────────────────────────────────────────────
  { name: "SM Seaside City Cebu",              ...COORDS["SM Seaside City Cebu (Mountain Wing)"] },
  { name: "Cebu Ocean Park",                   ...COORDS["Cebu Ocean Park"] },
  { name: "Il Corso Lifemalls",                ...COORDS["Il Corso Lifemalls"] },

  // ── Barangays ─────────────────────────────────────────────────────────────
  { name: "Tisa",                              ...COORDS["Tisa"] },
  { name: "Punta Princesa",                    ...COORDS["Punta Princesa"] },
  { name: "Basak San Nicolas",                 ...COORDS["Basak San Nicolas"] },
  { name: "Labangon",                          ...COORDS["Labangon"] },
  { name: "Labangon Market",                   ...COORDS["Labangon Market"] },
  { name: "Mambaling",                         ...COORDS["Mambaling"] },
  { name: "Guadalupe",                         ...COORDS["Guadalupe"] },
  { name: "Banawa",                            ...COORDS["Banawa"] },
  { name: "Urgello",                           ...COORDS["Urgello"] },
  { name: "Mabolo",                            ...COORDS["Mabolo"] },
  { name: "Lahug",                             ...COORDS["Lahug (Jy Square)"] },
  { name: "Apas",                              ...COORDS["Apas"] },
  { name: "Pit-os",                            ...COORDS["Pit-os"] },
  { name: "Talamban",                          ...COORDS["Talamban"] },
  { name: "Mandaue",                           ...COORDS["Mandaue"] },
  { name: "Bulacao",                           ...COORDS["Bulacao"] },
  { name: "Tabunok",                           ...COORDS["Tabunok"] },
  { name: "Poblacion Talisay",                 ...COORDS["Poblacion Talisay"] },
  { name: "Inayawan",                          ...COORDS["Inayawan"] },
  { name: "Pardo",                             ...COORDS["Pardo"] },
  { name: "Quiot",                             ...COORDS["Quiot / Basak San Nicolas"] },
  { name: "Talisay City",                      ...COORDS["Talisay City"] },
  { name: "Minglanilla",                       ...COORDS["Minglanilla"] },
  { name: "Mactan Airport (MCIA)",             ...COORDS["Mactan Airport (MCIA)"] },
  { name: "Lapu-Lapu City (Opon)",             ...COORDS["Lapu-Lapu City (Opon)"] },

  // ── Malls / Markets ───────────────────────────────────────────────────────
  { name: "Robinsons Place Cebu",              ...COORDS["Robinsons Place"] },
  { name: "Taboan Public Market",              ...COORDS["Taboan Market"] },
  { name: "Gaisano Grand Jai-Alai",            ...COORDS["Gaisano Grand Jai-Alai"] },
  { name: "Escario Central Mall",              ...COORDS["Escario Central Mall"] },
  { name: "Elizabeth Mall (E-Mall)",           ...COORDS["Elizabeth Mall (E-Mall)"] },

  // ── Government / Historic Sites ───────────────────────────────────────────
  { name: "Cebu City Hall",                    ...COORDS["City Hall"] },
  { name: "Cebu Provincial Capitol",           ...COORDS["Capitol"] },
  { name: "Cebu Metropolitan Cathedral",       ...COORDS["Cathedral"] },
  { name: "Plaza Independencia",               ...COORDS["Plaza Independencia"] },

  // ── Schools ───────────────────────────────────────────────────────────────
  { name: "University of San Carlos (USC) Main", ...COORDS["USC Main"] },
  { name: "USC South Campus",                  ...COORDS["USC South Campus"] },
  { name: "USC North Campus",                  ...COORDS["USC North Campus"] },
  { name: "UP Cebu",                           ...COORDS["UP Cebu"] },
  { name: "SWU (Basak Campus)",                ...COORDS["SWU Basak Campus"] },
  { name: "CITU (Cebu Inst. of Tech.)",        ...COORDS["CITU"] },
  { name: "University of Cebu (UC)",           ...COORDS["University of Cebu (UC)"] },

  // ── Hospitals ─────────────────────────────────────────────────────────────
  { name: "Cebu Doctors University Hospital",  ...COORDS["Cebu Doctors University Hospital"] },
  { name: "Vicente Sotto Memorial Hospital",   ...COORDS["Vicente Sotto Hosp."] },
  { name: "Cebu City Medical Center",          ...COORDS["Cebu City Medical Center"] },
  { name: "Miller Hospital",                   ...COORDS["Miller Hospital"] },

];