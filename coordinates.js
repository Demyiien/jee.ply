// ── Jee.ply · Coordinates ─────────────────────────────────────────────────

const COORDS = {

  // ── Terminals / Major Hubs ────────────────────────────────────────────────
  "Carbon":                          { lat: 10.2914, lng: 123.8991 }, 
  "Colon":                           { lat: 10.2950, lng: 123.9000 }, 
  "Fuente Osmeña":                   { lat: 10.3113, lng: 123.8932 }, 
  "SM City Cebu":                    { lat: 10.3111, lng: 123.9181 }, 
  "Ayala Center Cebu":               { lat: 10.3182, lng: 123.9052 }, 
  "Parkmall":                        { lat: 10.325564388162894, lng: 123.93439067903068 }, 
  "IT Park":                         { lat: 10.3283, lng: 123.9059 }, 
  "South Bus Terminal":              { lat: 10.2976, lng: 123.8935 }, 
  "North Bus Terminal":              { lat: 10.3259, lng: 123.9324 }, 
  "Pier":                            { lat: 10.2995, lng: 123.9125 }, 
  "Alumnos":                         { lat: 10.2895, lng: 123.8770 }, 
  "Cathedral":                       { lat: 10.2941, lng: 123.9022 }, 
  "City Hall":                       { lat: 10.2928, lng: 123.9015 }, 

  // Informal Stops / Transits
  "Urgello Transit":                 { lat: 10.304620139128968, lng: 123.89237840342106 },
  "ACT Transit":                     { lat: 10.299085373333384, lng: 123.89418257410108 }, 
  "SWU PHINMA Transit":              { lat: 10.302745172534161, lng: 123.89292808225255 },
  "Metro Colon Transit":             { lat: 10.295998673836484, lng: 123.89787999876309 },
  "Parkmall Transit (Mantawi)":      { lat: 10.325217946665092, lng: 123.93247980907029 },
  "Gen. Maxilom Ave. Transit":       { lat: 10.307824629840743, lng: 123.90844532091126},
  "F. Cabahug Transit":              { lat: 10.313580772647533, lng: 123.92074706898629},
  "M. Logarta Transit":              { lat: 10.320301004842003, lng: 123.92611677569852},
  "E.O. Perez Transit":              { lat: 10.320481796011835, lng: 123.9284633585913},

  // ── Modern Mega-Developments ──────────────────────────────────────────────
  "SM Seaside City Cebu":            { lat: 10.2818, lng: 123.8814 }, 
  "Cebu Ocean Park":                 { lat: 10.2804, lng: 123.8821 }, 
  "NUSTAR Resort & Casino":          { lat: 10.2740, lng: 123.8856 }, 
  "Il Corso Lifemalls":              { lat: 10.2682, lng: 123.8741 }, 

  // ── Barangays & Highway Anchors (Corrected to OSM Highway Nodes) ──────────
  "Tisa":                            { lat: 10.3015, lng: 123.8705 }, 
  "Punta Princesa":                  { lat: 10.2975, lng: 123.8690 }, 
  "Basak San Nicolas":               { lat: 10.2885, lng: 123.8682 }, 
  "Labangon":                        { lat: 10.3032, lng: 123.8790 }, 
  "Labangon Market":                 { lat: 10.2999, lng: 123.8752 }, 
  "Mambaling":                       { lat: 10.2920, lng: 123.8815 }, 
  "Mambaling Flyover":               { lat: 10.2933, lng: 123.8770 },
  "Guadalupe":                       { lat: 10.3125, lng: 123.8782 }, 
  "Banawa":                          { lat: 10.3142, lng: 123.8820 },  
  "Mabolo":                          { lat: 10.3226, lng: 123.9142 }, 
  "Lahug (Jy Square)":               { lat: 10.3382, lng: 123.8995 }, 
  "Apas":                            { lat: 10.3425, lng: 123.9070 }, 
  "Busay":                           { lat: 10.3621, lng: 123.8889 }, 
  "Pit-os":                          { lat: 10.3705, lng: 123.9210 }, 
  "Talamban":                        { lat: 10.3642, lng: 123.9160 }, 
  "Mandaue":                         { lat: 10.3446, lng: 123.9424 }, 
  "Bulacao":                         { lat: 10.2730, lng: 123.8480 }, 
  "Tabunok":                         { lat: 10.2428, lng: 123.8477 },
  "Poblacion Talisay":               { lat: 10.2451, lng: 123.8510 },
  "Inayawan":                        { lat: 10.2745, lng: 123.8695 }, 
  "Pardo":                           { lat: 10.2825, lng: 123.8580 },
  "Quiot / Basak San Nicolas":       { lat: 10.2850, lng: 123.8640 }, 
  "Talisay City":                    { lat: 10.2520, lng: 123.8390 }, 
  "Minglanilla":                     { lat: 10.2442, lng: 123.7975 }, 
  "Plaza Housing":                   { lat: 10.3418, lng: 123.8880 }, 
  "Lapu-Lapu City (Opon)":           { lat: 10.3148, lng: 123.9491 }, 

  // ── Roads / Intersections ─────────────────────────────────────────────────
  "V. Rama Ave":                     { lat: 10.3082, lng: 123.8890 }, 
  "Gorordo Ave":                     { lat: 10.3224, lng: 123.8985 }, 
  "Capitol":                         { lat: 10.3164, lng: 123.8907 }, 
  "Mango Square / Escario":          { lat: 10.3175, lng: 123.8925 }, 
  "Salinas Drive":                   { lat: 10.3340, lng: 123.9012 }, 
  "N. Bacalso Ave":                  { lat: 10.3060, lng: 123.8860 },

  // ── Malls / Markets / Parks ───────────────────────────────────────────────────────
  "Robinsons Place":                 { lat: 10.3105, lng: 123.8935 }, 
  "Robinsons Galleria Cebu":         { lat: 10.3114, lng: 123.9090 }, 
  "Taboan Market":                   { lat: 10.2955, lng: 123.8911 }, 
  "Gaisano Country Mall":            { lat: 10.3392, lng: 123.9181 }, 
  "Banilad Town Centre (BTC)":       { lat: 10.3421, lng: 123.9158 }, 
  "Gaisano Grand Jai-Alai":          { lat: 10.2891, lng: 123.8821 }, 
  "Escario Central Mall":            { lat: 10.3188, lng: 123.8899 }, 
  "Elizabeth Mall (E-Mall)":         { lat: 10.2985, lng: 123.8955 }, 
  "E-Mall (Leon Kilat Entrance)":    { lat: 10.298018210807708, lng: 123.89572715951475},
  "Colonnade Mall":                  { lat: 10.297004967226213, lng: 123.89967999256339},
  "SM City Cebu (Xiamen Entrance)":  { lat: 10.312839856990548, lng: 123.91693657127854},
  "SM Hypermarket":                  { lat: 10.31512841542575, lng: 123.92379220235848},
  "Metro Colon":                     { lat: 10.296239375731377, lng: 123.89827527075332},
  "GMall of Cebu":                   { lat: 10.309118357617605, lng: 123.91236856831263},

  // ── Schools ───────────────────────────────────────────────────────────────
  "USC Main":                        { lat: 10.3001, lng: 123.8985 }, 
  "USC South Campus":                { lat: 10.3015, lng: 123.8833 }, 
  "USC North Campus":                { lat: 10.3168, lng: 123.8943 }, 
  "USC Talamban Campus (TC)":        { lat: 10.3524, lng: 123.9135 }, 
  "UP Cebu":                         { lat: 10.3228, lng: 123.8988 }, 
  "SWU Basak Campus":                { lat: 10.2849, lng: 123.8692 }, 
  "CITU":                            { lat: 10.2941, lng: 123.8813 }, 
  "University of Cebu (UC)":         { lat: 10.2929, lng: 123.9002 }, 
  "UC-Main (Leon Kilat Entrance)":   { lat: 10.296360966112394, lng: 123.8961966724131 },
  "UV-Main (Colon Entrance)":        { lat: 10.297850573009372, lng: 123.90150939362003 },
  "Cebu Doctors University (CDU)":   { lat: 10.320182334385455, lng: 123.93286472136448},

  // ── Hospitals & Hotels ────────────────────────────────────────────────────
  "Sacred Heart Hospital":           { lat: 10.304043237303324, lng: 123.892604494767},
  "Cebu Doctors University Hospital": { lat: 10.3121, lng: 123.8918 }, 
  "Vicente Sotto Hosp.":             { lat: 10.3117, lng: 123.8890 }, 
  "Cebu City Medical Center":        { lat: 10.2991, lng: 123.8922 }, 
  "Miller Hospital":                 { lat: 10.2995, lng: 123.8725 }, 
  "Mactan Airport (MCIA)":           { lat: 10.3085, lng: 123.9803 },
  "Chong Hua Hospital Mandaue":      { lat: 10.322997623553967, lng: 123.93121055641726},
  
  // Funeral Homes
  "Queen City Memorial Garden":      { lat: 10.309265440237686, lng: 123.91225684351348},

  // Government / Historic Sites
  "Museo Sugbo":                     { lat: 10.303764625571029, lng: 123.90633622172703},
};