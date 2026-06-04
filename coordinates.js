// ── Jee.ply · Coordinates ─────────────────────────────────────────────────

const COORDS = {

  // ── Terminals / Major Hubs (Shifted to actual PUJ loading zones) ─────────
  "Carbon":                          { lat: 10.29230, lng: 123.89920 }, // M.C. Briones / USJR side
  "Colon":                           { lat: 10.29653, lng: 123.89868 }, // Colon & Osmeña Blvd intersection
  "Fuente Osmeña":                   { lat: 10.31201, lng: 123.89308 }, // Osmeña Blvd waiting shed
  "SM City Cebu":                    { lat: 10.31342, lng: 123.91845 }, // Main PUJ Terminal (North Wing)
  "Ayala Center Cebu":               { lat: 10.31956, lng: 123.90566 }, // Ayala PUV Terminal (Luzon Ave)
  "Parkmall":                        { lat: 10.32550, lng: 123.93480 }, // Parkmall PUJ Terminal
  "IT Park":                         { lat: 10.33005, lng: 123.90487 }, // IT Park Transport Terminal
  "South Bus Terminal":              { lat: 10.29836, lng: 123.89265 }, // N. Bacalso entrance
  "North Bus Terminal":              { lat: 10.31480, lng: 123.91820 }, // NBT (Now located at SM City Cebu)
  "Pier":                            { lat: 10.30335, lng: 123.91250 }, // Pier 1 entrance
  "Alumnos":                         { lat: 10.28950, lng: 123.87700 }, // Alumnos street corner
  "Cathedral":                       { lat: 10.29520, lng: 123.90230 }, // Manalili side
  "City Hall":                       { lat: 10.29320, lng: 123.90150 }, // Magellan's Cross / City Hall Square
  "Plaza Independencia":             { lat: 10.29275, lng: 123.90424}, // Plaza Independencia corner

  // ── Modern Mega-Developments ──────────────────────────────────────────────
  "SM Seaside City Cebu":            { lat: 10.28114, lng: 123.88050 }, // Mountain Wing Transport Hub
  "Cebu Ocean Park":                 { lat: 10.28040, lng: 123.88210 }, // Entrance driveway
  "NUSTAR Resort & Casino":          { lat: 10.27400, lng: 123.88560 }, // Main gate / SRP Road
  "Il Corso Lifemalls":              { lat: 10.26675, lng: 123.87749 }, // SRP highway drop-off

  // ── Barangays & Highway Anchors (Corrected to OSM Highway Nodes) ──────────
  "Tisa":                            { lat: 10.30150, lng: 123.87050 }, // Katipunan St
  "Punta Princesa":                  { lat: 10.29453, lng: 123.87006 }, // Lourdes Parish intersection
  "Basak San Nicolas":               { lat: 10.28930, lng: 123.86820 }, // N. Bacalso Highway
  "Labangon":                        { lat: 10.30320, lng: 123.87900 }, // Tres de Abril / Katipunan
  "Labangon Market":                 { lat: 10.29879, lng: 123.88216 }, // Market road front
  "Mambaling":                       { lat: 10.29200, lng: 123.88150 }, // N. Bacalso
  "Mambaling Flyover":               { lat: 10.29116, lng: 123.87729 }, // Flyover bottom
  "Guadalupe":                       { lat: 10.31250, lng: 123.87820 }, // Guadalupe Church / V. Rama
  "Banawa":                          { lat: 10.31420, lng: 123.88200 }, // Duterte St / Banawa
  "Urgello":                         { lat: 10.30150, lng: 123.89050 }, // Aznar Rd / Urgello St
  "Mabolo":                          { lat: 10.32040, lng: 123.91720 }, // Mabolo Church (F. Cabahug)
  "Lahug (Jy Square)":               { lat: 10.33441, lng: 123.89895 }, // Gorordo / Salinas intersection
  "Apas":                            { lat: 10.33950, lng: 123.90680 }, // Camp Lapu-Lapu Rd
  "Busay":                           { lat: 10.36210, lng: 123.88890 }, // Cebu Transcentral Hwy
  "Pit-os":                          { lat: 10.37050, lng: 123.92100 }, // Pit-os Terminal
  "Talamban":                        { lat: 10.36650, lng: 123.91500 }, // Talamban Gym / Intersection
  "Mandaue":                         { lat: 10.34460, lng: 123.94240 }, // Mandaue City Hall / Highway
  "Bulacao":                         { lat: 10.27324, lng: 123.84898 }, // Bulacao-Pardo boundary
  "Tabunok":                         { lat: 10.26633, lng: 123.84204 }, // Tabunok Flyover underpass
  "Poblacion Talisay":               { lat: 10.24510, lng: 123.85100 }, // Talisay City Hall
  "Inayawan":                        { lat: 10.27450, lng: 123.86950 }, // Inayawan Public Market
  "Pardo":                           { lat: 10.28250, lng: 123.85800 }, // Pardo Church front
  "Quiot / Basak San Nicolas":       { lat: 10.28750, lng: 123.85710 }, // Quiot corner
  "Talisay City":                    { lat: 10.25200, lng: 123.83900 }, // Tabunok Highway
  "Minglanilla":                     { lat: 10.24420, lng: 123.79750 }, // Minglanilla Highway
  "Plaza Housing":                   { lat: 10.34180, lng: 123.88800 }, // Transcentral corner
  "Lapu-Lapu City (Opon)":           { lat: 10.31480, lng: 123.94910 }, // Opon Mercado terminal

  // ── Roads / Intersections ─────────────────────────────────────────────────
  "V. Rama Ave":                     { lat: 10.30820, lng: 123.88900 }, // V. Rama mid-section
  "Gorordo Ave":                     { lat: 10.32240, lng: 123.89850 }, // Gorordo / Escario intersection
  "Capitol":                         { lat: 10.31580, lng: 123.89080 }, // Escario / Osmeña intersection
  "Mango Square / Escario":          { lat: 10.31750, lng: 123.89250 }, // Mango Ave (Gen Maxilom)
  "Salinas Drive":                   { lat: 10.33400, lng: 123.90120 }, // Salinas fronting IT Park
  "N. Bacalso Ave":                  { lat: 10.30600, lng: 123.88600 }, // N. Bacalso mid-section

  // ── Malls / Markets ───────────────────────────────────────────────────────
  "Robinsons Place":                 { lat: 10.31050, lng: 123.89350 }, // Osmeña Blvd entrance
  "Robinsons Galleria Cebu":         { lat: 10.31140, lng: 123.90900 }, // Maxilom Ave Extension
  "Taboan Market":                   { lat: 10.29550, lng: 123.89110 }, // T. Abella St
  "Gaisano Country Mall":            { lat: 10.33920, lng: 123.91810 }, // Gov. Cuenco Ave drop-off
  "Banilad Town Centre (BTC)":       { lat: 10.34215, lng: 123.91585 }, // Gov. Cuenco Ave drop-off
  "Gaisano Grand Jai-Alai":          { lat: 10.28910, lng: 123.88210 }, // N. Bacalso entrance
  "Escario Central Mall":            { lat: 10.31880, lng: 123.88990 }, // N. Escario St
  "Elizabeth Mall (E-Mall)":         { lat: 10.29850, lng: 123.89550 }, // Sanciangko St / Leon Kilat

  // ── Schools ───────────────────────────────────────────────────────────────
  "USC Main":                        { lat: 10.29950, lng: 123.89800 }, // P. Del Rosario entrance
  "USC South Campus":                { lat: 10.30150, lng: 123.88330 }, // J. Alcantara St gate
  "USC North Campus":                { lat: 10.31680, lng: 123.89430 }, // Gen. Maxilom Ave gate
  "USC Talamban Campus (TC)":        { lat: 10.35400, lng: 123.91300 }, // Main Gate Gov. Cuenco
  "UP Cebu":                         { lat: 10.32280, lng: 123.89880 }, // Gorordo Ave entrance
  "SWU Basak Campus":                { lat: 10.28490, lng: 123.86920 }, // SWU Basak Gate
  "CITU":                            { lat: 10.29400, lng: 123.88120 }, // N. Bacalso Highway entrance
  "University of Cebu (UC)":         { lat: 10.29290, lng: 123.90020 }, // Sanciangko Gate

  // ── Hospitals & Hotels ────────────────────────────────────────────────────
  "Cebu Doctors University Hospital": { lat: 10.31210, lng: 123.89180 }, // Osmeña Blvd drop-off
  "Vicente Sotto Hosp.":             { lat: 10.31170, lng: 123.88900 }, // B. Rodriguez St entrance
  "Cebu City Medical Center":        { lat: 10.29910, lng: 123.89220 }, // N. Bacalso entrance
  "Miller Hospital":                 { lat: 10.29950, lng: 123.87250 }, // Tres de Abril entrance
  "Mactan Airport (MCIA)":           { lat: 10.30850, lng: 123.98030 }  // T1 / T2 loop
};