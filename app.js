// ─── APP STATE ────────────────────────────────────────────────────────────
let state = { origin: null, dest: null, routes: [], selectedRoute: null };
let pinMode = null;

// ─── MAP INIT ─────────────────────────────────────────────────────────────
const map = L.map('map').setView([10.3157, 123.8854], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap', maxZoom: 19
}).addTo(map);

let originMarker = null, destMarker = null;
const routeLayers = [];

function clearMapRoutes() {
  routeLayers.forEach(l => map.removeLayer(l));
  routeLayers.length = 0;
}

// ─── MARKERS ──────────────────────────────────────────────────────────────
function placeOriginMarker(loc) {
  if (originMarker) map.removeLayer(originMarker);
  originMarker = L.circleMarker([loc.lat, loc.lng],
    { color: '#000', fillColor: '#000', fillOpacity: 1, radius: 7 })
    .bindPopup('📍 ' + loc.name).addTo(map);
}

function placeDestMarker(loc) {
  if (destMarker) map.removeLayer(destMarker);
  destMarker = L.circleMarker([loc.lat, loc.lng],
    { color: '#c00', fillColor: '#c00', fillOpacity: 1, radius: 7 })
    .bindPopup('🏁 ' + loc.name).addTo(map);
}

// ─── DRAW ROUTE ───────────────────────────────────────────────────────────
async function drawRoute(route) {
  clearMapRoutes();
  if (!route) return;
  setStatus('Fetching road geometry...');

  if (state.origin) {
    if (originMarker) map.removeLayer(originMarker);
    originMarker = L.circleMarker([state.origin.lat, state.origin.lng],
      { color: '#000', fillColor: '#000', fillOpacity: 1, radius: 7 })
      .bindPopup('📍 ' + state.origin.name).addTo(map);
  }
  if (state.dest) {
    if (destMarker) map.removeLayer(destMarker);
    destMarker = L.circleMarker([state.dest.lat, state.dest.lng],
      { color: '#c00', fillColor: '#c00', fillOpacity: 1, radius: 7 })
      .bindPopup('🏁 ' + state.dest.name).addTo(map);
  }

  const allPoints = [];
  for (const leg of route.legs) {
    const roadCoords = await osrmRoute(leg.stops);
    allPoints.push(...roadCoords);
    routeLayers.push(L.polyline(roadCoords, { color: '#fff', weight: 8, opacity: 0.7 }).addTo(map));
    routeLayers.push(L.polyline(roadCoords, { color: leg.color, weight: 5, opacity: 0.95 }).addTo(map));
    const boardIcon = L.divIcon({
      html: `<div style="background:${leg.color};color:#fff;font-size:10px;padding:2px 5px;border-radius:3px;white-space:nowrap;font-family:monospace;font-weight:bold;border:1px solid rgba(0,0,0,0.3)">${leg.code}</div>`,
      className: '', iconAnchor: [0, 0]
    });
    routeLayers.push(L.marker([leg.stops[0].lat, leg.stops[0].lng], { icon: boardIcon }).addTo(map));
    routeLayers.push(L.circleMarker([leg.stops[leg.stops.length-1].lat, leg.stops[leg.stops.length-1].lng],
      { color: leg.color, fillColor: '#fff', fillOpacity: 1, radius: 5, weight: 2 }).addTo(map));
  }

  if (state.origin) allPoints.push([state.origin.lat, state.origin.lng]);
  if (state.dest) allPoints.push([state.dest.lat, state.dest.lng]);
  if (allPoints.length > 1) map.fitBounds(allPoints, { padding: [30, 30] });
  setStatus(`Route: ${route.legs.map(l => l.code).join(' → ')} · ₱${route.fare} · ~${route.travelTime} min`);
}

// ─── RENDER RESULTS ───────────────────────────────────────────────────────
function renderResults(routes) {
  const el = document.getElementById('results');
  if (!routes.length) {
    el.innerHTML = `<div class="no-results">No jeepney routes found. Try a nearby landmark (e.g. "Tisa", "Labangon Market", "SM Cebu").</div>`;
    return;
  }
  el.innerHTML = `<div class="fare-note">₱13 min fare (4km) · +₱1.80/km · tap a route to view on map</div>` +
    routes.map((r, i) => {
      const h = Math.floor(r.travelTime / 60), m = r.travelTime % 60;
      const timeStr = h > 0 ? `${h}h ${m}m` : `${m} min`;
      const tag = r.transfers === 0 ? 'Direct' : `${r.transfers} transfer`;
      return `<div class="route-option${i === 0 ? ' selected' : ''}" data-idx="${i}">
        <div class="route-title">${tag} · ₱${r.fare} · ${timeStr}</div>
        <div class="route-meta">${r.legs.map(l =>
          `<span style="background:${l.color};color:#fff;padding:1px 5px;border-radius:2px;font-size:10px;">${l.code}</span>`
        ).join(' → ')}</div>
        <div class="route-steps">
          <div class="step"><div class="step-dot"></div><span>Walk ${(r.walkToFirst*1000).toFixed(0)}m → board at <b>${r.legs[0].boardAt}</b></span></div>
          ${r.legs.map((leg, li) => `
            <div class="step"><div class="step-dot" style="background:${leg.color}"></div>
              <span>[${leg.code}] alight at <b>${leg.alightAt}</b> · ${leg.dist.toFixed(1)}km · ₱${calcFare(leg.dist)}</span></div>
            ${li < r.legs.length-1 ? `<div class="step step-transfer"><div class="step-dot"></div><span>Walk ~${((r.xferWalk||0)*1000).toFixed(0)}m to transfer</span></div>` : ''}
          `).join('')}
          <div class="step"><div class="step-dot"></div><span>Walk ${(r.walkFromLast*1000).toFixed(0)}m to destination</span></div>
        </div>
      </div>`;
    }).join('');

  el.querySelectorAll('.route-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.route-option').forEach(e => e.classList.remove('selected'));
      opt.classList.add('selected');
      state.selectedRoute = routes[parseInt(opt.dataset.idx)];
      drawRoute(state.selectedRoute);
    });
  });
  state.selectedRoute = routes[0];
  drawRoute(routes[0]);
}

// ─── AUTOCOMPLETE ─────────────────────────────────────────────────────────
let acTimer = null;
function setupAutocomplete(inputId, suggestId, onSelect) {
  const input = document.getElementById(inputId);
  const sug = document.getElementById(suggestId);
  input.addEventListener('input', () => {
    clearTimeout(acTimer);
    const v = input.value.trim();
    if (v.length < 2) { sug.style.display = 'none'; return; }
    acTimer = setTimeout(async () => {
      const results = await geocode(v);
      if (!results.length) { sug.style.display = 'none'; return; }
      sug.innerHTML = results.slice(0, 6).map((r, i) => `<div data-i="${i}">${r.name}</div>`).join('');
      sug.style.display = 'block';
      sug.querySelectorAll('div').forEach(d => {
        d.addEventListener('click', () => {
          const r = results[parseInt(d.dataset.i)];
          input.value = r.name; sug.style.display = 'none'; onSelect(r);
        });
      });
    }, 300);
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !sug.contains(e.target)) sug.style.display = 'none';
  });
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────
function setStatus(msg) { document.getElementById('status-bar').textContent = msg; }

// ─── PIN MODE ─────────────────────────────────────────────────────────────
function setPinMode(mode) {
  pinMode = mode;
  const hint = document.getElementById('pin-hint');
  document.getElementById('pin-origin-btn').classList.toggle('active', mode === 'origin');
  document.getElementById('pin-dest-btn').classList.toggle('active', mode === 'dest');
  if (mode) {
    hint.textContent = mode === 'origin'
      ? 'Click the map to pin your pick-up location'
      : 'Click the map to pin your destination';
    hint.classList.add('visible');
    map.getContainer().style.cursor = 'crosshair';
  } else {
    hint.classList.remove('visible');
    map.getContainer().style.cursor = '';
  }
}

document.getElementById('pin-origin-btn').addEventListener('click', () => setPinMode(pinMode === 'origin' ? null : 'origin'));
document.getElementById('pin-dest-btn').addEventListener('click', () => setPinMode(pinMode === 'dest' ? null : 'dest'));

// ─── MAP CLICK ────────────────────────────────────────────────────────────
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  let name = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'Jeeply/1.0' } }
    );
    const data = await res.json();
    if (data.display_name) name = data.display_name.split(',').slice(0, 2).join(',').trim();
  } catch {}
  const loc = { name, lat, lng };

  if (pinMode === 'origin') {
    state.origin = loc;
    document.getElementById('origin-input').value = name;
    placeOriginMarker(loc); setStatus(`Origin pinned: ${name}`);
    setPinMode(null); map.setView([lat, lng], 15);
  } else if (pinMode === 'dest') {
    state.dest = loc;
    document.getElementById('dest-input').value = name;
    placeDestMarker(loc); setStatus(`Destination pinned: ${name}`);
    setPinMode(null); map.setView([lat, lng], 15);
  } else {
    if (!state.origin) {
      state.origin = loc;
      document.getElementById('origin-input').value = name;
      placeOriginMarker(loc); setStatus('Origin set. Now pin or type your destination.');
    } else if (!state.dest) {
      state.dest = loc;
      document.getElementById('dest-input').value = name;
      placeDestMarker(loc); setStatus('Destination set. Press "Find Jeepney Routes".');
    }
  }
});

// ─── AUTOCOMPLETE HOOKS ───────────────────────────────────────────────────
setupAutocomplete('origin-input', 'origin-suggestions', (r) => {
  state.origin = r; placeOriginMarker(r); map.setView([r.lat, r.lng], 14);
  setStatus(`Origin: ${r.name}`);
});
setupAutocomplete('dest-input', 'dest-suggestions', (r) => {
  state.dest = r; placeDestMarker(r); map.setView([r.lat, r.lng], 14);
  setStatus(`Destination: ${r.name}`);
});

// ─── SEARCH BUTTON ────────────────────────────────────────────────────────
document.getElementById('go-btn').addEventListener('click', async () => {
  if (!state.origin || !state.dest) { setStatus('Set both origin and destination first.'); return; }
  const btn = document.getElementById('go-btn');
  btn.disabled = true; btn.textContent = 'Searching...';
  setStatus('Finding jeepney routes...');
  document.getElementById('results').innerHTML = '<div class="loading">Searching routes...</div>';
  
  try {
    const routes = findRoutes(state.origin.lat, state.origin.lng, state.dest.lat, state.dest.lng);
    
    if (routes.length > 0) {
      setStatus(`${routes.length} route(s) found`);
      renderResults(routes);
    } else {
      // ─── FALLBACK SUGGESTION LOGIC ──────────────────────────────────────
      setStatus('No direct routes found. Computing nearest ride-hailing spots...');
      
      // Calculate distances from origin to all known landmarks
      const suggestions = LANDMARKS.map(landmark => {
        const distance = haversine(state.origin.lat, state.origin.lng, landmark.lat, landmark.lng);
        return { ...landmark, distance };
      });
      
      // Sort to get the closest spots
      suggestions.sort((a, b) => a.distance - b.distance);
      const topSpots = suggestions.slice(0, 3); // Get top 3 nearest options
      
      // Render fallback view in the results sidebar
      const el = document.getElementById('results');
      el.innerHTML = `
        <div class="no-results">
          <p style="font-weight: bold; margin-bottom: 8px; color: #c00;">No jeepney routes found within walking distance.</p>
          <p style="margin-bottom: 12px; color: #555;">Consider heading to one of these nearby major hubs or landmarks to hail a ride or find alternative transfers:</p>
          
          <div class="fallback-list" style="display: flex; flex-direction: column; gap: 8px;">
            ${topSpots.map((spot, idx) => `
              <div class="fallback-card" data-lat="${spot.lat}" data-lng="${spot.lng}" data-name="${spot.name}" style="border: 1px solid #ccc; padding: 8px; cursor: pointer; background: #fafafa;">
                <div style="font-weight: bold; font-size: 12px;">📍 ${spot.name}</div>
                <div style="font-size: 11px; color: #666; margin-top: 2px;">Distance: ~${spot.distance.toFixed(2)} km away</div>
                <div style="font-size: 10px; color: #cc4400; font-weight: bold; text-decoration: underline; margin-top: 4px;">Click to view location</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Clear previous routes from the map view
      clearMapRoutes();
      
      // Add interactive click actions to the fallback elements
      el.querySelectorAll('.fallback-card').forEach(card => {
        card.addEventListener('click', () => {
          const lat = parseFloat(card.dataset.lat);
          const lng = parseFloat(card.dataset.lng);
          const name = card.dataset.name;
          
          // Move map focus and open a informative temporary popup
          map.setView([lat, lng], 15);
          L.popup()
            .setLatLng([lat, lng])
            .setContent(`<b>Suggested Hail Spot:</b><br>${name}`)
            .openOn(map);
        });
      });
    }
  } catch (e) {
    setStatus('Error: ' + e.message);
    document.getElementById('results').innerHTML = `<div class="error">${e.message}</div>`;
  }
  
  btn.disabled = false; btn.textContent = 'Find Jeepney Routes';
});

// ─── INIT ─────────────────────────────────────────────────────────────────
setStatus('Type a location');
