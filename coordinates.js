// ── Jee.ply · Coordinates ─────────────────────────────────────────────────

const COORDS = {

  // ── Terminals / Major Hubs ────────────────────────────────────────────────
  "Carbon":                          { lat: 10.2909, lng: 123.9057 },
  "Colon":                           { lat: 10.2929, lng: 123.9020 },
  "Fuente Osmeña":                   { lat: 10.3073, lng: 123.8944 },
  "SM City Cebu":                    { lat: 10.3114, lng: 123.9178 },
  "Ayala Center Cebu":               { lat: 10.3182, lng: 123.9049 },
  "Parkmall":                        { lat: 10.3221, lng: 123.9358 },
  "IT Park":                         { lat: 10.3296, lng: 123.9050 },
  "South Bus Terminal":              { lat: 10.2976, lng: 123.8935 },
  "North Bus Terminal":              { lat: 10.3547, lng: 123.9107 },
  "Pier":                            { lat: 10.2981, lng: 123.9052 },
  "Alumnos":                         { lat: 10.2906, lng: 123.8771 },
  "Cathedral":                       { lat: 10.2934, lng: 123.9016 },
  "City Hall":                       { lat: 10.2929, lng: 123.9014 },

  // ── Barangays ─────────────────────────────────────────────────────────────
  "Tisa":                            { lat: 10.3015, lng: 123.8705 },
  "Punta Princesa":                  { lat: 10.2943, lng: 123.8701 },
  "Basak San Nicolas":               { lat: 10.2867, lng: 123.8706 },
  "Labangon":                        { lat: 10.2991, lng: 123.8805 },
  "Labangon Market":                 { lat: 10.2985, lng: 123.8742 },
  "Mambaling":                       { lat: 10.2950, lng: 123.8823 },
  "Mambaling Flyover":               { lat: 10.2896, lng: 123.8753 },
  "Guadalupe":                       { lat: 10.3069, lng: 123.8756 },
  "Banawa":                          { lat: 10.3261, lng: 123.8728 },
  "Urgello":                         { lat: 10.3069, lng: 123.8840 },
  "Mabolo":                          { lat: 10.3226, lng: 123.9142 },
  "Lahug (Jy Square)":               { lat: 10.3458, lng: 123.8991 },
  "Apas":                            { lat: 10.3506, lng: 123.8994 },
  "Pit-os":                          { lat: 10.3590, lng: 123.9044 },
  "Talamban":                        { lat: 10.3710, lng: 123.9068 },
  "Mandaue":                         { lat: 10.3503, lng: 123.9403 },
  "Bulacao":                         { lat: 10.2719, lng: 123.8461 },
  "Tabunok":                         { lat: 10.2737, lng: 123.8790 },
  "Inayawan":                        { lat: 10.2755, lng: 123.8752 },
  "Pardo":                           { lat: 10.2842, lng: 123.8822 },
  "Quiot":                           { lat: 10.2799, lng: 123.8672 },
  "Talisay City":                    { lat: 10.2449, lng: 123.8334 },
  "Minglanilla":                     { lat: 10.2417, lng: 123.8012 },
  "Plaza Housing":                   { lat: 10.3510, lng: 123.8850 },
  "Lapu-Lapu City (Opon)":           { lat: 10.3103, lng: 123.9490 },

  // ── Roads / Intersections ─────────────────────────────────────────────────
  "V. Rama Ave":                     { lat: 10.3015, lng: 123.8889 },
  "Gorordo Ave":                     { lat: 10.3380, lng: 123.8990 },
  "Capitol":                         { lat: 10.3287, lng: 123.8972 },
  "N. Bacalso Ave":                  { lat: 10.3020, lng: 123.8780 },
  "Mango Square / Escario":          { lat: 10.3140, lng: 123.8895 },
  "CSBT":                            { lat: 10.2976, lng: 123.8935 },

  // ── Malls / Markets ───────────────────────────────────────────────────────
  "Robinsons Place":                 { lat: 10.3012, lng: 123.8972 },
  "Taboan Market":                   { lat: 10.2943, lng: 123.8910 },
  "Gaisano Country Mall":            { lat: 10.3322, lng: 123.9171 },
  "Gaisano Grand Jai-Alai":          { lat: 10.2895, lng: 123.8800 },
  "Jy Square Mall":                  { lat: 10.3458, lng: 123.8991 },
  "Escario Central Mall":            { lat: 10.3140, lng: 123.8895 },
  "Mango Square Mall":               { lat: 10.3140, lng: 123.8895 },
  "Elizabeth Mall (E-Mall)":         { lat: 10.2976, lng: 123.8935 },

  // ── Government / Historic Sites ───────────────────────────────────────────
  "Cebu Metropolitan Cathedral":     { lat: 10.2934, lng: 123.9016 },
  "Magellan's Cross":                { lat: 10.2936, lng: 123.9017 },
  "Fort San Pedro":                  { lat: 10.2904, lng: 123.9056 },

  // ── Schools ───────────────────────────────────────────────────────────────
  "USC Main":                        { lat: 10.3005, lng: 123.8985 },
  "USC South Campus":                { lat: 10.3052, lng: 123.8820 },
  "USC North Campus":                { lat: 10.3172, lng: 123.8928 },
  "UP Cebu":                         { lat: 10.3396, lng: 123.9027 },
  "SWU Basak Campus":                { lat: 10.2840, lng: 123.8688 },
  "CITU":                            { lat: 10.2920, lng: 123.8801 },
  "University of Cebu (UC)":         { lat: 10.2938, lng: 123.8992 },
  "Quiot / Basak San Nicolas":       { lat: 10.2799, lng: 123.8672 },

  // ── Hospitals ─────────────────────────────────────────────────────────────
  "Cebu Doctors University Hospital": { lat: 10.3100, lng: 123.8930 },
  "Vicente Sotto Hosp.":             { lat: 10.3101, lng: 123.8862 },
  "Cebu City Medical Center":        { lat: 10.2976, lng: 123.8935 },
  "Miller Hospital":                 { lat: 10.2960, lng: 123.8718 },

  // ── Hotels ────────────────────────────────────────────────────────────────
  "Crown Regency Hotel":             { lat: 10.3093, lng: 123.8953 },
  "Marco Polo Hotel":                { lat: 10.3334, lng: 123.9070 },
  "Harolds Hotel":                   { lat: 10.3150, lng: 123.8920 },
  "Quest Hotel Cebu":                { lat: 10.3162, lng: 123.8930 },

  // ── Airport ───────────────────────────────────────────────────────────────
  "Mactan Airport (MCIA)":           { lat: 10.3075, lng: 123.9795 },

};
