// ── Jee.ply · Landmark Database ──────────────────────────────────────────

const LANDMARKS = [

  // ── Terminals / Major Hubs ────────────────────────────────────────────────
  { name: "Carbon Public Market",              lat: 10.2909, lng: 123.9057 },
  { name: "Colon Street",                      lat: 10.2929, lng: 123.9020 },
  { name: "Fuente Osmeña Circle",              lat: 10.3073, lng: 123.8944 },
  { name: "SM City Cebu",                      lat: 10.3114, lng: 123.9178 },
  { name: "Ayala Center Cebu",                 lat: 10.3182, lng: 123.9049 },
  { name: "Parkmall",                          lat: 10.3221, lng: 123.9358 },
  { name: "IT Park",                           lat: 10.3296, lng: 123.9050 },
  { name: "Cebu Business Park",                lat: 10.3182, lng: 123.9049 },
  { name: "South Bus Terminal (CSBT)",         lat: 10.2976, lng: 123.8935 },
  { name: "North Bus Terminal (NBT)",          lat: 10.3547, lng: 123.9107 },
  { name: "Pier 1",                            lat: 10.2981, lng: 123.9052 },
  { name: "Alumnos Terminal",                  lat: 10.2906, lng: 123.8771 },

  // ── Barangays (PhilAtlas verified) ───────────────────────────────────────
  { name: "Tisa",                              lat: 10.3015, lng: 123.8705 },
  { name: "Punta Princesa",                    lat: 10.2943, lng: 123.8701 },
  { name: "Basak San Nicolas",                 lat: 10.2867, lng: 123.8706 },
  { name: "Labangon",                          lat: 10.2991, lng: 123.8805 },
  { name: "Labangon Market",                   lat: 10.2985, lng: 123.8742 },
  { name: "Mambaling",                         lat: 10.2922, lng: 123.8763 },
  { name: "Guadalupe",                         lat: 10.3069, lng: 123.8756 },
  { name: "Banawa",                            lat: 10.3167, lng: 123.8667 },
  { name: "Alumnos",                           lat: 10.2906, lng: 123.8771 },
  { name: "Urgello",                           lat: 10.3069, lng: 123.8840 },
  { name: "Mabolo",                            lat: 10.3226, lng: 123.9142 },
  { name: "Lahug",                             lat: 10.3458, lng: 123.8991 },
  { name: "Apas",                              lat: 10.3506, lng: 123.8994 },
  { name: "Pit-os",                            lat: 10.3590, lng: 123.9044 },
  { name: "Talamban",                          lat: 10.3710, lng: 123.9068 },
  { name: "Mandaue",                           lat: 10.3503, lng: 123.9403 },
  { name: "Bulacao",                           lat: 10.2719, lng: 123.8461 },
  { name: "Tabunok",                           lat: 10.2737, lng: 123.8790 },
  { name: "Inayawan",                          lat: 10.2701, lng: 123.8563 },
  { name: "Pardo",                             lat: 10.2842, lng: 123.8822 },
  { name: "Quiot",                             lat: 10.2799, lng: 123.8672 },
  { name: "Talisay City",                      lat: 10.2449, lng: 123.8334 },
  { name: "Minglanilla",                       lat: 10.2417, lng: 123.8012 },
  { name: "Gaisano Country Mall",              lat: 10.3322, lng: 123.9171 },
  { name: "Mactan Airport (MCIA)",             lat: 10.3075, lng: 123.9795 },
  { name: "Lapu-Lapu City (Opon)",             lat: 10.3103, lng: 123.9490 },
  { name: "Plaza Housing",                     lat: 10.3510, lng: 123.8850 },

  // ── Malls / Markets ───────────────────────────────────────────────────────
  { name: "Robinsons Place Cebu",              lat: 10.3012, lng: 123.8972 },
  { name: "Taboan Public Market",              lat: 10.2943, lng: 123.8910 },
  { name: "Gaisano Grand Jai-Alai",            lat: 10.2895, lng: 123.8800 },
  { name: "Jy Square Mall",                    lat: 10.3458, lng: 123.8991 },
  { name: "Escario Central Mall",              lat: 10.3140, lng: 123.8895 },
  { name: "Mango Square Mall",                 lat: 10.3140, lng: 123.8895 },
  { name: "Elizabeth Mall (E-Mall)",           lat: 10.2976, lng: 123.8935 },

  // ── Government / Landmarks ────────────────────────────────────────────────
  { name: "Cebu City Hall",                    lat: 10.2929, lng: 123.9014 },
  { name: "Cebu Provincial Capitol",           lat: 10.3287, lng: 123.8972 },
  { name: "Cebu Metropolitan Cathedral",       lat: 10.2934, lng: 123.9016 },
  { name: "Magellan's Cross",                  lat: 10.2936, lng: 123.9017 },
  { name: "Fort San Pedro",                    lat: 10.2904, lng: 123.9056 },

  // ── Schools / Hospitals ───────────────────────────────────────────────────
  { name: "University of San Carlos (USC) Main", lat: 10.3005, lng: 123.8985 },
  { name: "USC South Campus",                  lat: 10.3052, lng: 123.8820 },
  { name: "USC North Campus",                  lat: 10.3172, lng: 123.8928 },
  { name: "UP Cebu",                           lat: 10.3396, lng: 123.9027 },
  { name: "Cebu Doctors University Hospital",  lat: 10.3100, lng: 123.8930 },
  { name: "Vicente Sotto Memorial Hospital",   lat: 10.3101, lng: 123.8862 },
  { name: "Cebu City Medical Center",          lat: 10.2976, lng: 123.8935 },
  { name: "Miller Hospital",                   lat: 10.2960, lng: 123.8718 },
  { name: "SWU (Basak Campus)",                lat: 10.2840, lng: 123.8688 },
  { name: "CITU (Cebu Inst. of Tech.)",        lat: 10.2944, lng: 123.8801 },
  { name: "University of Cebu (UC)",           lat: 10.2938, lng: 123.8992 },

  // ── Hotels ────────────────────────────────────────────────────────────────
  { name: "Crown Regency Hotel",               lat: 10.3093, lng: 123.8953 },
  { name: "Marco Polo Hotel",                  lat: 10.3334, lng: 123.9070 },
  { name: "Harolds Hotel",                     lat: 10.3150, lng: 123.8920 },
  { name: "Quest Hotel Cebu",                  lat: 10.3162, lng: 123.8930 }

];
