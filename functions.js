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

function nearestStop(route, lat, lng) {
  let best = 0, bestDist = Infinity;
  route.stops.forEach((s, i) => {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return { idx: best, dist: bestDist };
}

// ─── ROUTE FINDING ────────────────────────────────────────────────────────
function findRoutes(originLat, originLng, destLat, destLng) {
  const results = [];
  const WALK_THRESH = 0.7;
  const XFER_THRESH = 0.45;

  for (const [code, route] of Object.entries(JEEP_ROUTES)) {
    const o = nearestStop(route, originLat, originLng);
    const d = nearestStop(route, destLat, destLng);
    if (o.dist > WALK_THRESH || d.dist > WALK_THRESH) continue;
    if (o.idx === d.idx) continue;

    const fromIdx = o.idx, toIdx = d.idx;
    const stopsSlice = fromIdx < toIdx
      ? route.stops.slice(fromIdx, toIdx + 1)
      : route.stops.slice(toIdx, fromIdx + 1).reverse();

    let rideDist = 0;
    for (let i = 0; i < stopsSlice.length - 1; i++)
      rideDist += haversine(stopsSlice[i].lat, stopsSlice[i].lng, stopsSlice[i+1].lat, stopsSlice[i+1].lng);

    const travelTime = Math.round(o.dist * 12 + (rideDist / 20) * 60 + d.dist * 12);
    results.push({
      type: "direct",
      legs: [{ code, name: route.name, color: route.color,
               boardAt: stopsSlice[0].name, alightAt: stopsSlice[stopsSlice.length-1].name,
               stops: stopsSlice, dist: rideDist }],
      walkToFirst: o.dist, walkFromLast: d.dist,
      totalDist: o.dist + rideDist + d.dist,
      travelTime, fare: calcFare(rideDist), transfers: 0
    });
  }

  for (const [code1, route1] of Object.entries(JEEP_ROUTES)) {
    const o1 = nearestStop(route1, originLat, originLng);
    if (o1.dist > WALK_THRESH) continue;

    for (const [code2, route2] of Object.entries(JEEP_ROUTES)) {
      if (code1 === code2) continue;
      const d2 = nearestStop(route2, destLat, destLng);
      if (d2.dist > WALK_THRESH) continue;

      let bestXfer = null, bestXferDist = Infinity;
      route1.stops.forEach((s1, i1) => {
        route2.stops.forEach((s2, i2) => {
          const d = haversine(s1.lat, s1.lng, s2.lat, s2.lng);
          if (d < XFER_THRESH && d < bestXferDist) {
            bestXferDist = d; bestXfer = { i1, i2, s1, s2 };
          }
        });
      });
      if (!bestXfer) continue;

      const fromIdx1 = o1.idx, xferIdx1 = bestXfer.i1;
      const xferIdx2 = bestXfer.i2, toIdx2 = d2.idx;
      if (fromIdx1 === xferIdx1 || xferIdx2 === toIdx2) continue;

      const stops1 = fromIdx1 < xferIdx1
        ? route1.stops.slice(fromIdx1, xferIdx1 + 1)
        : route1.stops.slice(xferIdx1, fromIdx1 + 1).reverse();
      const stops2 = xferIdx2 < toIdx2
        ? route2.stops.slice(xferIdx2, toIdx2 + 1)
        : route2.stops.slice(toIdx2, xferIdx2 + 1).reverse();

      let dist1 = 0, dist2 = 0;
      for (let i = 0; i < stops1.length-1; i++)
        dist1 += haversine(stops1[i].lat, stops1[i].lng, stops1[i+1].lat, stops1[i+1].lng);
      for (let i = 0; i < stops2.length-1; i++)
        dist2 += haversine(stops2[i].lat, stops2[i].lng, stops2[i+1].lat, stops2[i+1].lng);

      const MIN_RIDE_DIST = 0.5; // Lowered to 500m threshold

      if (dist1 < MIN_RIDE_DIST || dist2 < MIN_RIDE_DIST) {
        // Find which leg is longer and keep it as the primary direct route.
        // This prevents the "blank results" bug if BOTH legs happen to be short.
        if (dist2 >= dist1) {
          // Leg 1 is shorter, so drop it and walk to the 2nd jeepney instead
          const walkToR2 = haversine(originLat, originLng, stops2[0].lat, stops2[0].lng);
          const travelTime = Math.round(walkToR2 * 12 + (dist2 / 20) * 60 + d2.dist * 12);
          
          results.push({
            type: "direct",
            legs: [{ 
              code: code2, name: route2.name, color: route2.color, 
              boardAt: stops2[0].name, alightAt: stops2[stops2.length-1].name, 
              stops: stops2, dist: dist2 
            }],
            walkToFirst: walkToR2, walkFromLast: d2.dist,
            totalDist: walkToR2 + dist2 + d2.dist,
            travelTime, fare: calcFare(dist2), transfers: 0
          });
        } 
        else {
          // Leg 2 is shorter, so take the 1st jeepney and walk the rest of the way
          const walkFromR1 = haversine(stops1[stops1.length-1].lat, stops1[stops1.length-1].lng, destLat, destLng);
          const travelTime = Math.round(o1.dist * 12 + (dist1 / 20) * 60 + walkFromR1 * 12);
          
          results.push({
            type: "direct",
            legs: [{ 
              code: code1, name: route1.name, color: route1.color, 
              boardAt: stops1[0].name, alightAt: stops1[stops1.length-1].name, 
              stops: stops1, dist: dist1 
            }],
            walkToFirst: o1.dist, walkFromLast: walkFromR1,
            totalDist: o1.dist + dist1 + walkFromR1,
            travelTime, fare: calcFare(dist1), transfers: 0
          });
        }
        
        continue; // Skip the illogical 2-jeepney route
      }

      const travelTime = Math.round(o1.dist*12 + (dist1/20)*60 + bestXferDist*12 + (dist2/20)*60 + d2.dist*12);
      results.push({
        type: "transfer",
        legs: [
          { code: code1, name: route1.name, color: route1.color,
            boardAt: stops1[0].name, alightAt: stops1[stops1.length-1].name, stops: stops1, dist: dist1 },
          { code: code2, name: route2.name, color: route2.color,
            boardAt: stops2[0].name, alightAt: stops2[stops2.length-1].name, stops: stops2, dist: dist2 }
        ],
        xferWalk: bestXferDist, walkToFirst: o1.dist, walkFromLast: d2.dist,
        totalDist: o1.dist + dist1 + bestXferDist + dist2 + d2.dist,
        travelTime, fare: calcFare(dist1) + calcFare(dist2), transfers: 1
      });
    }
  }

  // ... [Existing loops finishing up] ...

  // ─── START FIX: STRICT ROUTE PRIORITIZATION & DEDUPLICATION ───
  
  // 1. Deduplicate identical vehicle combinations
  const uniqueCombos = new Map();
  results.forEach(r => {
    // Identify the route strictly by the jeepney codes used (e.g., "42D" or "13C|04L")
    const key = r.legs.map(l => l.code).join("|");
    
    // If we haven't seen this combo, or if THIS version is faster (less walking), keep it.
    if (!uniqueCombos.has(key) || r.travelTime < uniqueCombos.get(key).travelTime) {
      uniqueCombos.set(key, r);
    }
  });
  
  let bestRoutes = Array.from(uniqueCombos.values());

  // 2. Sort by Hierarchy: Least Rides -> Cheapest Fare -> Shortest Time
  bestRoutes.sort((a, b) => {
    if (a.transfers !== b.transfers) return a.transfers - b.transfers; // Prioritize fewest rides
    if (a.fare !== b.fare) return a.fare - b.fare;                     // Then prioritize lowest fare
    return a.travelTime - b.travelTime;                                // Then prioritize fastest time
  });

  // 3. Prune Unnecessary Transfers
  // If we found a direct route, aggressively filter out any transfer routes
  const directRoutes = bestRoutes.filter(r => r.transfers === 0);
  if (directRoutes.length > 0) {
    const bestDirectTime = Math.min(...directRoutes.map(r => r.travelTime));
    
    // Only keep a transfer route if it saves you a massive amount of time (e.g., 15+ mins)
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