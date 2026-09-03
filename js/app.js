/* Offline GPS audio guide — core logic.
 * No network calls, no dependencies. Everything runs on-device.
 */
'use strict';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const STORE_KEY = 'audioguide.' + ROUTE.id + '.v1';

const state = {
  started: false,
  reversed: false,
  position: null,        // {lat, lon, accuracy, speed, heading, ts}
  watchId: null,
  played: new Set(),     // stop ids already narrated
  minDist: {},           // stop id -> closest approach seen this session (m)
  approaching: {},       // stop id -> true once we've been within listening range
  queue: [],             // stop ids waiting to be spoken
  speaking: null,        // stop id currently being spoken
  transitioning: false,  // in the gap between one stop ending and the next starting
  skipped: new Set(),    // queued, then dropped because the car outran the queue
  chunks: [],            // remaining sentence chunks for the current stop
  paused: false,
  voiceURI: null,
  rate: 1.0,
  autoplay: true,
  keepAwake: true,
  wakeLock: null,
  sim: null,
  savedAt: 0,
  lastFixAt: 0,
};

/* ---------- persistence ---------- */

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      played: Array.from(state.played),
      reversed: state.reversed,
      voiceURI: state.voiceURI,
      rate: state.rate,
      autoplay: state.autoplay,
      keepAwake: state.keepAwake,
      savedAt: Date.now(),
    }));
  } catch (e) { /* private mode, quota — non-fatal */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (Array.isArray(d.played)) state.played = new Set(d.played);
    if (typeof d.reversed === 'boolean') state.reversed = d.reversed;
    state.savedAt = d.savedAt || 0;
    if (d.voiceURI) state.voiceURI = d.voiceURI;
    if (typeof d.rate === 'number') state.rate = d.rate;
    if (typeof d.autoplay === 'boolean') state.autoplay = d.autoplay;
    if (typeof d.keepAwake === 'boolean') state.keepAwake = d.keepAwake;
  } catch (e) { /* corrupt payload — start fresh */ }
}

/* ---------- geometry ---------- */

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000, toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad, dLon = (lon2 - lon1) * toRad;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function fmtDist(m) {
  if (m == null || !isFinite(m)) return '—';
  if (m < 950) return Math.round(m / 10) * 10 + ' m';
  return (m / 1000).toFixed(m < 10000 ? 1 : 0) + ' km';
}

/* Stops in travel order for the current direction. */
function orderedStops() {
  const s = ROUTE.stops.slice().sort((a, b) => a.km - b.km);
  return state.reversed ? s.reverse() : s;
}

/* ---------- speech ---------- */

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth ? synth.getVoices() : [];
  const sel = $('#voice');
  if (!sel) return;
  const prev = state.voiceURI;
  sel.innerHTML = '';
  const english = voices.filter(v => /^en/i.test(v.lang));
  const list = english.length ? english : voices;
  if (!list.length) {
    sel.innerHTML = '<option value="">System default</option>';
    return;
  }
  // Prefer en-CA, then en-GB, then en-US, then anything English.
  const rank = (v) => /en[-_]CA/i.test(v.lang) ? 0 : /en[-_]GB/i.test(v.lang) ? 1
                    : /en[-_]US/i.test(v.lang) ? 2 : 3;
  list.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  for (const v of list) {
    const o = document.createElement('option');
    o.value = v.voiceURI;
    o.textContent = v.name + ' (' + v.lang + ')';
    sel.appendChild(o);
  }
  if (prev && list.some(v => v.voiceURI === prev)) sel.value = prev;
  else { state.voiceURI = list[0].voiceURI; sel.value = state.voiceURI; }
}

if (synth) {
  synth.addEventListener?.('voiceschanged', loadVoices);
  synth.onvoiceschanged = loadVoices;
}

/* Split narration into speakable chunks. iOS truncates long utterances and
 * gives no error, so we feed it a paragraph at a time. */
function chunkText(text) {
  const out = [];
  for (const para of text.split(/\n\s*\n/)) {
    const sentences = para.trim().match(/[^.!?]+[.!?]*\s*/g) || [para];
    let buf = '';
    for (const s of sentences) {
      if ((buf + s).length > 220 && buf) { out.push(buf.trim()); buf = ''; }
      buf += s;
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out.filter(Boolean);
}

function speakNextChunk() {
  if (!synth || state.paused) return;
  if (!state.chunks.length) { finishSpeaking(); return; }
  const text = state.chunks.shift();
  const u = new SpeechSynthesisUtterance(text);
  const v = voices.find(x => x.voiceURI === state.voiceURI);
  if (v) u.voice = v;
  u.rate = state.rate;
  u.pitch = 1;
  u.volume = 1;
  u.onend = () => { if (!state.paused) setTimeout(speakNextChunk, 60); };
  u.onerror = (e) => {
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    setTimeout(speakNextChunk, 200);
  };
  try { synth.speak(u); } catch (err) { setTimeout(speakNextChunk, 300); }
  highlightSpokenText(text);
}

function playStop(stopId, opts) {
  const stop = ROUTE.stops.find(s => s.id === stopId);
  if (!stop) return;
  stopSpeaking(true);
  state.speaking = stopId;
  state.paused = false;
  state.chunks = chunkText(stop.text);
  state.played.add(stopId);
  state.skipped.delete(stopId);
  save();
  renderNowPlaying(stop);
  renderList();
  render();
  if (!(opts && opts.silent)) speakNextChunk();
}

function finishSpeaking() {
  state.speaking = null;
  state.chunks = [];
  renderNowPlaying(null);
  renderList();
  render();
  if (state.queue.length) {
    const next = state.queue.shift();
    state.transitioning = true;
    setTimeout(() => { state.transitioning = false; playStop(next); }, 900);
  }
}

function stopSpeaking(keepCard) {
  state.chunks = [];
  state.paused = false;
  try { synth && synth.cancel(); } catch (e) { /* nothing playing */ }
  if (!keepCard) { state.speaking = null; renderNowPlaying(null); renderList(); }
}

function togglePause() {
  if (!state.speaking) return;
  if (state.paused) {
    state.paused = false;
    speakNextChunk();
  } else {
    state.paused = true;
    try { synth.cancel(); } catch (e) { /* already idle */ }
  }
  renderControls();
}

/* Safari sometimes drops an utterance without firing onend. If we believe we
 * are speaking but the engine is idle, restart the pending chunk. */
setInterval(() => {
  if (!synth || !state.speaking || state.paused) return;
  if (!synth.speaking && !synth.pending && state.chunks.length) speakNextChunk();
}, 3000);

/* ---------- trigger engine ---------- */

const PASSED_MARGIN = 800;    // m of recession that counts as "we've gone by"
const CATCH_RANGE   = 6000;   // m — how close we must have come to count a pass-by
const MAX_QUEUE     = 3;      // stops that may back up behind the current one
const SIM_LABEL     = '▶ Test drive (does not use up stops)';

/* stop id -> index in travel order, for the current direction. */
function routeRank() {
  const r = {};
  orderedStops().forEach((s, i) => { r[s.id] = i; });
  return r;
}

function onPosition(pos) {
  state.position = {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    speed: pos.coords.speed,
    heading: pos.coords.heading,
    ts: pos.timestamp,
  };
  state.lastFixAt = Date.now();
  evaluateTriggers();
  render();
}

function onPositionError(err) {
  const msgs = {
    1: 'Location permission denied. Enable it in Settings → Privacy → Location Services → Safari.',
    2: 'Location unavailable right now — GPS is still searching.',
    3: 'Location timed out — still trying.',
  };
  setStatus(msgs[err.code] || ('Location error: ' + err.message), err.code === 1 ? 'bad' : 'warn');
}

function evaluateTriggers() {
  if (!state.position) return;
  const { lat, lon } = state.position;
  const fired = [];

  for (const stop of ROUTE.stops) {
    if (state.played.has(stop.id)) continue;
    const d = haversine(lat, lon, stop.lat, stop.lon);
    const prevMin = state.minDist[stop.id];
    if (prevMin == null || d < prevMin) state.minDist[stop.id] = d;
    const min = state.minDist[stop.id];

    // 1. Inside the stop's radius.
    const inside = d <= stop.radius;

    // 2. Closest-approach fallback: we came reasonably near, and are now moving
    //    away again. Covers stops whose coordinate is off the driving line.
    const passedBy = min < CATCH_RANGE && d > min + PASSED_MARGIN && min < stop.radius * 3;

    if (inside || passedBy) fired.push({ stop, d });
  }

  if (!fired.length) return;

  // Narrate in the order you meet things on the road, not by raw distance.
  // Two stops can come into range on the same fix, and the nearer one is not
  // necessarily the one you reach first.
  const rank = routeRank();
  fired.sort((a, b) => rank[a.stop.id] - rank[b.stop.id]);

  for (const { stop } of fired) {
    if (!state.autoplay) { state.played.add(stop.id); continue; }

    // Busy also covers the pause between two stops. Without that, a stop that
    // triggers inside the gap would start immediately and jump the queue.
    const busy = state.speaking || state.transitioning || state.queue.length;
    if (!busy) { playStop(stop.id); continue; }
    if (state.queue.includes(stop.id) || state.speaking === stop.id) continue;

    state.queue.push(stop.id);
    state.queue.sort((x, y) => rank[x] - rank[y]);
    state.played.add(stop.id);   // claimed — don't re-fire while queued

    // If the car outruns the queue, drop the stops furthest behind rather than
    // narrating scenery from twenty minutes ago. They stay in the list, marked
    // as passed, so they can still be played on demand.
    while (state.queue.length > MAX_QUEUE) {
      const dropped = state.queue.shift();
      state.skipped.add(dropped);
    }
    renderList();
  }
  save();
}

/* ---------- geolocation ---------- */

function startWatching() {
  if (!navigator.geolocation) {
    setStatus('This browser has no GPS support.', 'bad');
    return;
  }
  if (state.watchId != null) navigator.geolocation.clearWatch(state.watchId);
  state.watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 30000,
  });
}

/* ---------- keeping the page alive ---------- */

async function requestWakeLock() {
  if (!state.keepAwake) return;
  try {
    if ('wakeLock' in navigator) {
      state.wakeLock = await navigator.wakeLock.request('screen');
      state.wakeLock.addEventListener('release', () => { state.wakeLock = null; });
    }
  } catch (e) { /* denied or unsupported — the on-screen note covers this */ }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (state.started) { requestWakeLock(); startWatching(); }
  }
});

/* A near-silent looping tone. While audio is playing, iOS is far more willing
 * to keep the page running and to hold the car stereo on this audio route. */
function silentLoopURL() {
  const rate = 8000, secs = 2, n = rate * secs;
  const buf = new ArrayBuffer(44 + n * 2);
  const view = new DataView(buf);
  const wr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  wr(0, 'RIFF'); view.setUint32(4, 36 + n * 2, true); wr(8, 'WAVE');
  wr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  wr(36, 'data'); view.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    view.setInt16(44 + i * 2, Math.round(Math.sin(i / rate * 2 * Math.PI * 60) * 12), true);
  }
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

function startKeepAlive() {
  const a = $('#keepalive');
  if (!a.src) a.src = silentLoopURL();
  a.loop = true;
  a.volume = 0.02;
  a.play().catch(() => { /* blocked until a gesture — Start provides one */ });
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: ROUTE.title, artist: 'Offline audio guide', album: ROUTE.subtitle,
    });
  }
}

/* ---------- rendering ---------- */

function setStatus(text, kind) {
  const el = $('#status');
  el.textContent = text;
  el.className = 'status ' + (kind || '');
}

/* Index of the stop we are nearest to — i.e. roughly where we are on the route.
 * Lets the guide behave sensibly if you join the drive part-way along. */
function currentRank() {
  if (!state.position) return 0;
  const ord = orderedStops();
  let best = 0, bd = Infinity;
  ord.forEach((s, i) => {
    const d = haversine(state.position.lat, state.position.lon, s.lat, s.lon);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

function nextStop() {
  const ord = orderedStops();
  const cur = currentRank();
  return ord.find((s, i) => i >= cur && !state.played.has(s.id))
      || ord.find(s => !state.played.has(s.id))
      || null;
}

function render() {
  const p = state.position;
  if (p) {
    const age = Math.round((Date.now() - state.lastFixAt) / 1000);
    const speed = (p.speed != null && p.speed >= 0) ? Math.round(p.speed * 3.6) + ' km/h' : '—';
    $('#fix').textContent = p.lat.toFixed(4) + ', ' + p.lon.toFixed(4);
    $('#acc').textContent = '±' + Math.round(p.accuracy) + ' m';
    $('#spd').textContent = speed;
    if (state.started) {
      setStatus(age > 45 ? 'GPS fix is ' + age + 's old — still listening'
                         : 'Tracking · ' + (ROUTE.stops.length - state.played.size) + ' stops ahead', 'good');
    }
  }
  const ns = nextStop();
  const card = $('#nextcard');
  if (ns && state.position) {
    const d = haversine(state.position.lat, state.position.lon, ns.lat, ns.lon);
    card.hidden = false;
    $('#next-name').textContent = ns.name;
    $('#next-dist').textContent = fmtDist(d) + ' away';
  } else if (ns) {
    card.hidden = false;
    $('#next-name').textContent = ns.name;
    $('#next-dist').textContent = 'waiting for GPS';
  } else {
    card.hidden = false;
    $('#next-name').textContent = 'All stops played';
    $('#next-dist').textContent = 'Tap any stop below to replay it';
  }
  $('#progress').style.width = (100 * state.played.size / ROUTE.stops.length).toFixed(1) + '%';
  $('#progress-label').textContent = state.played.size + ' of ' + ROUTE.stops.length;
}

function renderNowPlaying(stop) {
  const el = $('#now');
  if (!stop) { el.hidden = true; $('#now-body').innerHTML = ''; renderControls(); return; }
  el.hidden = false;
  $('#now-name').textContent = stop.name;
  $('#now-sub').textContent = stop.subtitle || '';
  $('#now-body').innerHTML = chunkText(stop.text)
    .map((c, i) => '<p data-chunk="' + i + '">' + c.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[m])) + '</p>')
    .join('');
  renderControls();
}

function highlightSpokenText(text) {
  const ps = $$('#now-body p');
  ps.forEach(p => p.classList.remove('speaking'));
  const hit = ps.find(p => p.textContent === text);
  if (hit) {
    hit.classList.add('speaking');
    hit.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function renderControls() {
  $('#btn-pause').textContent = state.paused ? '▶︎ Resume' : '❚❚ Pause';
  $('#queue-note').textContent = state.queue.length
    ? state.queue.length + ' more queued' : '';
}

function renderList() {
  const ul = $('#stops');
  ul.innerHTML = '';
  for (const s of orderedStops()) {
    const li = document.createElement('li');
    const passed = state.skipped.has(s.id);
    li.className = 'stop' + (state.played.has(s.id) ? ' done' : '') +
                   (passed ? ' passed' : '') +
                   (state.speaking === s.id ? ' active' : '');
    const d = state.position ? haversine(state.position.lat, state.position.lon, s.lat, s.lon) : null;
    li.innerHTML =
      '<div class="stop-main"><div class="stop-name">' + s.name + '</div>' +
      '<div class="stop-sub">' + (passed ? 'passed — tap to play' : (s.subtitle || '')) + '</div></div>' +
      '<div class="stop-meta"><span class="km">km ' + s.km + '</span>' +
      (d != null ? '<span class="dist">' + fmtDist(d) + '</span>' : '') + '</div>';
    li.addEventListener('click', () => playStop(s.id));
    ul.appendChild(li);
  }
}

/* ---------- simulation (for testing before you leave) ---------- */

function toggleSim() {
  if (state.sim) {
    clearInterval(state.sim.timer);
    // Put the real progress back. Without this, testing the guide the night
    // before would mark every stop played and leave it silent on the drive.
    state.played = state.sim.savedPlayed;
    state.skipped = state.sim.savedSkipped;
    state.minDist = state.sim.savedMin;
    state.queue = [];
    stopSpeaking();
    state.sim = null;
    save();
    render();
    renderList();
    $('#btn-sim').textContent = SIM_LABEL;
    setStatus('Test drive ended — your route progress is unchanged.', 'warn');
    startWatching();
    return;
  }
  if (state.watchId != null) { navigator.geolocation.clearWatch(state.watchId); state.watchId = null; }
  const ord = orderedStops();
  const sim = {
    i: 0, t: 0, timer: null,
    savedPlayed: new Set(state.played),
    savedSkipped: new Set(state.skipped),
    savedMin: state.minDist,
  };
  // Run the test against a clean slate so every stop actually demonstrates.
  state.played = new Set();
  state.skipped = new Set();
  state.minDist = {};
  state.queue = [];
  sim.timer = setInterval(() => {
    const a = ord[sim.i], b = ord[Math.min(sim.i + 1, ord.length - 1)];
    const f = sim.t;
    onPosition({
      coords: {
        latitude: a.lat + (b.lat - a.lat) * f,
        longitude: a.lon + (b.lon - a.lon) * f,
        accuracy: 8, speed: 27, heading: null,
      },
      timestamp: Date.now(),
    });
    sim.t += 0.2;
    if (sim.t > 1) { sim.t = 0; sim.i++; }
    if (sim.i >= ord.length - 1) toggleSim();
  }, 1200);
  state.sim = sim;
  $('#btn-sim').textContent = '■ Stop test';
  setStatus('Test drive running — simulated GPS', 'warn');
}

/* ---------- wiring ---------- */

function start() {
  state.started = true;
  $('#gate').hidden = true;
  $('#main').hidden = false;

  // These two must happen inside the tap that started us, or iOS blocks them.
  if (synth) { try { synth.speak(new SpeechSynthesisUtterance(' ')); } catch (e) {} }
  startKeepAlive();

  requestWakeLock();
  startWatching();
  setStatus('Getting a GPS fix…', 'warn');
  loadVoices();
  render();
  renderList();

  // Play the opening briefing straight away. It doubles as proof that audio is
  // reaching the car speakers, and it works even if you start the guide after
  // already leaving town.
  // Skipped when driving the route backwards — the briefing is written for the
  // Hinton-to-Clearwater direction and would be wrong the other way.
  const intro = ROUTE.stops.find(s => s.intro);
  if (intro && !state.reversed && !state.played.has(intro.id)) {
    setTimeout(() => playStop(intro.id), 700);
  }
}

function init() {
  load();
  loadVoices();

  $('#route-title').textContent = ROUTE.title;
  $('#route-title-2').textContent = ROUTE.title;
  $('#route-sub').textContent = ROUTE.subtitle;

  $('#btn-start').addEventListener('click', start);
  $('#btn-pause').addEventListener('click', togglePause);
  $('#btn-skip').addEventListener('click', () => { stopSpeaking(); finishSpeaking(); });
  $('#btn-replay').addEventListener('click', () => {
    const ord = orderedStops().filter(s => state.played.has(s.id));
    const last = state.speaking || (ord.length ? ord[ord.length - 1].id : null);
    if (last) playStop(last);
  });
  $('#btn-sim').addEventListener('click', toggleSim);
  $('#btn-settings').addEventListener('click', () => { $('#settings').hidden = !$('#settings').hidden; });
  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Mark all stops as unplayed and start the route over?')) return;
    state.played.clear(); state.skipped.clear(); state.minDist = {}; state.queue = [];
    stopSpeaking(); save(); render(); renderList();
  });

  const rate = $('#rate');
  rate.value = state.rate;
  $('#rate-val').textContent = state.rate.toFixed(2) + '×';
  rate.addEventListener('input', () => {
    state.rate = parseFloat(rate.value);
    $('#rate-val').textContent = state.rate.toFixed(2) + '×';
    save();
  });

  $('#voice').addEventListener('change', (e) => { state.voiceURI = e.target.value; save(); });

  const auto = $('#autoplay');
  auto.checked = state.autoplay;
  auto.addEventListener('change', () => { state.autoplay = auto.checked; save(); });

  const awake = $('#keepawake');
  awake.checked = state.keepAwake;
  awake.addEventListener('change', () => {
    state.keepAwake = awake.checked;
    if (state.keepAwake) requestWakeLock();
    else if (state.wakeLock) { state.wakeLock.release(); state.wakeLock = null; }
    save();
  });

  const rev = $('#reversed');
  rev.checked = state.reversed;
  rev.addEventListener('change', () => { state.reversed = rev.checked; save(); render(); renderList(); });

  $('#btn-test-voice').addEventListener('click', () => {
    stopSpeaking();
    const u = new SpeechSynthesisUtterance('Voice check. In about two hours you will cross the Continental Divide at Yellowhead Pass.');
    const v = voices.find(x => x.voiceURI === state.voiceURI);
    if (v) u.voice = v;
    u.rate = state.rate;
    synth.speak(u);
  });

  // Progress from a previous session is usually stale by the next morning.
  // Silently resuming it would mean nothing plays on the actual drive.
  const stale = state.played.size > 0 &&
                (!state.savedAt || Date.now() - state.savedAt > 6 * 3600 * 1000);
  if (state.played.size > 0) {
    const hrs = state.savedAt ? Math.round((Date.now() - state.savedAt) / 3600000) : null;
    $('#resume').hidden = false;
    $('#resume-text').textContent =
      state.played.size + ' of ' + ROUTE.stops.length + ' stops are marked played' +
      (hrs != null ? ' from about ' + (hrs < 1 ? 'an hour' : hrs + ' hours') + ' ago' : '') +
      (stale ? '. Starting a new drive? Clear them, or they will not play again.' : '.');
    $('#resume').className = 'card' + (stale ? ' warnbox' : '');
  }
  $('#btn-clear').addEventListener('click', () => {
    state.played.clear(); state.skipped.clear(); state.minDist = {}; state.queue = [];
    save(); render(); renderList();
    $('#resume').hidden = true;
  });

  renderList();
  render();
  setInterval(render, 5000);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline install still works from cache */ });
  }
}

document.addEventListener('DOMContentLoaded', init);
