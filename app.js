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
          `<img src="./assets/walkman.svg" style="width: 12px; vertical-align: -2px; margin-right: 4px;"> Walk ~${mins} min`
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
             border-radius:4px;white-space:nowrap;font-family:'Work Sans',sans-serif;
             font-weight:700;border:1px solid rgba(0,0,0,0.2);
             opacity:${o};box-shadow:0 1px 4px rgba(0,0,0,0.2);
             display:inline-flex;align-items:center;justify-content:center;
             text-align:center">${leg.code}</div>`,
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
      `<img src="./assets/walkman.svg" style="width: 12px; vertical-align: -2px; margin-right: 4px;"> Walk ~${mins} min`
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

      // Inject badges and info pills into the route card
      return `<div class="route-option${i === 0 ? ' selected' : ''}" data-idx="${i}">
        <div class="route-title" style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
          ${badgesHtml}
          <span class="route-tag-pill">${tag}</span>
        </div>
        <div class="route-info-pills">
          <span class="route-pill pill-time">⏱ ${timeStr}</span>
          <span class="route-pill pill-fare">₱${r.fare}</span>
          <span class="route-pill pill-dist">📍 ${distStr}</span>
        </div>
        <div class="route-meta">
          ${r.legs.map((l, li) => `
            ${li > 0 ? '<img src="./assets/arrow-right.svg" class="route-arrow" style="width: 12px; margin: 0 4px; opacity: 0.6;" alt="to">' : ''}
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
              <img src="./assets/jeepney.svg" style="width: 14px; vertical-align: -3px; margin-right: 4px;"> [${leg.code}] alight at <b>${leg.alightAt}</b> · ${leg.dist.toFixed(1)}km · ₱${calcFare(leg.dist)}</span>
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

  if (!window.isStartingTrip) {
    setSheetState('full');
  }
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
  detourMarkers.push(null); 

  const row = document.createElement('div');
  row.className = 'field-row card-beige';
  row.innerHTML = `
    <div class="field-badge badge-detour">D</div>
    <input type="text" id="detour-input-${idx}" placeholder="Add a detour…" autocomplete="off" />
    <button class="remove-btn" id="remove-detour-btn-${idx}">✕</button>
    <button class="pin-btn" id="pin-detour-btn-${idx}" title="Pin detour on map">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    </button>
    <div class="suggestions" id="detour-suggestions-${idx}" style="display:none"></div>
  `;

  const group = document.getElementById('waypoints-group');
  const destRow = document.getElementById('dest-row');
  group.insertBefore(row, destRow);
  
  setTimeout(() => setSheetState('mid'), 10);

  // Wire pin button for this detour
  document.getElementById(`pin-detour-btn-${idx}`).addEventListener('click', () => {
    setPinMode(pinMode === `detour-${idx}` ? null : `detour-${idx}`);
  });

  // 1. Setup Autocomplete
  setupAutocomplete(`detour-input-${idx}`, `detour-suggestions-${idx}`, (r) => {
    state.detours[idx] = r;
    
    if (detourMarkers[idx]) map.removeLayer(detourMarkers[idx]); // Clear previous marker if overwritten
    detourMarkers[idx] = L.circleMarker([r.lat, r.lng], { color: '#fff', fillColor: '#3D3F4A', fillOpacity: 1, radius: 8, weight: 2 })
      .bindPopup('🔸 Detour: ' + r.name).addTo(map);
      
    map.setView([r.lat, r.lng], 14);
    setStatus(`Detour added: ${r.name}`);
  });

  // 2. Setup Remove Button
  document.getElementById(`remove-detour-btn-${idx}`).addEventListener('click', () => {
    state.detours[idx] = null; // Nullify state safely so indices don't break
    
    if (detourMarkers[idx]) {
      map.removeLayer(detourMarkers[idx]); // Remove marker from map
      detourMarkers[idx] = null;
    }
    
    // Remove UI elements
    group.removeChild(row);
    setStatus('Detour removed.');

    setTimeout(() => setSheetState('mid'), 10);
  });
});

// --- NEW TRIP BUILDER LOGIC ---
let builderState = { waypoints: [], segmentIdx: 0, selectedRoutes: [] };

let errorTimer;
function showErrorBubble(msg) {
  let bubble = document.getElementById('error-bubble');
  
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'error-bubble';
    document.getElementById('panel').prepend(bubble);
  }
  
  bubble.textContent = msg;
  bubble.classList.add('show');
  
  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    bubble.classList.remove('show');
  }, 3000);
}

document.getElementById('go-btn').addEventListener('click', () => {
  // 1. Safety Check: If a user manually erased the text, ensure the state is marked as null
  if (document.getElementById('origin-input').value.trim() === '') state.origin = null;
  if (document.getElementById('dest-input').value.trim() === '') state.dest = null;
  
  for (let i = 0; i < state.detours.length; i++) {
    const inputEl = document.getElementById(`detour-input-${i}`);
    if (inputEl && inputEl.value.trim() === '') {
      state.detours[i] = null; 
    }
  }

  // 2. Validate Start and End Locations
  if (!state.origin && !state.dest) {
    showErrorBubble('Please input a start and end location.');
    return; // Stops the code here
  } else if (!state.origin) {
    showErrorBubble('Please input a start location.');
    return; // Stops the code here
  } else if (!state.dest) {
    showErrorBubble('Please input a destination.');
    return; // Stops the code here
  }

  // 3. Validate Detours
  let hasEmptyDetour = false;
  for (let i = 0; i < state.detours.length; i++) {
    const inputEl = document.getElementById(`detour-input-${i}`);
    // If the input exists on screen but its state is null, it's empty
    if (inputEl && state.detours[i] === null) {
      hasEmptyDetour = true;
      break;
    }
  }

  if (hasEmptyDetour) {
    showErrorBubble('Please input a location for your detour.');
    return; // Stops the code here
  }

  // 4. Everything is valid, proceed with building the trip
  const validDetours = (state.detours || []).filter(d => d !== null);

  builderState.waypoints = [state.origin, ...validDetours, state.dest];
  builderState.segmentIdx = 0;
  builderState.selectedRoutes = [];

  // Clear old map routes
  document.getElementById('results').innerHTML = '';
  clearMapRoutes();

  // UI Transition
  document.getElementById('panel').classList.add('hidden');
  document.getElementById('sheet-body').classList.add('hidden');
  document.getElementById('builder-panel').classList.remove('hidden');
  document.getElementById('summary-footer').classList.remove('hidden');
  document.getElementById('summary-itinerary').innerHTML = '';
  updateBuilderSummaryStats();

  renderBuilderSegment();

  setTimeout(() => setSheetState('full'), 10);
});

// ─── LIVE SUMMARY STATS DURING BUILDER ───────────────────────────────────
function updateBuilderSummaryStats() {
  const totalSegments = builderState.waypoints.length - 1;
  const selected = builderState.selectedRoutes;
  const allDone = selected.length === totalSegments;

  let totalFare = 0, totalMins = 0, totalDist = 0, totalLegs = 0;
  selected.forEach(r => {
    totalFare += r.fare;
    totalMins += r.travelTime;
    totalDist += r.totalDist;
    if (r.legs) totalLegs += r.legs.length;
  });

  if (selected.length === 0) {
    document.getElementById('sum-trips').textContent = '—';
    document.getElementById('sum-time').textContent  = '—';
    document.getElementById('sum-dist').textContent  = '—';
    document.getElementById('sum-fare').textContent  = '—';
  } else {
    document.getElementById('sum-trips').textContent = `${totalLegs} trip${totalLegs !== 1 ? 's' : ''}`;
    document.getElementById('sum-time').textContent  = `${totalMins} mins`;
    document.getElementById('sum-dist').textContent  = `${totalDist.toFixed(2)} km`;
    document.getElementById('sum-fare').textContent  = `₱${totalFare.toFixed(2)}`;
  }

  const startBtn = document.getElementById('start-trip-btn');
  startBtn.disabled = !allDone;
}

function renderBuilderSegment() {
  const bHeader = document.getElementById('builder-header');
  const bResults = document.getElementById('builder-results');
  
  bHeader.innerHTML = ''; 
  bResults.innerHTML = '<div class="loading">Finding best options...</div>';

  setTimeout(() => {
    let html = '';
    
    const startLoc = builderState.waypoints[builderState.segmentIdx];
    const endLoc = builderState.waypoints[builderState.segmentIdx + 1];
    const segmentRoutes = findRoutes(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng);

    const generateCard = (route, isRecommended, idx) => {
      const isWalk = route.isWalkOnly || (route.legs.length === 1 && route.legs[0].code === 'WALK');
      
      const chipsOrWalk = isWalk
        ? `<div style="display:flex;align-items:center;gap:6px;color:#888;font-size:12px;">
             <img src="./assets/walkman.svg" style="width:14px; opacity:0.6;" alt="walk"> Walk to destination (no jeepney available)
           </div>`
        : `<div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center;">
            ${route.legs.map(l => `<span class="route-code-chip" style="background:${l.color}">${l.code}</span>`).join('<img src="./assets/arrow-right.svg" style="width:12px; margin:0 2px; opacity:0.6;" alt="to">')}
           </div>`;
           
           return `
           <div class="route-card" onclick="selectRouteForSegment(${idx})">
             ${isRecommended ? `<div class="route-card-header"><span>${isWalk ? 'Walk Route' : 'Recommended Route • by Manong AI'}</span></div>` : ''}
             
             <div class="route-card-main">
              <span class="route-loc">${startLoc.name.split(',')[0]}</span>
              <div style="display:flex; justify-content:center;">
                <img src="./assets/arrow-right.svg" alt="to">
              </div>
              <span class="route-loc-dest">${endLoc.name.split(',')[0]}</span>
              <span class="route-fare">${isWalk ? 'Free' : '₱' + route.fare.toFixed(2)}</span>
            </div>
     
             <div class="route-meta" style="flex-direction: column; align-items: flex-start; gap: 8px;">
               <div style="font-size:12px; color:#666;">${route.totalDist.toFixed(1)} km • ${route.travelTime} min.</div>
               ${chipsOrWalk}
             </div>
           </div>
         `;};

    // 1. PIN THE RECOMMENDED ROUTE TO THE VERY TOP
    let alternatives = [];
    if (segmentRoutes.length === 0) {
      html += `<div class="error" style="margin-bottom:8px;">No routes found between these points.</div>`;
    } else {
      const recommended = segmentRoutes[0];
      alternatives = segmentRoutes.slice(1);
      
      html += generateCard(recommended, true, 0);
      if (alternatives.length > 0) {
        html += `<div class="builder-divider" style="margin: 12px 0;">--- or build your own trip ---</div>`;
      }
    }

    // 2. RENDER THE TIMELINE (Beige Cards & Alternatives)
    builderState.waypoints.forEach((wp, i) => {
      
      let badge = 'D';
      let badgeClass = 'badge-detour';
      if (i === 0) { badge = 'S'; badgeClass = 'badge-start'; }
      else if (i === builderState.waypoints.length - 1) { badge = 'E'; badgeClass = 'badge-start'; }

      const beigeCard = `
        <div class="card-beige" style="margin-bottom:8px; padding:10px 12px; pointer-events:none;">
          <div style="display:flex; align-items:center; gap:10px;">
             <div class="field-badge ${badgeClass}">${badge}</div>
             <span style="font-weight:700; font-size:12px;">${wp.name.split(',')[0]}</span>
          </div>
        </div>
      `;

      if (i < builderState.segmentIdx) {
        // PAST: Beige Card -> Selected Route
        html += beigeCard;
        const r = builderState.selectedRoutes[i];
        html += `
          <div class="route-card" style="border-color: var(--blue); background: #f8f9fa; cursor: default;">
            
            <div class="route-card-main" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size:12px; color:var(--blue); font-weight:700;">Selected Route</span>
              <span class="route-fare">P${r.fare.toFixed(2)}</span>
            </div>

            <div class="route-meta" style="flex-direction: column; align-items: flex-start; gap: 8px;">
              <div style="font-size:12px; color:#666;">${r.totalDist.toFixed(1)} km • ${r.travelTime} min.</div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; align-items:center;">
                ${r.legs.map(l => `<span class="route-code-chip" style="background:${l.color}">${l.code}</span>`).join('<img src="./assets/arrow-right.svg" style="width:12px; margin:0 2px; opacity:0.6;" alt="to">')}
              </div>
            </div>

          </div>
        `;
      }
      else if (i === builderState.segmentIdx) {
        // CURRENT: Beige Card -> Alternative Options
        html += beigeCard;
        alternatives.forEach((alt, altIdx) => {
          html += generateCard(alt, false, altIdx + 1);
        });
      } 
      else {
        // FUTURE: Just the Beige Card
        html += beigeCard;
      }
    });

    bResults.innerHTML = html;
    setTimeout(() => setSheetState('full'));
  }, 100);
}

// Global exposure for the onclick handler
window.selectRouteForSegment = function(routeIdx) {
  const startLoc = builderState.waypoints[builderState.segmentIdx];
  const endLoc = builderState.waypoints[builderState.segmentIdx + 1];
  const selectedRoute = findRoutes(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng)[routeIdx];
  
  builderState.selectedRoutes.push(selectedRoute);
  builderState.segmentIdx++;
  updateBuilderSummaryStats();

  if (builderState.segmentIdx < builderState.waypoints.length - 1) {
    renderBuilderSegment();
  } else {
    showTripSummary();
  }

  setTimeout(() => setSheetState('mid'),10);
};

function showTripSummary() {
  // builder-panel and summary-footer are already visible; just hide the route cards
  document.getElementById('builder-panel').classList.add('hidden');

  let totalFare = 0, totalMins = 0, totalDist = 0, totalLegs = 0;
  builderState.selectedRoutes.forEach(r => {
    totalFare += r.fare;
    totalMins += r.travelTime;
    totalDist += r.totalDist;
    if (r.legs) totalLegs += r.legs.length;
  });

  document.getElementById('sum-trips').textContent = `${totalLegs} trip${totalLegs !== 1 ? 's' : ''}`;
  document.getElementById('sum-time').textContent  = `${totalMins} mins`;
  document.getElementById('sum-dist').textContent  = `${totalDist.toFixed(2)} km`;
  document.getElementById('sum-fare').textContent  = `₱${totalFare.toFixed(2)}`;

  // ── Build itinerary: S/1/2…/E nodes + per-leg cards ───────────────────
  const waypoints = builderState.waypoints;      // [origin, ...detours, dest]
  const routes    = builderState.selectedRoutes; // one route object per segment

  let html = '';

  waypoints.forEach((wp, wpIdx) => {
    // ── Waypoint header card ──────────────────────────────────────────────
    let badgeLabel, badgeCls;
    if (wpIdx === 0) {
      badgeLabel = 'S'; badgeCls = 'itin-badge badge-s';
    } else if (wpIdx === waypoints.length - 1) {
      badgeLabel = 'E'; badgeCls = 'itin-badge badge-e';
    } else {
      badgeLabel = String(wpIdx); badgeCls = 'itin-badge badge-d';
    }

    html += `
      <div class="itin-wp-card">
        <div class="${badgeCls}">${badgeLabel}</div>
        <span class="itin-wp-name">${wp.name.split(',')[0]}</span>
      </div>`;

    // ── Leg cards for this segment ────────────────────────────────────────
    if (wpIdx < routes.length) {
      const seg = routes[wpIdx];

      seg.legs.forEach((leg, legIdx) => {
        // ── WALK-ONLY leg (no jeepney available) ──────────────────────────
        if (seg.isWalkOnly || leg.code === 'WALK') {
          const wDist = leg.dist.toFixed(2);
          const wMins = Math.ceil(leg.dist * 12);
          const nextWp = waypoints[wpIdx + 1];
          const isFar = seg.noTransit || leg.dist > 0.5;
          html += `
            <div class="itin-leg-card itin-walk-card${isFar ? ' itin-walk-warning' : ''}">
              <div class="itin-leg-header">
                <span class="itin-leg-from">${wp.name.split(',')[0]}</span>
                <img src="./assets/walkman.svg" class="itin-walk-icon" style="width: 18px; height: 18px;" alt="Walk">
                <span class="itin-leg-to">${nextWp ? nextWp.name.split(',')[0] : 'Destination'}</span>
                <span class="itin-leg-fare">--</span>
              </div>
              <div class="itin-leg-meta">${wDist} km · ${wMins} min.${isFar ? ' · ⚠️ No jeepney — find a nearby stop' : ''}</div>
            </div>`;
          return;
        }

        // Walk card before first leg (if meaningful)
        if (legIdx === 0 && seg.walkToFirst > 0.05) {
          const walkDist = (seg.walkToFirst).toFixed(1);
          const walkMins = Math.ceil(seg.walkToFirst * 12);
          html += `
            <div class="itin-leg-card itin-walk-card">
              <div class="itin-leg-header">
                <span class="itin-leg-from">${wp.name.split(',')[0]}</span>
                <img src="./assets/walkman.svg" class="itin-walk-icon" style="width: 18px; height: 18px;" alt="Walk">
                <span class="itin-leg-to">${leg.boardAt.split(',')[0]}</span>
                <span class="itin-leg-fare">--</span>
              </div>
              <div class="itin-leg-meta">${walkDist} km · ${walkMins} min.</div>
            </div>`;
        }

        // Transfer walk between legs
        if (legIdx > 0 && seg.xferWalk > 0.05) {
          const prevLeg = seg.legs[legIdx - 1];
          const xDist = (seg.xferWalk).toFixed(1);
          const xMins = Math.ceil(seg.xferWalk * 12);
          html += `
            <div class="itin-leg-card itin-walk-card">
              <div class="itin-leg-header">
                <span class="itin-leg-from">${prevLeg.alightAt.split(',')[0]}</span>
                <img src="./assets/walkman.svg" class="itin-walk-icon" style="width: 18px; height: 18px;" alt="Walk">
                <span class="itin-leg-to">${leg.boardAt.split(',')[0]}</span>
                <span class="itin-leg-fare">--</span>
              </div>
              <div class="itin-leg-meta">${xDist} km · ${xMins} min.</div>
            </div>`;
        }

        // Jeepney ride card
        const rideTime = Math.ceil((leg.dist / 20) * 60);
        const chipsHTML = `<span class="route-code-chip" style="background:${leg.color}">${leg.code}</span>`;
        const svgArrow = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        html += `
          <div class="itin-leg-card">
            <div class="itin-leg-header">
              <span class="itin-leg-from">${leg.boardAt.split(',')[0]}</span>
              <span class="itin-ride-icon"><img src="./assets/arrow-right.svg" alt="to"></span>
              <span class="itin-leg-to">${leg.alightAt.split(',')[0]}</span>
              <span class="itin-leg-fare">₱${calcFare(leg.dist).toFixed(2)}</span>
            </div>
            <div class="itin-leg-meta">${leg.dist.toFixed(1)} km · ${rideTime} min.</div>
            <div class="itin-leg-chips">${chipsHTML}</div>
          </div>`;
      });

      // Walk after last leg (to next waypoint)
      if (seg.walkFromLast > 0.05) {
        const lastLeg  = seg.legs[seg.legs.length - 1];
        const nextWp   = waypoints[wpIdx + 1];
        const wDist    = (seg.walkFromLast).toFixed(1);
        const wMins    = Math.ceil(seg.walkFromLast * 12);
        html += `
          <div class="itin-leg-card itin-walk-card">
            <div class="itin-leg-header">
              <span class="itin-leg-from">${lastLeg.alightAt.split(',')[0]}</span>
              <img src="./assets/walkman.svg" class="itin-walk-icon" style="width: 18px; height: 18px;" alt="Walk">
              <span class="itin-leg-to">${nextWp.name.split(',')[0]}</span>
              <span class="itin-leg-fare">--</span>
            </div>
            <div class="itin-leg-meta">${wDist} km · ${wMins} min.</div>
          </div>`;
      }
    }
  });

  document.getElementById('summary-itinerary').innerHTML = html;
  setStatus('Trip assembled. Ready to start.');
}

// Start Trip (Maps the final stitched route)
document.getElementById('start-trip-btn').addEventListener('click', async () => {
  window.isStartingTrip = true;

  // ── Snapshot the itinerary HTML before hiding summary-footer ─────────────
  const itinerarySnapshot = document.getElementById('summary-itinerary').innerHTML;

  // ── Show loading overlay, hide everything else ────────────────────────────
  document.getElementById('summary-footer').classList.add('hidden');
  document.getElementById('panel').classList.add('hidden');
  document.getElementById('sheet-body').classList.add('hidden');
  document.getElementById('loading-overlay').classList.remove('hidden');
  setSheetState('mid');

  // ── Build the stitched trip object ────────────────────────────────────────
  let stitchedLegs = [];
  builderState.selectedRoutes.forEach(r => stitchedLegs = stitchedLegs.concat(r.legs));

  const finalTrip = {
    type: "stitched",
    legs: stitchedLegs,
    walkToFirst: builderState.selectedRoutes[0].walkToFirst,
    walkFromLast: builderState.selectedRoutes[builderState.selectedRoutes.length - 1].walkFromLast,
    xferWalk: 0.25,
    travelTime: parseInt(document.getElementById('sum-time').textContent),
    fare: parseFloat(document.getElementById('sum-fare').textContent.replace('₱', ''))
  };

  // ── Plot the route on the map (this is the slow async part) ──────────────
  await renderResults([finalTrip]);

  // ── Hide loading, reveal active-trip panel with itinerary ─────────────────
  document.getElementById('loading-overlay').classList.add('hidden');
  document.getElementById('active-trip-itinerary').innerHTML = itinerarySnapshot;
  document.getElementById('active-sum-trips').textContent = document.getElementById('sum-trips').textContent;
  document.getElementById('active-sum-time').textContent  = document.getElementById('sum-time').textContent;
  document.getElementById('active-sum-dist').textContent  = document.getElementById('sum-dist').textContent;
  document.getElementById('active-trip-panel').classList.remove('hidden');
  document.getElementById('go-btn').style.display = 'none';
  document.getElementById('add-detour-btn').style.display = 'none';

  // Wait one frame so the browser paints the panel before we measure offsetHeight
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setSheetState('mid');
    });
  });
  window.isStartingTrip = false;
});

// Back Button in Summary
// Back Button — smart multi-level back
document.getElementById('builder-back-btn').addEventListener('click', () => {
  const allDone = builderState.selectedRoutes.length === builderState.waypoints.length - 1;

  if (builderState.segmentIdx > 0 || allDone) {
    // Undo the last route selection and re-show that segment
    builderState.selectedRoutes.pop();
    builderState.segmentIdx--;
    updateBuilderSummaryStats();
    document.getElementById('summary-itinerary').innerHTML = '';
    document.getElementById('builder-panel').classList.remove('hidden');
    renderBuilderSegment();
    setTimeout(() => setSheetState('full'), 10);
  } else {
    // First segment, nothing selected — back to location input
    document.getElementById('builder-panel').classList.add('hidden');
    document.getElementById('summary-footer').classList.add('hidden');
    document.getElementById('panel').classList.remove('hidden');
    document.getElementById('sheet-body').classList.remove('hidden');
    builderState.selectedRoutes = [];
    builderState.segmentIdx = 0;
    setTimeout(() => setSheetState('mid'), 10);
  }
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

// ─── GPS / CURRENT LOCATION ───────────────────────────────────────────────
const gpsBtn = document.getElementById('gps-origin-btn');

async function applyCurrentLocation() {
  gpsBtn.classList.add('active');
  gpsBtn.style.pointerEvents = 'none';

  const onSuccess = async (pos) => {
    const { latitude: lat, longitude: lng } = pos.coords;
    let name = 'Current Location';
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'Jeeply/1.0' } }
      );
      const data = await res.json();
      if (data.display_name) name = data.display_name.split(',').slice(0, 2).join(',').trim();
    } catch {}

    const loc = { name, lat, lng };
    state.origin = loc;
    document.getElementById('origin-input').value = name;
    placeOriginMarker(loc);
    map.setView([lat, lng], 16);
    setStatus(`Origin set: ${name}`);
    gpsBtn.classList.remove('active');
    gpsBtn.style.pointerEvents = '';
  };

  const onError = (err) => {
    gpsBtn.classList.remove('active');
    gpsBtn.style.pointerEvents = '';
    if (err.code === err.PERMISSION_DENIED) {
      showErrorBubble('Location access denied. Enable it in your browser settings.');
    } else {
      showErrorBubble('Could not get your location. Try again.');
    }
  };

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000
  });
}

gpsBtn.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    showErrorBubble('Geolocation is not supported by your browser.');
    return;
  }

  // Check if we already know the permission state
  if (navigator.permissions) {
    const perm = await navigator.permissions.query({ name: 'geolocation' });
    if (perm.state === 'granted') {
      // Permission already granted — use location directly, no prompt
      applyCurrentLocation();
    } else if (perm.state === 'denied') {
      showErrorBubble('Location access is blocked. Enable it in your browser settings.');
    } else {
      // 'prompt' state — browser will ask the user once; nothing extra needed
      applyCurrentLocation();
    }
  } else {
    // Fallback for browsers without Permissions API — just request directly
    applyCurrentLocation();
  }
});

// ─── MAP CLICK ────────────────────────────────────────────────────────────
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;

  // Only act if we're in a pin mode — no coordinates popup
  if (!pinMode) return;

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
    if (detourMarkers[idx]) map.removeLayer(detourMarkers[idx]);
    detourMarkers[idx] = L.circleMarker([lat, lng], { color: '#fff', fillColor: '#3D3F4A', fillOpacity: 1, radius: 8, weight: 2 })
      .bindPopup('🔸 Detour: ' + name).addTo(map);
    setStatus(`Detour added: ${name}`);
    setPinMode(null);
    map.setView([lat, lng], 15);
  }
});

// ─── AUTOCOMPLETE HOOKS ───────────────────────────────────────────────────
setupAutocomplete('origin-input', 'origin-suggestions', (r) => {
  state.origin = r; placeOriginMarker(r); map.setView([r.lat, r.lng], 14); setStatus(`Origin: ${r.name}`);
});
setupAutocomplete('dest-input', 'dest-suggestions', (r) => {
  state.dest = r; placeDestMarker(r); map.setView([r.lat, r.lng], 14); setStatus(`Destination: ${r.name}`);
});

// ─── CHATHEAD & SHEET SYNC ────────────────────────────────────────────────
window.chatRelativeOffset = -84; // Base distance to hover above the sheet

function syncChatheadToSheet(futureTranslateY, instant = false) {
  const container = document.getElementById('manong-chat-container');
  if (!container) return; 

  // Calculate where the top of the sheet is going to be
  const sheetBaseTop = window.innerHeight - sheet.offsetHeight;
  const futureSheetTop = sheetBaseTop + futureTranslateY;
  
  // Calculate target top based on our saved draggable offset
  let targetTop = futureSheetTop + window.chatRelativeOffset;
  
  // Strict boundaries: don't go off the top of the screen, and don't overlap the sheet
  const maxTop = futureSheetTop - 52 - 16; 
  let finalTop = Math.max(16, Math.min(maxTop, targetTop));

  // Mirror the sheet's animation timing
  container.style.transition = instant ? 'none' : 'top 0.36s cubic-bezier(0.4,0,0.2,1)';
  container.style.top = `${finalTop}px`;
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────
const sheet = document.getElementById('bottom-sheet');
const handleArea = document.getElementById('sheet-handle-area');

let sheetState = 'mid';

function getSnapY(state) {
  const h = sheet.offsetHeight;
  if (state === 'peek') {
    const handleH = document.getElementById('sheet-handle-area').offsetHeight || 48;
    return h - handleH;
  }
  if (state === 'mid') {
    const handleH = document.getElementById('sheet-handle-area').offsetHeight || 48;
    let activePanelH = 190;

    const builderVisible = !document.getElementById('builder-panel').classList.contains('hidden');
    const summaryVisible = !document.getElementById('summary-footer').classList.contains('hidden');

    if (builderVisible && summaryVisible) {
      // Builder mode: #builder-panel scrolls internally, so only measure the
      // pinned summary footer — that way the stats + Back/Start buttons are
      // always fully visible at mid state without needing to drag the sheet up.
      activePanelH = document.getElementById('summary-footer').offsetHeight;
    } else if (!document.getElementById('panel').classList.contains('hidden')) {
      activePanelH = document.getElementById('panel').offsetHeight;
    } else if (summaryVisible) {
      activePanelH = document.getElementById('summary-footer').offsetHeight;
    } else if (!document.getElementById('active-trip-panel').classList.contains('hidden')) {
      activePanelH = document.getElementById('active-trip-panel').offsetHeight;
    } else if (!document.getElementById('loading-overlay').classList.contains('hidden')) {
      activePanelH = document.getElementById('loading-overlay').offsetHeight;
    }

    return Math.max(0, h - (handleH + activePanelH));
  }
  return 0; // full
}

function setSheetState(state, instant = false) {
  sheetState = state;
  const y = getSnapY(state);
  
  syncChatheadToSheet(y, instant);

  sheet.style.transition = instant ? 'none' : 'transform 0.36s cubic-bezier(0.4,0,0.2,1)';
  sheet.style.transform = `translateY(${y}px)`;

  // Show "slide up" hint only at peek
  const hint = document.getElementById('sheet-peek-hint');
  if (hint) hint.classList.toggle('visible', state === 'peek');
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
  const handleH = document.getElementById('sheet-handle-area').offsetHeight || 48;
  const clamped = Math.max(0, Math.min(touchStartTranslateY + delta, h - handleH));

  sheet.style.transform = `translateY(${clamped}px)`;
}, { passive: true });

handleArea.addEventListener('touchend', e => {
  if (touchStartY === null) return;
  const velocity = e.changedTouches[0].clientY - touchStartY;
  const h = sheet.offsetHeight;
  const currentY = getCurrentTranslateY();

  const peekY = h - 68;
  const midY  = getSnapY('mid');
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

// ─── END TRIP LOGIC ───────────────────────────────────────────────────────
function endTrip() {
  // 1. Reset Core State
  state.origin = null;
  state.dest = null;
  state.routes = [];
  state.selectedRouteIdx = 0;
  builderState.selectedRoutes = [];
  builderState.waypoints = [];

  // 2. Clear Input Fields
  document.getElementById('origin-input').value = '';
  document.getElementById('dest-input').value = '';

  // 3. Remove Map Markers
  if (originMarker) { map.removeLayer(originMarker); originMarker = null; }
  if (destMarker) { map.removeLayer(destMarker); destMarker = null; }

  // 4. Safely Clear Detours
  state.detours.forEach((d, idx) => {
    if (d !== null) {
      const removeBtn = document.getElementById(`remove-detour-btn-${idx}`);
      if (removeBtn) removeBtn.click();
    }
  });
  state.detours = [];
  detourMarkers = [];

  // 5. Clear Polylines and Results UI
  clearMapRoutes();
  document.getElementById('results').innerHTML = '';
  document.getElementById('active-trip-itinerary').innerHTML = '';
  setStatus('Trip ended. Type a location or tap the map.');

  // 6. Reset UI Panels & Buttons
  document.getElementById('sheet-body').classList.add('hidden');
  document.getElementById('builder-panel').classList.add('hidden');
  document.getElementById('summary-footer').classList.add('hidden');
  document.getElementById('loading-overlay').classList.add('hidden');
  document.getElementById('active-trip-panel').classList.add('hidden');
  document.getElementById('panel').classList.remove('hidden');

  document.getElementById('go-btn').style.display = '';
  document.getElementById('add-detour-btn').style.display = '';

  // 7. Reset Map View to Cebu City Default
  map.setView([10.3157, 123.8854], 13);
  setSheetState('mid');
}

// Attach the listener to the button
document.getElementById('end-trip-btn').addEventListener('click', endTrip);