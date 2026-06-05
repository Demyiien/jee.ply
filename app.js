// ─── APP STATE ────────────────────────────────────────────────────────────
let state = {
  origin: null,
  dest: null,
  detours: [],
  routes: [],
  selectedRouteIdx: 0
};
let detourMarkers = [];
let pinMode = null; // 'origin' | 'dest' | null | 'detour-X'

// ─── MAP INIT ─────────────────────────────────────────────────────────────
const cebuBounds = L.latLngBounds([10.15, 123.68], [10.45, 124.05]);

const map = L.map('map', {
  maxBounds: cebuBounds,
  maxBoundsViscosity: 1.0,
  minZoom: 12,
  zoomControl: false
}).setView([10.3157, 123.8854], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap', maxZoom: 19
}).addTo(map);

// Zoom control — top right
// L.control.zoom({ position: 'topright' }).addTo(map);

// ─── MARKERS ──────────────────────────────────────────────────────────────
let originMarker = null, destMarker = null;

function placeOriginMarker(loc) {
  if (originMarker) map.removeLayer(originMarker);
  originMarker = L.circleMarker([loc.lat, loc.lng],
    { color: '#fff', fillColor: '#111', fillOpacity: 1, radius: 8, weight: 2 })
    .bindPopup('📍 ' + loc.name).addTo(map);
}

function placeDestMarker(loc) {
  if (destMarker) map.removeLayer(destMarker);
  destMarker = L.circleMarker([loc.lat, loc.lng],
    { color: '#fff', fillColor: '#c0392b', fillOpacity: 1, radius: 8, weight: 2 })
    .bindPopup('🏁 ' + loc.name).addTo(map);
}

// ─── ROUTE LAYER GROUPS ───────────────────────────────────────────────────
// Each entry: { bgLines: [], fgLines: [], walkLines: [], markers: [] } | null
const routeLayerGroups = [];

function clearMapRoutes() {
  routeLayerGroups.forEach(g => {
    if (!g) return;
    [...g.bgLines, ...g.fgLines, ...g.walkLines, ...g.markers].forEach(l => {
      try { map.removeLayer(l); } catch (e) {}
    });
  });
  routeLayerGroups.length = 0;
}

// Build and add map layers for one route; returns the layer group
async function buildRouteLayers(route, isSelected) {
  const o = isSelected ? 0.95 : 0.22;
  const w = isSelected ? 5 : 2.5;
  const g = { bgLines: [], fgLines: [], walkLines: [], markers: [] };

  // Helper: draw a walk polyline using OSRM foot routing
  async function drawWalk(fromLatLng, toLatLng, tooltip) {
    const fromStop = { lat: fromLatLng[0], lng: fromLatLng[1] };
    const toStop   = { lat: toLatLng[0],   lng: toLatLng[1]   };
    
    let coords;
    try {
      coords = await osrmRoute([fromStop, toStop], 'foot');
    } catch (err) {
      coords = [fromLatLng, toLatLng];
    }

    const line = L.polyline(coords, {
      color: '#555', 
      weight: 3, 
      dashArray: '6, 9', 
      opacity: o * 0.85
    }).addTo(map);
    
    line.bindTooltip(tooltip, { sticky: true, className: 'route-tooltip walk' });
    g.walkLines.push(line);
  }

  // 1. Jeepney legs & Dynamic Trimming
  for (let i = 0; i < route.legs.length; i++) {
    const leg = route.legs[i];
    let roadCoords = await osrmRoute(leg.stops, 'driving');

    // TRIM START: Stop jeepney from drawing backwards if user boards midway
    if (i === 0 && state.origin) {
      let closestIdx = 0;
      let minDist = Infinity;
      roadCoords.forEach((coord, idx) => {
        const d = haversine(coord[0], coord[1], state.origin.lat, state.origin.lng);
        if (d < minDist) { minDist = d; closestIdx = idx; }
      });
      
      // Slice the polyline to start at the closest point to origin
      roadCoords = roadCoords.slice(closestIdx);
      
      // Update the first stop and recalculate the precise walk distance
      leg.stops[0] = { ...leg.stops[0], lat: roadCoords[0][0], lng: roadCoords[0][1] };
      route.walkToFirst = haversine(state.origin.lat, state.origin.lng, roadCoords[0][0], roadCoords[0][1]);
      
      // Draw Walk: origin → first stop
      if (route.walkToFirst > 0.01) {
        const mins = Math.ceil(route.walkToFirst * 12);
        await drawWalk(
          [state.origin.lat, state.origin.lng],
          [roadCoords[0][0], roadCoords[0][1]],
          `🚶 Walk ~${mins} min`
        );
      }
    }

    // TRIM END: Stop the route from overshooting past the destination
    if (i === route.legs.length - 1 && state.dest) {
      let closestIdx = 0;
      let minDist = Infinity;
      roadCoords.forEach((coord, idx) => {
        const d = haversine(coord[0], coord[1], state.dest.lat, state.dest.lng);
        if (d < minDist) { minDist = d; closestIdx = idx; }
      });
      
      // Slice the polyline to end exactly at the closest point to destination
      roadCoords = roadCoords.slice(0, closestIdx + 1);
      
      // Update the last stop and recalculate the precise walk distance
      const lastIdx = leg.stops.length - 1;
      leg.stops[lastIdx] = { ...leg.stops[lastIdx], lat: roadCoords[roadCoords.length - 1][0], lng: roadCoords[roadCoords.length - 1][1] };
      route.walkFromLast = haversine(roadCoords[roadCoords.length - 1][0], roadCoords[roadCoords.length - 1][1], state.dest.lat, state.dest.lng);
    }

    const rideTime = Math.ceil((leg.dist / 20) * 60);

    const bgLine = L.polyline(roadCoords, {
      color: '#fff', weight: w + 4, opacity: isSelected ? 0.65 : 0.08
    }).addTo(map);

    const fgLine = L.polyline(roadCoords, {
      color: leg.color, weight: w, opacity: o
    }).addTo(map);
    fgLine.bindTooltip(
      `🚌 [${leg.code}] ${leg.name}<br>~${rideTime} min · ₱${calcFare(leg.dist)}`,
      { sticky: true, className: 'route-tooltip ride' }
    );

    g.bgLines.push(bgLine);
    g.fgLines.push(fgLine);

    // Board marker (colored chip with route code)
    const boardIcon = L.divIcon({
      html: `<div style="background:${leg.color};color:#fff;font-size:10px;padding:2px 6px;
             border-radius:4px;white-space:nowrap;font-family:'Space Mono',monospace;
             font-weight:700;border:1px solid rgba(0,0,0,0.2);
             opacity:${o};box-shadow:0 1px 4px rgba(0,0,0,0.2)">${leg.code}</div>`,
      className: '', iconAnchor: [0, 8]
    });
    const boardMarker = L.marker([leg.stops[0].lat, leg.stops[0].lng], { icon: boardIcon }).addTo(map);
    g.markers.push(boardMarker);

    // Alight circle
    const lastStopObj = leg.stops[leg.stops.length - 1];
    const alightCircle = L.circleMarker([lastStopObj.lat, lastStopObj.lng], {
      color: leg.color, fillColor: '#fff', fillOpacity: isSelected ? 1 : 0.15,
      radius: 5, weight: 2, opacity: o
    }).addTo(map);
    g.markers.push(alightCircle);

    // Transfer walk between legs
    if (i < route.legs.length - 1) {
      const nextLeg = route.legs[i + 1];
      const mins = Math.ceil((route.xferWalk || 0) * 12);
      await drawWalk(
        [lastStopObj.lat, lastStopObj.lng],
        [nextLeg.stops[0].lat, nextLeg.stops[0].lng],
        `🚶 Transfer ~${mins} min`
      );
    }
  }

  // 2. Walk: last stop → destination
  if (state.dest && route.walkFromLast > 0.01) {
    const lastLeg  = route.legs[route.legs.length - 1];
    const lastStop = lastLeg.stops[lastLeg.stops.length - 1];
    const mins = Math.ceil(route.walkFromLast * 12);
    await drawWalk(
      [lastStop.lat,  lastStop.lng],
      [state.dest.lat, state.dest.lng],
      `🚶 Walk ~${mins} min`
    );
  }

  return g;
}

// Adjust opacity/weight of all route groups; bring idx to front
function highlightRoute(idx) {
  routeLayerGroups.forEach((g, i) => {
    if (!g) return;
    const sel = i === idx;
    const o   = sel ? 0.95 : 0.22;
    const w   = sel ? 5    : 2.5;

    g.bgLines.forEach(l => l.setStyle({ opacity: sel ? 0.65 : 0.08, weight: w + 4 }));
    g.fgLines.forEach(l => { l.setStyle({ opacity: o, weight: w }); if (sel) l.bringToFront(); });
    g.walkLines.forEach(l => { l.setStyle({ opacity: o * 0.85 }); if (sel) l.bringToFront(); });
    g.markers.forEach(m => {
      if (typeof m.setOpacity === 'function') {
        m.setOpacity(o);                              // L.Marker (divIcon)
      } else {
        m.setStyle({ opacity: o, fillOpacity: sel ? 1 : 0.1 }); // L.CircleMarker
      }
    });
  });

  // Bring selected group's markers fully to front last
  const selGroup = routeLayerGroups[idx];
  if (selGroup) {
    selGroup.fgLines.forEach(l => { try { l.bringToFront(); } catch (e) {} });
    selGroup.walkLines.forEach(l => { try { l.bringToFront(); } catch (e) {} });
    selGroup.markers.forEach(m => { try { m.bringToFront?.(); } catch (e) {} });
  }

  // Refresh origin/dest markers on top
  if (originMarker) try { originMarker.bringToFront(); } catch (e) {}
  if (destMarker)   try { destMarker.bringToFront();   } catch (e) {}
}

// ─── FIT MAP ──────────────────────────────────────────────────────────────
function fitMapToRoute(route) {
  const pts = [];
  route.legs.forEach(leg => leg.stops.forEach(s => pts.push([s.lat, s.lng])));
  if (state.origin) pts.push([state.origin.lat, state.origin.lng]);
  if (state.dest)   pts.push([state.dest.lat,   state.dest.lng]);
  if (pts.length > 1) {
    // Account for the bottom sheet in mid state (≈260px)
    map.fitBounds(pts, { paddingBottomRight: [16, 280], paddingTopLeft: [16, 80] });
  }
}

// ─── RENDER RESULTS ───────────────────────────────────────────────────────
async function renderResults(routes) {
  state.routes = routes;
  state.selectedRouteIdx = 0;

  const el = document.getElementById('results');
  if (!routes.length) {
    el.innerHTML = `<div class="no-results">No jeepney routes found.<br>Try a nearby landmark like "Tisa", "Labangon Market", or "SM Cebu".</div>`;
    return;
  }

  // Helper: Safely calculate total distance (walks + transfers + rides)
  const getDist = (r) => r.totalDist || (r.walkToFirst + r.walkFromLast + ((r.xferWalk || 0) * (r.transfers || 0)) + r.legs.reduce((sum, leg) => sum + leg.dist, 0));

  // 1. Extract metrics into arrays
  const fares = routes.map(r => r.fare);
  const times = routes.map(r => r.travelTime);
  const dists = routes.map(r => getDist(r));

  // 2. Find the absolute minimum values
  const minFare = Math.min(...fares);
  const minTime = Math.min(...times);
  const minDist = Math.min(...dists);

  // 3. STRICT TIE-BREAKER: Only award a badge if exactly ONE route holds the absolute lowest value.
  // If two routes tie for the cheapest fare, neither gets the badge.
  const uniqueCheapest = fares.filter(f => f === minFare).length === 1;
  const uniqueFastest  = times.filter(t => t === minTime).length === 1;
  const uniqueShortest = dists.filter(d => d === minDist).length === 1;

  // Build route cards
  el.innerHTML = `<div class="fare-note">₱13 base fare (4km) · +₱1.80/km · tap a route to highlight</div>` +
    routes.map((r, i) => {
      const h = Math.floor(r.travelTime / 60), m = r.travelTime % 60;
      const timeStr = h > 0 ? `${h}h ${m}m` : `${m} min`;
      const distStr = `${getDist(r).toFixed(1)} km`;
      const tag = r.type === "stitched" ? 'Stitched Detours' : r.transfers === 0 ? 'Direct' : `${r.transfers} transfer`;
      
      // Generate Badges (Only applies if the route is the UNIQUE winner)
      let badgesHtml = '';
      if (routes.length > 1) {
        if (uniqueCheapest && r.fare === minFare) {
          badgesHtml += `<span style="background:#06d6a0;color:#111;padding:3px 6px;border-radius:4px;font-size:9px;font-weight:700;margin-right:6px;letter-spacing:0.5px;">CHEAPEST</span>`;
        }
        if (uniqueFastest && r.travelTime === minTime) {
          badgesHtml += `<span style="background:#ef476f;color:#fff;padding:3px 6px;border-radius:4px;font-size:9px;font-weight:700;margin-right:6px;letter-spacing:0.5px;">FASTEST</span>`;
        }
        if (uniqueShortest && getDist(r) === minDist && minDist !== Infinity) {
          badgesHtml += `<span style="background:#118ab2;color:#fff;padding:3px 6px;border-radius:4px;font-size:9px;font-weight:700;margin-right:6px;letter-spacing:0.5px;">SHORTEST</span>`;
        }
      }

      // Inject badges and the distance text into the route title area
      return `<div class="route-option${i === 0 ? ' selected' : ''}" data-idx="${i}">
        <div class="route-title" style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
          ${badgesHtml}
          <span>${tag} · ₱${r.fare} · ${timeStr} · ${distStr}</span>
        </div>
        <div class="route-meta">
          ${r.legs.map((l, li) => `
            ${li > 0 ? '<span class="route-arrow">→</span>' : ''}
            <span class="route-code-chip" style="background:${l.color}">${l.code}</span>
          `).join('')}
        </div>
        <div class="route-steps">
          
          <div class="step">
            <div class="step-dot"></div>
            <span>Walk ${Math.round(r.walkToFirst * 1000)}m → board at <b>${r.legs[0].boardAt}</b></span>
          </div>
          
          ${r.legs.map((leg, li) => `
            ${li > 0 ? `
              <div class="step">
                <div class="step-dot"></div>
                <span>Transfer → board at <b>${leg.boardAt}</b></span>
              </div>
            ` : ''}
            <div class="step">
              <div class="step-dot" style="background:${leg.color}"></div>
              <span>[${leg.code}] alight at <b>${leg.alightAt}</b> · ${leg.dist.toFixed(1)}km · ₱${calcFare(leg.dist)}</span>
            </div>
            ${li < r.legs.length - 1
              ? `<div class="step step-transfer"><div class="step-dot"></div>
                 <span>Walk ~${Math.round((r.xferWalk || 0) * 1000)}m to next stop</span></div>`
              : ''}
          `).join('')}
          
          <div class="step">
            <div class="step-dot" style="background:#c0392b"></div>
            <span>Walk ${Math.round(r.walkFromLast * 1000)}m to destination</span>
          </div>
        </div>
      </div>`;
    }).join('');

  el.querySelectorAll('.route-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const idx = parseInt(opt.dataset.idx);
      document.querySelectorAll('.route-option').forEach(e => e.classList.remove('selected'));
      opt.classList.add('selected');
      state.selectedRouteIdx = idx;
      highlightRoute(idx);
      fitMapToRoute(routes[idx]);
    });
  });

  setSheetState('full');
  clearMapRoutes();
  
  for (let i = 0; i < routes.length; i++) routeLayerGroups.push(null);
  setStatus('Loading route geometry…');

  const g0 = await buildRouteLayers(routes[0], true);
  routeLayerGroups[0] = g0;
  fitMapToRoute(routes[0]);
  setStatus(`${routes.length} route${routes.length > 1 ? 's' : ''} found — tap to compare`);

  for (let i = 1; i < routes.length; i++) {
    buildRouteLayers(routes[i], false).then(g => {
      routeLayerGroups[i] = g;
    });
  }
}

// ─── ADD DETOUR BUTTON ────────────────────────────────────────────────────
document.getElementById('add-detour-btn').addEventListener('click', () => {
  const idx = state.detours.length;
  state.detours.push(null);
  detourMarkers.push(null); // Initialize marker slot

  const row = document.createElement('div');
  row.className = 'field-row';
  row.innerHTML = `
    <div class="field-badge" style="background:#fca311;color:#111">+</div>
    <input type="text" id="detour-input-${idx}" placeholder="Add a detour…" autocomplete="off" />
    
    <button class="remove-btn" id="remove-detour-btn-${idx}" title="Remove detour">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    
    <button class="pin-btn" id="pin-detour-btn-${idx}" title="Pin on map">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    </button>
    
    <div class="suggestions" id="detour-suggestions-${idx}" style="display:none"></div>
  `;

  const divider = document.createElement('div');
  divider.className = 'field-divider';
  divider.innerHTML = '<div class="field-divider-dots"><span></span><span></span><span></span></div>';

  const group = document.getElementById('waypoints-group');
  const destRow = document.getElementById('dest-row');
  group.insertBefore(row, destRow);
  group.insertBefore(divider, destRow);

  setupAutocomplete(`detour-input-${idx}`, `detour-suggestions-${idx}`, (r) => {
    state.detours[idx] = r;
    
    if (detourMarkers[idx]) map.removeLayer(detourMarkers[idx]); // Clear previous marker if overwritten
    detourMarkers[idx] = L.circleMarker([r.lat, r.lng], { color: '#fff', fillColor: '#fca311', fillOpacity: 1, radius: 8, weight: 2 })
      .bindPopup('🔸 Detour: ' + r.name).addTo(map);
      
    map.setView([r.lat, r.lng], 14);
    setStatus(`Detour added: ${r.name}`);
  });

  document.getElementById(`pin-detour-btn-${idx}`).addEventListener('click', () => {
    setPinMode(`detour-${idx}`);
  });

  // NEW: Remove Detour Listener
  document.getElementById(`remove-detour-btn-${idx}`).addEventListener('click', () => {
    state.detours[idx] = null; // Nullify state safely so indices don't break
    
    if (detourMarkers[idx]) {
      map.removeLayer(detourMarkers[idx]); // Remove marker from map
      detourMarkers[idx] = null;
    }
    
    // Remove UI elements
    group.removeChild(row);
    group.removeChild(divider);
    setStatus('Detour removed.');
  });
});

// ─── AUTOCOMPLETE ─────────────────────────────────────────────────────────
function setupAutocomplete(inputId, sugId, onSelect) {
  const input = document.getElementById(inputId);
  const sug   = document.getElementById(sugId);
  let timer;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const val = input.value.trim().toLowerCase();
    
    // React instantly on the first letter
    if (val.length === 0) { 
      sug.style.display = 'none'; 
      return; 
    }

    // 1. INSTANT LOCAL SEARCH: Filter local landmarks and sort by distance to map center
    const center = map.getCenter();
    let localMatches = LANDMARKS.filter(lm => lm.name.toLowerCase().includes(val));
    
    // Calculate distance and sort closest first
    localMatches.forEach(lm => {
      lm.dist = haversine(center.lat, center.lng, lm.lat, lm.lng);
    });
    localMatches.sort((a, b) => a.dist - b.dist);

    // Keep the top 4 closest local matches
    localMatches = localMatches.slice(0, 4);

    let html = localMatches.map(r =>
      `<div data-lat="${r.lat}" data-lng="${r.lng}" data-name="${r.name}"> <b>${r.name}</b> <span style="color:#888;font-size:10px;margin-left:6px">~${r.dist.toFixed(1)}km</span></div>`
    ).join('');

    if (html) {
      sug.innerHTML = html;
      sug.style.display = '';
    }

    // 2. EXTERNAL GEOCODER: Slight delay to prevent API spam, appended below local matches
    timer = setTimeout(async () => {
      try {
        const results = await geocode(val);
        
        // Filter out places already suggested by the local search
        const newResults = results.filter(ext => !localMatches.some(loc => loc.name === ext.name));

        if (newResults.length > 0) {
          html += newResults.map(r =>
            `<div data-lat="${r.lat}" data-lng="${r.lng}" data-name="${r.name}">${r.name}</div>`
          ).join('');
          
          sug.innerHTML = html;
          sug.style.display = '';
        } else if (!html) {
          sug.style.display = 'none';
        }
      } catch (e) {
        // Fail silently if geocoder is down, keeping local matches visible
      }
    }, 300); 
  });

  sug.addEventListener('click', e => {
    const d = e.target.closest('[data-lat]');
    if (!d) return;
    const r = { name: d.dataset.name, lat: parseFloat(d.dataset.lat), lng: parseFloat(d.dataset.lng) };
    onSelect(r);
    input.value = r.name;
    sug.style.display = 'none';
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !sug.contains(e.target)) sug.style.display = 'none';
  });
}

// ─── STATUS ───────────────────────────────────────────────────────────────
function setStatus(msg) {
  document.getElementById('status-bar').textContent = msg;
}

// ─── PIN MODE ─────────────────────────────────────────────────────────────
function setPinMode(mode) {
  pinMode = mode;
  const hint = document.getElementById('pin-hint');
  const hintText = document.getElementById('pin-hint-text');

  document.getElementById('pin-origin-btn').classList.toggle('active', mode === 'origin');
  document.getElementById('pin-dest-btn').classList.toggle('active', mode === 'dest');

  // Handle dynamic detour buttons if they exist
  document.querySelectorAll('[id^="pin-detour-btn-"]').forEach(btn => {
    const idx = btn.id.split('-')[3];
    btn.classList.toggle('active', mode === `detour-${idx}`);
  });

  if (mode) {
    if (mode === 'origin') hintText.textContent = 'Tap the map to pin your pick-up location';
    else if (mode === 'dest') hintText.textContent = 'Tap the map to pin your destination';
    else hintText.textContent = 'Tap the map to pin your detour';
    
    hint.classList.add('visible');
    map.getContainer().style.cursor = 'crosshair';
    setSheetState('peek'); // collapse sheet so map is usable
  } else {
    hint.classList.remove('visible');
    map.getContainer().style.cursor = '';
    setSheetState('mid');
  }
}

document.getElementById('pin-origin-btn').addEventListener('click', () => setPinMode(pinMode === 'origin' ? null : 'origin'));
document.getElementById('pin-dest-btn').addEventListener('click', () => setPinMode(pinMode === 'dest' ? null : 'dest'));
document.getElementById('pin-cancel-btn').addEventListener('click', () => setPinMode(null));

// ─── MAP CLICK ────────────────────────────────────────────────────────────
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;

  L.popup().setLatLng([lat, lng])
    .setContent(`<div style="text-align:center;font-family:'Space Mono',monospace;font-size:11px">
      <b>📍 Coordinates</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}</div>`)
    .openOn(map);
  navigator.clipboard.writeText(`{ lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)} }`).catch(() => {});

  let name = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'User-Agent': 'Jeeply/1.0' } });
    const data = await res.json();
    if (data.display_name) name = data.display_name.split(',').slice(0, 2).join(',').trim();
  } catch {}

  const loc = { name, lat, lng };

  if (pinMode === 'origin') {
    state.origin = loc;
    document.getElementById('origin-input').value = name;
    placeOriginMarker(loc);
    setStatus(`Origin: ${name}`);
    setPinMode(null);
    map.setView([lat, lng], 15);
  } else if (pinMode === 'dest') {
    state.dest = loc;
    document.getElementById('dest-input').value = name;
    placeDestMarker(loc);
    setStatus(`Destination: ${name}`);
    setPinMode(null);
    map.setView([lat, lng], 15);
  } else if (pinMode && pinMode.startsWith('detour-')) {
    const idx = parseInt(pinMode.split('-')[1]);
    state.detours[idx] = loc;
    document.getElementById(`detour-input-${idx}`).value = name;
    
    if (detourMarkers[idx]) map.removeLayer(detourMarkers[idx]); // Clear previous
    detourMarkers[idx] = L.circleMarker([lat, lng], { color: '#fff', fillColor: '#fca311', fillOpacity: 1, radius: 8, weight: 2 })
      .bindPopup('🔸 Detour: ' + name).addTo(map);
      
    setStatus(`Detour added: ${name}`);
    setPinMode(null);
    map.setView([lat, lng], 15);
  } else {
    if (!state.origin) {
      state.origin = loc;
      document.getElementById('origin-input').value = name;
      placeOriginMarker(loc);
      setStatus('Origin set. Now set your destination.');
    } else if (!state.dest) {
      state.dest = loc;
      document.getElementById('dest-input').value = name;
      placeDestMarker(loc);
      setStatus('Destination set. Tap "Route Trip".');
    }
  }
});

// ─── AUTOCOMPLETE HOOKS ───────────────────────────────────────────────────
setupAutocomplete('origin-input', 'origin-suggestions', (r) => {
  state.origin = r; placeOriginMarker(r); map.setView([r.lat, r.lng], 14); setStatus(`Origin: ${r.name}`);
});
setupAutocomplete('dest-input', 'dest-suggestions', (r) => {
  state.dest = r; placeDestMarker(r); map.setView([r.lat, r.lng], 14); setStatus(`Destination: ${r.name}`);
});

// ─── SEARCH BUTTON (MULTI-STOP STITCHING) ─────────────────────────────────
document.getElementById('go-btn').addEventListener('click', async () => {
  const validDetours = (state.detours || []).filter(d => d !== null);
  
  if (!state.origin || !state.dest) {
    setStatus('Set both origin and destination first.');
    setSheetState('mid'); 
    return;
  }

  const btn = document.getElementById('go-btn');
  btn.disabled = true; 
  btn.textContent = 'Routing Trip…';
  setStatus('Calculating route…');
  document.getElementById('results').innerHTML = '<div class="loading">Finding the best paths…</div>';
  clearMapRoutes();

  try {
    if (validDetours.length === 0) {
      const routes = findRoutes(state.origin.lat, state.origin.lng, state.dest.lat, state.dest.lng);
      if (routes.length > 0) {
        await renderResults(routes);
      } else {
        setStatus('No nearby routes found.');
        const suggestions = LANDMARKS.map(lm => ({ ...lm, dist: haversine(state.origin.lat, state.origin.lng, lm.lat, lm.lng) })).sort((a, b) => a.dist - b.dist).slice(0, 3);
        document.getElementById('results').innerHTML = `
          <div class="no-results" style="padding-bottom:8px">
            <b style="color:#c0392b">No routes within walking distance.</b><br>
            <span style="color:#888">Try heading to one of these nearby hubs:</span>
          </div>
          ${suggestions.map(s => `
            <div class="fallback-card" data-lat="${s.lat}" data-lng="${s.lng}">
              <div style="font-weight:700;font-size:12px">📍 ${s.name}</div>
              <div style="font-size:10px;color:#888;margin-top:2px">~${(s.dist * 1000).toFixed(0)}m away</div>
            </div>
          `).join('')}`;
        document.querySelectorAll('.fallback-card').forEach(c => c.addEventListener('click', () => map.setView([parseFloat(c.dataset.lat), parseFloat(c.dataset.lng)], 16)));
        setSheetState('full');
      }
    } else {
      const waypoints = [state.origin, ...validDetours, state.dest];
      let combinedLegs = [], totalTravelTime = 0, totalFare = 0, totalWalkToFirst = 0, totalWalkFromLast = 0, totalXferWalk = 0;

      for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i], end = waypoints[i + 1];
        const segmentRoutes = findRoutes(start.lat, start.lng, end.lat, end.lng);
        if (segmentRoutes.length === 0) throw new Error(`No nearby jeepney routes found between ${start.name} and ${end.name}.`);
        
        const bestSeg = segmentRoutes[0]; 
        if (i === 0) totalWalkToFirst = bestSeg.walkToFirst;
        if (i === waypoints.length - 2) totalWalkFromLast = bestSeg.walkFromLast;

        if (i > 0) {
          const prevStop = combinedLegs[combinedLegs.length - 1].stops.slice(-1)[0];
          const nextStop = bestSeg.legs[0].stops[0];
          totalXferWalk += haversine(prevStop.lat, prevStop.lng, start.lat, start.lng) + haversine(start.lat, start.lng, nextStop.lat, nextStop.lng);
        }
        if (bestSeg.xferWalk) totalXferWalk += bestSeg.xferWalk;

        combinedLegs = combinedLegs.concat(bestSeg.legs);
        totalTravelTime += bestSeg.travelTime;
        totalFare += bestSeg.fare;
      }

      await renderResults([{
        type: "stitched",
        legs: combinedLegs,
        walkToFirst: totalWalkToFirst,
        walkFromLast: totalWalkFromLast,
        xferWalk: totalXferWalk > 0 ? (totalXferWalk / (combinedLegs.length - 1)) : 0.25,
        travelTime: totalTravelTime,
        fare: totalFare,
        transfers: combinedLegs.length - 1
      }]);
    }
  } catch (err) {
    setStatus('Error: ' + err.message);
    document.getElementById('results').innerHTML = `<div class="error">${err.message}</div>`;
    setSheetState('full');
  }

  btn.disabled = false; 
  btn.textContent = 'Route Trip';
});

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────
const sheet = document.getElementById('bottom-sheet');
const handleArea = document.getElementById('sheet-handle-area');

let sheetState = 'mid';

function getSnapY(state) {
  const h = sheet.offsetHeight;
  if (state === 'peek') return h - 68;
  if (state === 'mid')  return h - 268; // shows handle+header+inputs
  return 0;                              // full
}

function setSheetState(state, instant = false) {
  sheetState = state;
  const y = getSnapY(state);
  sheet.style.transition = instant ? 'none' : 'transform 0.36s cubic-bezier(0.4,0,0.2,1)';
  sheet.style.transform = `translateY(${y}px)`;
}

// Touch drag
let touchStartY = null, touchStartTranslateY = 0;

function getCurrentTranslateY() {
  const m = new DOMMatrix(window.getComputedStyle(sheet).transform);
  return m.m42;
}

handleArea.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  touchStartTranslateY = getCurrentTranslateY();
  sheet.style.transition = 'none';
}, { passive: true });

handleArea.addEventListener('touchmove', e => {
  if (touchStartY === null) return;
  const delta = e.touches[0].clientY - touchStartY;
  const h = sheet.offsetHeight;
  const clamped = Math.max(0, Math.min(touchStartTranslateY + delta, h - 68));
  sheet.style.transform = `translateY(${clamped}px)`;
}, { passive: true });

handleArea.addEventListener('touchend', e => {
  if (touchStartY === null) return;
  const velocity = e.changedTouches[0].clientY - touchStartY;
  const h = sheet.offsetHeight;
  const currentY = getCurrentTranslateY();

  const peekY = h - 68;
  const midY  = h - 268;
  const fullY = 0;

  let target;
  if (velocity > 60) {
    // Flicked down
    target = currentY < midY ? 'mid' : 'peek';
  } else if (velocity < -60) {
    // Flicked up
    target = currentY > midY ? 'mid' : 'full';
  } else {
    // Snap to nearest
    const dists = [['peek', Math.abs(currentY - peekY)], ['mid', Math.abs(currentY - midY)], ['full', Math.abs(currentY - fullY)]];
    dists.sort((a, b) => a[1] - b[1]);
    target = dists[0][0];
  }

  setSheetState(target);
  touchStartY = null;
}, { passive: true });

// Tap on handle to cycle peek → mid → full → peek
handleArea.addEventListener('click', () => {
  if (sheetState === 'peek') setSheetState('mid');
  else if (sheetState === 'mid') setSheetState('full');
  else setSheetState('peek');
});

// Recalculate on resize (orientation change)
window.addEventListener('resize', () => setSheetState(sheetState, true));

// ─── INIT ─────────────────────────────────────────────────────────────────
// Set initial sheet position after layout is ready
setTimeout(() => setSheetState('mid', true), 0);
setStatus('Type a location or tap the map');


// ─── MANONG AI CHATHEAD LOGIC ─────────────────────────────────────────────
const chatContainer = document.getElementById('manong-chat-container');
const chathead = document.getElementById('manong-chathead');
const chatWindow = document.getElementById('manong-chat-window');
const closeChatBtn = document.getElementById('manong-close-btn');
const chatInput = document.getElementById('manong-chat-input');
const sendBtn = document.getElementById('manong-send-btn');
const messagesArea = document.getElementById('manong-chat-messages');

let isDraggingChathead = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

// Drag Start
function onDragStart(e) {
  const touch = e.type.includes('touch') ? e.touches[0] : e;
  startX = touch.clientX;
  startY = touch.clientY;
  
  // Grab absolute pixel coordinates
  const rect = chatContainer.getBoundingClientRect();
  initialLeft = rect.left;
  initialTop = rect.top;
  
  isDraggingChathead = true;
  hasMoved = false;

  // Add class for bubbly animation
  chathead.classList.add('is-dragging'); 

  document.addEventListener('mousemove', onDragMove, { passive: false });
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('mouseup', onDragEnd);
  document.addEventListener('touchend', onDragEnd);
}

// Drag Move (WITH SCREEN & BOTTOM SHEET BOUNDARY FIX)
function onDragMove(e) {
  if (!isDraggingChathead) return;
  const touch = e.type.includes('touch') ? e.touches[0] : e;
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
    hasMoved = true;
  }

  if (hasMoved) {
    e.preventDefault(); 
    
    // ─── ADD THIS FIX HERE ───────────────────────────────────
    // If the chat window is currently open, close it instantly on drag
    if (!chatWindow.classList.contains('hidden')) {
      chatWindow.classList.add('hidden');
    }
    // ─────────────────────────────────────────────────────────
    
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // ─── STRICT BOUNDARY MATH ───
    const maxLeft = window.innerWidth - 52 - 16; 
    
    // Dynamically get the top of the bottom sheet so Manong doesn't overlap it
    const sheetTop = document.getElementById('bottom-sheet').getBoundingClientRect().top;
    
    // The max height he can go is the top of the sheet, minus his size, minus 16px padding
    const maxTop = sheetTop - 52 - 16;

    // Force the coordinates to stay between 16px and the max dimensions
    newLeft = Math.max(16, Math.min(maxLeft, newLeft));
    newTop = Math.max(16, Math.min(maxTop, newTop));
    // ────────────────────────────

    chatContainer.style.right = 'auto'; 
    chatContainer.style.bottom = 'auto'; 
    chatContainer.style.left = `${newLeft}px`;
    chatContainer.style.top = `${newTop}px`;
  }
}

// Click to Open (WITH 4-QUADRANT ALIGNMENT FIX)
chathead.addEventListener('click', () => {
  if (!hasMoved) {
    const rect = chatContainer.getBoundingClientRect();
    const screenMidX = window.innerWidth / 2;
    const screenMidY = window.innerHeight / 2;
    
    // 1. Reset absolute positioning properties
    chatWindow.style.top = 'auto';
    chatWindow.style.bottom = 'auto';
    chatWindow.style.left = 'auto';
    chatWindow.style.right = 'auto';

    // 2. Vertical Alignment (Top Half vs Bottom Half)
    if (rect.top < screenMidY) {
      chatWindow.style.top = '64px'; // Sprout downwards
      chatWindow.style.transformOrigin = rect.left < screenMidX ? 'top left' : 'top right';
    } else {
      chatWindow.style.bottom = '64px'; // Sprout upwards
      chatWindow.style.transformOrigin = rect.left < screenMidX ? 'bottom left' : 'bottom right';
    }

    // 3. Horizontal Alignment (Left Half vs Right Half)
    if (rect.left < screenMidX) {
      chatWindow.style.left = '0'; // Align left edges
    } else {
      chatWindow.style.right = '0'; // Align right edges
    }

    // Toggle visibility
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
    }
  }
});

// Drag End
function onDragEnd() {
  isDraggingChathead = false;
  chathead.classList.remove('is-dragging');

  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('touchmove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  document.removeEventListener('touchend', onDragEnd);
}

chathead.addEventListener('mousedown', onDragStart);
chathead.addEventListener('touchstart', onDragStart, { passive: false });

// Close Chat Window
closeChatBtn.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

// ─── OPENROUTER API CHAT LOGIC ────────────────────────────────────────

const API_KEY = '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'; // Replace with OpenRouter Key
let chatHistory = [];

function appendMessage(text, senderType) {
  const bubble = document.createElement('div');
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  bubble.className = `chat-bubble ${senderType}-bubble`;
  messagesArea.appendChild(bubble);
  messagesArea.scrollTop = messagesArea.scrollHeight; 
  return bubble;
}

async function handleSendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // 1. Display User Message
  appendMessage(text, 'user');
  chatInput.value = '';

  // 2. Save User Message to History (Updated for OpenRouter/OpenAI format)
  chatHistory.push({
    role: "user",
    content: text
  });

  // 3. Show Loading State
  const loadingBubble = appendMessage("Manong is typing...", 'ai loading-bubble');

  try {
    // 4. Fetch response from OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // Optional but recommended by OpenRouter for routing
        'HTTP-Referer': window.location.href, 
        'X-Title': 'Jee.ply Manong AI' 
      },
      body: JSON.stringify({
        model: "gpt-oss-120b", // You can change this to any OpenRouter model
        messages: [
          {
            role: "system",
            content:
            `
            You are Manong, a helpful local transit assistant for Cebu and the Central Visayas.

            # PERSONA & TONE
            - Speak in a friendly mix of English and conversational Bisaya (e.g., "Icopy boss", "Trapik gamay").
            - Be concise, practical, and accurate. Keep responses to 1–3 short sentences.
            - Give the answer first, then any optional note.
            - If the question is unrelated to the commute, reply with introducing why the question is unrelated followed by "I'm here to help with transportation routes and fares in Cebu. Ask me about your trip!"
            - Avoid greetings, introductions, action asterisks (like *smiles*), markdown bolding (**), and unnecessary filler.

            # ROUTING RULES (CRITICAL)
            1. CURRENT ROUTE OVERRIDE: If data exists under "CURRENT ROUTE RESULTS", you MUST use those exact paths, fares, and travel times. Do not invent outside options.
            2. MANUAL ROUTING: If "CURRENT ROUTE RESULTS" says none are calculated, DO NOT tell the user to click buttons. Manually trace the connection between the user's Origin and Destination using the "AVAILABLE ROUTES" JSON data. 
            3. SELECTION PRIORITY: Always recommend exactly ONE route. Prioritize the route with the least number of transfers, then shortest time, then lowest fare. Do not explain your selection criteria; just provide the route and the total.

            # MANUAL FARE CALCULATION
            Only if you are manually calculating a route (and the fare is not provided in CURRENT ROUTE RESULTS), strictly use this formula:
            - Traditional Jeepneys: ₱14 base for the first 4 km, plus ₱2.50 per succeeding km.
            - Modern Jeepneys/Buses: ₱17 base for the first 4 km, plus ₱2.50 per succeeding km.
            - Discounts: Apply a strict 20% discount to the final total for Senior citizens, PWDs, and students (if mentioned).

            --- DYNAMIC APP CONTEXT ---

            [AVAILABLE ROUTES]
            ${JSON.stringify(JEEP_ROUTES)}

            [LANDMARKS/TERMINALS]
            ${JSON.stringify(LANDMARKS)}

            [USER'S CURRENT APP STATE]
            Origin: ${state.origin ? state.origin.name : "Not set"}
            Destination: ${state.dest ? state.dest.name : "Not set"}
            Detours: ${state.detours.filter(d => d !== null).map(d => d.name).join(', ') || "None"}

            [CURRENT ROUTE RESULTS]
            ${state.routes && state.routes.length > 0 
              ? state.routes.map((r, i) => {
                  const vehicleUsed = r.lineCode || r.name || (r.lines ? r.lines.join(' -> ') : 'Direct vehicle');
                  return `Option ${i + 1}: Take ${vehicleUsed} (${r.type === 'stitched' ? 'Transfer Route' : 'Direct Route'}) - Fare: ₱${r.fare}, Time: ${r.travelTime} mins`;
                }).join('\n') 
              : "No active map route calculated yet. Use the AVAILABLE ROUTES JSON data to find a solution for the user manually."}
            `
          },
          ...chatHistory // This dynamically appends the entire conversation history
        ]
      })
    });


    const data = await response.json();
    
    // 5. Remove Loading Bubble
    messagesArea.removeChild(loadingBubble);

    if (data.error) {
      appendMessage("Sorry boss, API error: " + data.error.message, 'ai');
      return;
    }

    // 6. Display AI Response (Updated for OpenRouter/OpenAI format)
    const aiResponseText = data.choices[0].message.content;
    appendMessage(aiResponseText, 'ai');

    // 7. Save AI Response to History so context is maintained (Updated format)
    chatHistory.push({
      role: "assistant", // OpenRouter uses 'assistant' instead of 'model'
      content: aiResponseText
    });

  } catch (error) {
    messagesArea.removeChild(loadingBubble);
    appendMessage("Sorry boss, network error. Check your internet connection.", 'ai');
    console.error(error);
  }
}

sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});