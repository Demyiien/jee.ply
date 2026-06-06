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

  // If origin and destination are within easy walking distance, skip jeepney search
  const straightLineDist = haversine(originLat, originLng, destLat, destLng);
  const WALK_ONLY_DIST = 0.50; // 500 m — just walk it, no jeepney needed
  if (straightLineDist <= WALK_ONLY_DIST) {
    const walkTime = Math.round(straightLineDist * 12);
    return [{
      type: "walk",
      legs: [{
        code: "WALK",
        name: "Walk to destination",
        color: "#888888",
        boardAt: "Origin",
        alightAt: "Destination",
        stops: [
          { name: "Origin",      lat: originLat, lng: originLng },
          { name: "Destination", lat: destLat,   lng: destLng   }
        ],
        dist: straightLineDist
      }],
      walkToFirst: 0,
      walkFromLast: 0,
      totalDist: straightLineDist,
      travelTime: walkTime,
      fare: 0,
      transfers: 0,
      isWalkOnly: true
    }];
  }

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

      // Score each candidate transfer by total journey cost:
      // (dist ridden on R1 to xfer point) + (xfer walk) + (straight-line from xfer to dest)
      // This prevents the router from choosing a far-away "convenient" stop (e.g. SM City)
      // when a closer intermediate stop (e.g. CITU, South Bus Terminal) is on the way.
      const boardStop1 = route1.stops[o1.idx];
      const boardToDest = haversine(boardStop1.lat, boardStop1.lng, destLat, destLng);
      let bestXfer = null, bestXferScore = Infinity;
      route1.stops.forEach((s1, i1) => {
        // Skip stops that are much further from the destination than where we board —
        // riding away from the destination just to transfer makes no geographic sense.
        const s1ToDest = haversine(s1.lat, s1.lng, destLat, destLng);
        if (s1ToDest > boardToDest * 1.4) return;

        route2.stops.forEach((s2, i2) => {
          const xferWalk = haversine(s1.lat, s1.lng, s2.lat, s2.lng);
          if (xferWalk >= XFER_THRESH) return;

          const rideOnR1   = haversine(boardStop1.lat, boardStop1.lng, s1.lat, s1.lng);
          const remainDist = haversine(s2.lat, s2.lng, destLat, destLng);
          const score      = rideOnR1 + xferWalk + remainDist;

          if (score < bestXferScore) {
            bestXferScore = score;
            bestXfer = { i1, i2, s1, s2, xferWalk };
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

      const MIN_RIDE_DIST = 0.8; // Must ride at least 800m to justify a jeepney

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

      const travelTime = Math.round(o1.dist*12 + (dist1/20)*60 + bestXfer.xferWalk*12 + (dist2/20)*60 + d2.dist*12);
      results.push({
        type: "transfer",
        legs: [
          { code: code1, name: route1.name, color: route1.color,
            boardAt: stops1[0].name, alightAt: stops1[stops1.length-1].name, stops: stops1, dist: dist1 },
          { code: code2, name: route2.name, color: route2.color,
            boardAt: stops2[0].name, alightAt: stops2[stops2.length-1].name, stops: stops2, dist: dist2 }
        ],
        xferWalk: bestXfer.xferWalk, walkToFirst: o1.dist, walkFromLast: d2.dist,
        totalDist: o1.dist + dist1 + bestXfer.xferWalk + dist2 + d2.dist,
        travelTime, fare: calcFare(dist1) + calcFare(dist2), transfers: 1
      });
    }
  }
  
// ─── START FIX: STRICT ROUTE PRIORITIZATION & DEDUPLICATION ───
  
  // 1. Deduplicate identical vehicle combinations
  const uniqueCombos = new Map();
  results.forEach(r => {
    const key = r.legs.map(l => l.code).join("|");
    if (!uniqueCombos.has(key) || r.travelTime < uniqueCombos.get(key).travelTime) {
      uniqueCombos.set(key, r);
    }
  });
  
  let bestRoutes = Array.from(uniqueCombos.values());

  // 2. Sort by Hierarchy: Least Rides -> Cheapest Fare -> Shortest Time
  bestRoutes.sort((a, b) => {
    if (a.transfers !== b.transfers) return a.transfers - b.transfers; 
    if (a.fare !== b.fare) return a.fare - b.fare;                     
    return a.travelTime - b.travelTime;                                
  });

  // 3. Keep Top 3 Options
  bestRoutes = bestRoutes.slice(0, 3);

  // 4. WALK-ONLY FALLBACK: if no jeepney routes found, return a pure walking route.
  //    Flag as 'noTransit' if the distance is too far to comfortably walk (>500m).
  if (bestRoutes.length === 0) {
    const walkDist = haversine(originLat, originLng, destLat, destLng);
    const walkTime = Math.round(walkDist * 12);
    const isTooFarToWalk = walkDist > 0.5;
    bestRoutes = [{
      type: "walk",
      legs: [{
        code: "WALK",
        name: isTooFarToWalk ? "No transit available — walk or find a nearby stop" : "Walk to destination",
        color: "#888888",
        boardAt: "Origin",
        alightAt: "Destination",
        stops: [
          { name: "Origin",      lat: originLat, lng: originLng },
          { name: "Destination", lat: destLat,   lng: destLng   }
        ],
        dist: walkDist
      }],
      walkToFirst: 0,
      walkFromLast: 0,
      totalDist: walkDist,
      travelTime: walkTime,
      fare: 0,
      transfers: 0,
      isWalkOnly: true,
      noTransit: isTooFarToWalk
    }];
  }

  return bestRoutes;
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