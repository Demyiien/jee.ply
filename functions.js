// ─── FARE ─────────────────────────────────────────────────────────────────
// ₱13 minimum for first 4 km, then +₱1.80/km
function calcFare(distKm) {
  if (distKm <= 4) return 13;
  return Math.round(13 + (distKm - 4) * 1.80);
}

// ─── DISTANCE ─────────────────────────────────────────────────────────────
// Haversine formula — returns distance in km between two lat/lng points
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Returns the index + distance of the nearest stop on a route to a given point
function nearestStop(route, lat, lng) {
  let best = 0, bestDist = Infinity;
  route.stops.forEach((s, i) => {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return { idx: best, dist: bestDist };
}

// ─── ROUTE FINDING ────────────────────────────────────────────────────────
// Returns up to 5 best routes (direct + 1-transfer) sorted by travel time
function findRoutes(originLat, originLng, destLat, destLng) {
  const results = [];
  const WALK_THRESH = 0.5;   // max walk distance to/from a stop (km)
  const XFER_THRESH = 0.45;  // max walk distance between transfer stops (km)

  // 1. Direct routes
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

  // 2. One-transfer routes
  for (const [code1, route1] of Object.entries(JEEP_ROUTES)) {
    const o1 = nearestStop(route1, originLat, originLng);
    if (o1.dist > WALK_THRESH) continue;

    for (const [code2, route2] of Object.entries(JEEP_ROUTES)) {
      if (code1 === code2) continue;
      const d2 = nearestStop(route2, destLat, destLng);
      if (d2.dist > WALK_THRESH) continue;

      // Find best transfer point (closest pair of stops between the two routes)
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

  // Sort by travel time, deduplicate by route+board+alight key, return top 5
  results.sort((a, b) => a.travelTime - b.travelTime);
  const seen = new Set();
  return results.filter(r => {
    const key = r.legs.map(l => l.code + l.boardAt + l.alightAt).join("|");
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 5);
}

// ─── GEOCODING ────────────────────────────────────────────────────────────
// Checks local LANDMARKS first (fuzzy match), then falls back to Nominatim
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

// ─── OSRM POLYLINE DECODER ────────────────────────────────────────────────
// Decodes a Google-encoded polyline string into [[lat, lng], ...] pairs
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

// Fetches road geometry from OSRM for an array of stops
// Falls back to straight-line coordinates on failure
async function osrmRoute(stops) {
  if (stops.length < 2) return stops.map(s => [s.lat, s.lng]);
  const coords = stops.map(s => `${s.lng},${s.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline6`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error();
    return decodePolyline(data.routes[0].geometry, 6);
  } catch {
    return stops.map(s => [s.lat, s.lng]);
  }
}
