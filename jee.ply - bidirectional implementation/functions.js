  // ─── FARE ─────────────────────────────────────────────────────────────────
// ₱13 minimum for first 4 km, then +₱1.80/km
function calcFare(distKm) {
  if (distKm <= 4) return 13;
  return Math.round(13 + (distKm - 4) * 1.80);
}

// ─── DISTANCE ─────────────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestStop(stops, lat, lng) {
  // Guard clause in case a direction array is missing or empty
  if (!stops || stops.length === 0) {
    return { idx: -1, dist: Infinity };
  }

  let best = 0, bestDist = Infinity;
  
  stops.forEach((s, i) => {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < bestDist) { 
      bestDist = d; 
      best = i; 
    }
  });
  
  return { idx: best, dist: bestDist };
}

// ─── ROUTE FINDING ────────────────────────────────────────────────────────
function findRoutes(originLat, originLng, destLat, destLng) {
  const results = [];
  const WALK_THRESH = 0.7;
  const XFER_THRESH = 0.45;

  // ─── 0. NORMALIZE ROUTES ONCE ──────────────────────────────────────────
  // This guarantees every route has both an outbound and inbound array.
  // If one is missing, it dynamically generates it by perfectly reversing the other.
  const NORMALIZED_ROUTES = {};
  
  for (const [code, route] of Object.entries(JEEP_ROUTES)) {
    let outb = [], inb = [];

    if (route.stops && route.stops.length > 0) {
      // Legacy format: Flat stops array
      outb = route.stops;
      inb = [...route.stops].reverse();
    } else if (route.directions) {
      // New format: directions object
      const hasOut = route.directions.outbound && route.directions.outbound.length > 0;
      const hasIn = route.directions.inbound && route.directions.inbound.length > 0;

      if (hasOut && hasIn) {
        outb = route.directions.outbound;
        inb = route.directions.inbound;
      } else if (hasOut && !hasIn) {
        // Missing inbound: generate from outbound
        outb = route.directions.outbound;
        inb = [...route.directions.outbound].reverse();
      } else if (!hasOut && hasIn) {
        // Missing outbound: generate from inbound
        inb = route.directions.inbound;
        outb = [...route.directions.inbound].reverse(); 
      }
    }

    NORMALIZED_ROUTES[code] = {
      name: route.name,
      color: route.color,
      directions: { outbound: outb, inbound: inb }
    };
  }

  // ─── 1. FIND DIRECT ROUTES ─────────────────────────────────────────────
  // Notice we now loop over NORMALIZED_ROUTES instead of JEEP_ROUTES
  for (const [code, route] of Object.entries(NORMALIZED_ROUTES)) {
    for (const [dir, stops] of Object.entries(route.directions)) {
      if (!stops || stops.length === 0) continue;

      const o = nearestStop(stops, originLat, originLng);
      const d = nearestStop(stops, destLat, destLng);
      
      if (o.dist > WALK_THRESH || d.dist > WALK_THRESH) continue;
      
      // CRITICAL FIX: Origin must come BEFORE destination. No reversing allowed!
      if (o.idx >= d.idx) continue;

      const stopsSlice = stops.slice(o.idx, d.idx + 1);

      let rideDist = 0;
      for (let i = 0; i < stopsSlice.length - 1; i++) {
        rideDist += haversine(stopsSlice[i].lat, stopsSlice[i].lng, stopsSlice[i+1].lat, stopsSlice[i+1].lng);
      }

      const travelTime = Math.round(o.dist * 12 + (rideDist / 20) * 60 + d.dist * 12);
      
      results.push({
        type: "direct",
        legs: [{ 
          code, 
          name: route.name, 
          color: route.color,
          direction: dir, // Track which direction is being used
          boardAt: stopsSlice[0].name, 
          alightAt: stopsSlice[stopsSlice.length-1].name,
          stops: stopsSlice, 
          dist: rideDist 
        }],
        walkToFirst: o.dist, 
        walkFromLast: d.dist,
        totalDist: o.dist + rideDist + d.dist,
        travelTime, 
        fare: calcFare(rideDist), 
        transfers: 0
      });
    }
  }

  // ─── 2. FIND TRANSFER ROUTES ───────────────────────────────────────────
  for (const [code1, route1] of Object.entries(NORMALIZED_ROUTES)) {
    for (const [dir1, stops1] of Object.entries(route1.directions)) {
      if (!stops1 || stops1.length === 0) continue;
      
      const o1 = nearestStop(stops1, originLat, originLng);
      if (o1.dist > WALK_THRESH) continue;

      for (const [code2, route2] of Object.entries(NORMALIZED_ROUTES)) {
        if (code1 === code2) continue; // Skip transferring to the same route code
        
        for (const [dir2, stops2] of Object.entries(route2.directions)) {
          if (!stops2 || stops2.length === 0) continue;

          const d2 = nearestStop(stops2, destLat, destLng);
          if (d2.dist > WALK_THRESH) continue;

          let bestXfer = null, bestXferDist = Infinity;
          
          stops1.forEach((s1, i1) => {
            // Transfer stop MUST be after the origin stop on Route 1
            if (i1 <= o1.idx) return; 

            stops2.forEach((s2, i2) => {
              // Transfer stop MUST be before the destination stop on Route 2
              if (i2 >= d2.idx) return; 

              const d = haversine(s1.lat, s1.lng, s2.lat, s2.lng);
              if (d < XFER_THRESH && d < bestXferDist) {
                bestXferDist = d; 
                bestXfer = { i1, i2, s1, s2 };
              }
            });
          });

          if (!bestXfer) continue;

          const xferIdx1 = bestXfer.i1;
          const xferIdx2 = bestXfer.i2;

          // Standardize stops slice (always forward slicing)
          const stopsSlice1 = stops1.slice(o1.idx, xferIdx1 + 1);
          const stopsSlice2 = stops2.slice(xferIdx2, d2.idx + 1);

          let dist1 = 0, dist2 = 0;
          for (let i = 0; i < stopsSlice1.length-1; i++) {
            dist1 += haversine(stopsSlice1[i].lat, stopsSlice1[i].lng, stopsSlice1[i+1].lat, stopsSlice1[i+1].lng);
          }
          for (let i = 0; i < stopsSlice2.length-1; i++) {
            dist2 += haversine(stopsSlice2[i].lat, stopsSlice2[i].lng, stopsSlice2[i+1].lat, stopsSlice2[i+1].lng);
          }

          const MIN_RIDE_DIST = 0.5; 

          // ── Short Leg Direct Route Fallback ──
          if (dist1 < MIN_RIDE_DIST || dist2 < MIN_RIDE_DIST) {
            if (dist2 >= dist1) {
              const walkToR2 = haversine(originLat, originLng, stopsSlice2[0].lat, stopsSlice2[0].lng);
              const travelTime = Math.round(walkToR2 * 12 + (dist2 / 20) * 60 + d2.dist * 12);
              
              results.push({
                type: "direct",
                legs: [{ 
                  code: code2, name: route2.name, color: route2.color, direction: dir2,
                  boardAt: stopsSlice2[0].name, alightAt: stopsSlice2[stopsSlice2.length-1].name, 
                  stops: stopsSlice2, dist: dist2 
                }],
                walkToFirst: walkToR2, walkFromLast: d2.dist,
                totalDist: walkToR2 + dist2 + d2.dist,
                travelTime, fare: calcFare(dist2), transfers: 0
              });
            } else {
              const walkFromR1 = haversine(stopsSlice1[stopsSlice1.length-1].lat, stopsSlice1[stopsSlice1.length-1].lng, destLat, destLng);
              const travelTime = Math.round(o1.dist * 12 + (dist1 / 20) * 60 + walkFromR1 * 12);
              
              results.push({
                type: "direct",
                legs: [{ 
                  code: code1, name: route1.name, color: route1.color, direction: dir1,
                  boardAt: stopsSlice1[0].name, alightAt: stopsSlice1[stopsSlice1.length-1].name, 
                  stops: stopsSlice1, dist: dist1 
                }],
                walkToFirst: o1.dist, walkFromLast: walkFromR1,
                totalDist: o1.dist + dist1 + walkFromR1,
                travelTime, fare: calcFare(dist1), transfers: 0
              });
            }
            continue; 
          }

          const travelTime = Math.round(o1.dist*12 + (dist1/20)*60 + bestXferDist*12 + (dist2/20)*60 + d2.dist*12);
          
          results.push({
            type: "transfer",
            legs: [
              { code: code1, name: route1.name, color: route1.color, direction: dir1,
                boardAt: stopsSlice1[0].name, alightAt: stopsSlice1[stopsSlice1.length-1].name, stops: stopsSlice1, dist: dist1 },
              { code: code2, name: route2.name, color: route2.color, direction: dir2,
                boardAt: stopsSlice2[0].name, alightAt: stopsSlice2[stopsSlice2.length-1].name, stops: stopsSlice2, dist: dist2 }
            ],
            xferWalk: bestXferDist, walkToFirst: o1.dist, walkFromLast: d2.dist,
            totalDist: o1.dist + dist1 + bestXferDist + dist2 + d2.dist,
            travelTime, fare: calcFare(dist1) + calcFare(dist2), transfers: 1
          });
        }
      }
    }
  }

  // ─── 3. STRICT ROUTE PRIORITIZATION & DEDUPLICATION ────────────────────
  const uniqueCombos = new Map();
  results.forEach(r => {
    // Include direction in the uniqueness key to ensure distinct inbound/outbound legs don't overwrite each other
    const key = r.legs.map(l => `${l.code}-${l.direction}`).join("|");
    
    if (!uniqueCombos.has(key) || r.travelTime < uniqueCombos.get(key).travelTime) {
      uniqueCombos.set(key, r);
    }
  });
  
  let bestRoutes = Array.from(uniqueCombos.values());

  bestRoutes.sort((a, b) => {
    if (a.transfers !== b.transfers) return a.transfers - b.transfers; 
    if (a.fare !== b.fare) return a.fare - b.fare;                   
    return a.travelTime - b.travelTime;                               
  });

  const directRoutes = bestRoutes.filter(r => r.transfers === 0);
  if (directRoutes.length > 0) {
    const bestDirectTime = Math.min(...directRoutes.map(r => r.travelTime));
    
    bestRoutes = bestRoutes.filter(r => 
      r.transfers === 0 || r.travelTime <= bestDirectTime - 15
    );
  }

  return bestRoutes.slice(0, 3);
}

// ─── GEOCODING ────────────────────────────────────────────────────────────
async function geocode(query) {
  const q = query.toLowerCase().trim();
  const local = LANDMARKS.filter(l => l.name.toLowerCase().includes(q));
  if (local.length > 0) return local.slice(0, 6);
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Cebu City, Philippines')}&format=json&limit=5`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'Jeeply/1.0' } });
    const data = await res.json();
    return data.map(d => ({
      name: d.display_name.split(',').slice(0, 2).join(',').trim(),
      lat: parseFloat(d.lat), lng: parseFloat(d.lon)
    }));
  } catch { return []; }
}

// ─── POLYLINE DECODER ─────────────────────────────────────────────────────
function decodePolyline(encoded, precision = 5) {
  let index = 0, lat = 0, lng = 0;
  const coords = [], factor = Math.pow(10, precision);
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    coords.push([lat / factor, lng / factor]);
  }
  return coords;
}

// ─── OSRM ROUTING ─────────────────────────────────────────────────────────
// mode: 'driving' for jeepney legs, 'foot' for walking segments
// ─── OSRM ROUTING (TRUE PEDESTRIAN PROFILE FIX) ───────────────────────────
async function osrmRoute(stops, mode = 'driving') {
  if (stops.length < 2) return stops.map(s => [s.lat, s.lng]);
  
  const coords = stops.map(s => `${s.lng},${s.lat}`).join(';');
  let url = '';

  if (mode === 'foot') {
    // True pedestrian routing server instance
    // Note: This endpoint expects '/driving/' in the final path segment, 
    // but the sub-domain proxy compiles pure pedestrian/foot path maps.
    url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=polyline`;
  } else {
    // Standard vehicle routing server instance for your jeepney legs
    url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline`;
  }
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('OSRM Route missing');
    
    // Decodes smoothly using your existing 5-decimal precision parser
    return decodePolyline(data.routes[0].geometry, 5);
  } catch (e) {
    console.warn(`OSRM ${mode} routing failed, drawing straight fallback lines:`, e);
    return stops.map(s => [s.lat, s.lng]);
  }
}