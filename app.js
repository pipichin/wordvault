/* ================================================================
   WordVault — app.js
   Features: SRS (SM-2), flashcard study, custom words, library
================================================================ */

// ===== STORAGE KEYS =====
const DB_KEY        = 'wordvault_words';
const STATS_KEY     = 'wordvault_stats';
const READ_KEY      = 'wordvault_read_articles';
const BOOKMARKS_KEY = 'wordvault_bookmarks';
const NOTES_KEY     = 'wordvault_notes';

// ===== STATE =====
let appInitialized     = false; // guards sync during cold boot

let words              = [];   // all words
let stats              = {};   // streak / today counts
let readArticles       = new Set(); // ids of articles the user has read
let bookmarkedArticles = new Set(); // ids of bookmarked articles
let articleNotes       = {};        // { [articleId]: noteText }
let studyQueue         = [];   // current session
let currentIdx         = 0;
let isFlipped          = false;
let sessionGood        = 0;    // words rated "good" or "easy" this session
let editingId          = null; // word id being edited
let libFilter          = 'all';
let libSearch          = '';
let currentArticleId   = null;
let articleListFilter  = 'all';

// ===== STORAGE =====
function loadData() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    words = JSON.parse(raw);
    // Merge any new built-in words added in future updates
    const existingIds = new Set(words.map(w => w.id));
    BUILT_IN_WORDS.forEach(bw => {
      if (!existingIds.has(bw.id)) {
        words.push(makeWord(bw, false));
      }
    });
  } else {
    words = BUILT_IN_WORDS.map(bw => makeWord(bw, false));
  }

  const rawStats = localStorage.getItem(STATS_KEY);
  stats = rawStats ? JSON.parse(rawStats) : freshStats();

  const rawRead = localStorage.getItem(READ_KEY);
  readArticles = rawRead ? new Set(JSON.parse(rawRead)) : new Set();

  const rawBookmarks = localStorage.getItem(BOOKMARKS_KEY);
  bookmarkedArticles = rawBookmarks ? new Set(JSON.parse(rawBookmarks)) : new Set();

  const rawNotes = localStorage.getItem(NOTES_KEY);
  articleNotes = rawNotes ? JSON.parse(rawNotes) : {};

  updateStreak();
  saveWords();
  saveStats();
}

function makeWord(src, isUser) {
  return {
    ...src,
    source:       isUser ? 'user' : 'built-in',
    interval:     0,
    easeFactor:   2.5,
    repetitions:  0,
    nextReview:   null,
    lastReviewed: null,
    known:        false
  };
}

function freshStats() {
  return { streak: 0, lastStudied: null, todayCount: 0, todayDate: null };
}

function saveWords() {
  localStorage.setItem(DB_KEY, JSON.stringify(words));
  if (appInitialized) scheduleSyncToCloud();
}
function saveStats()     { localStorage.setItem(STATS_KEY,     JSON.stringify(stats)); }
function saveRead()      { localStorage.setItem(READ_KEY,      JSON.stringify([...readArticles])); }
function saveBookmarks() { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarkedArticles])); }
function saveNotes()     { localStorage.setItem(NOTES_KEY,     JSON.stringify(articleNotes)); }

// ===== FIREBASE SYNC =====
const FB_CONFIG = {
  apiKey:            'AIzaSyAskFfnxMnLkwlT0tzLjJBt3b4o6pgc36Q',
  authDomain:        'learning-app-16b72.firebaseapp.com',
  projectId:         'learning-app-16b72',
  storageBucket:     'learning-app-16b72.firebasestorage.app',
  messagingSenderId: '1060107746595',
  appId:             '1:1060107746595:web:8b7e3ec14d18faa92e6096'
};

let fbAuth = null, fbDb = null, currentUser = null;
let syncTimer = null;

function initFirebase() {
  const fbApp = firebase.initializeApp(FB_CONFIG);
  fbAuth = firebase.auth();
  fbDb   = firebase.firestore();

  // Handle Google redirect result (iOS PWA uses redirect, not popup)
  fbAuth.getRedirectResult().catch(() => {});

  fbAuth.onAuthStateChanged(async user => {
    currentUser = user;
    renderSyncUI(user);
    if (user) await syncFromCloud();
  });
}

function renderSyncUI(user) {
  const area = document.getElementById('syncArea');
  if (!user) {
    area.innerHTML = `<button class="sync-login-btn" id="btnSignIn">☁️ 同步</button>`;
    document.getElementById('btnSignIn').addEventListener('click', signIn);
  } else {
    const avatar = user.photoURL
      ? `<img class="sync-avatar" src="${user.photoURL}" title="${user.email}">`
      : `<span class="sync-avatar-fallback">${(user.email||'?')[0].toUpperCase()}</span>`;
    area.innerHTML = `
      ${avatar}
      <span class="sync-dot" id="syncDot" title="點擊登出">✓</span>
    `;
    document.getElementById('syncDot').addEventListener('click', () => {
      if (confirm('登出雲端同步？\n（單字仍保留在本機）')) fbAuth.signOut();
    });
  }
}

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  fbAuth.signInWithPopup(provider).catch(err => {
    // Popup blocked (e.g. iOS standalone PWA) — fall back to redirect
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment') {
      fbAuth.signInWithRedirect(provider).catch(console.error);
    } else {
      console.error('Sign-in error:', err);
    }
  });
}

function userDoc() {
  return fbDb.collection('users').doc(currentUser.uid);
}

async function syncToCloud() {
  if (!currentUser || !fbDb) return;
  try {
    setSyncDot('⟳');
    await userDoc().set({
      words:     JSON.parse(JSON.stringify(words)),
      stats:     JSON.parse(JSON.stringify(stats)),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    setSyncDot('✓');
  } catch (e) {
    console.error('Cloud upload failed:', e);
    setSyncDot('!');
  }
}

async function syncFromCloud() {
  if (!currentUser || !fbDb) return;
  try {
    setSyncDot('⟳');
    const snap = await userDoc().get();
    if (snap.exists) {
      const data = snap.data();
      mergeCloudWords(data.words || []);
      mergeCloudStats(data.stats || {});
      renderHome();
      if (document.getElementById('libraryView').classList.contains('active')) renderLibrary();
      setSyncDot('✓');
    } else {
      // First sign-in on this account — upload everything
      await syncToCloud();
    }
  } catch (e) {
    console.error('Cloud download failed:', e);
    setSyncDot('!');
  }
}

function mergeCloudWords(cloudWords) {
  const localMap = new Map(words.map(w => [w.id, w]));
  let changed = false;

  for (const cw of cloudWords) {
    if (!localMap.has(cw.id)) {
      words.push(cw);
      changed = true;
    } else {
      const lw = localMap.get(cw.id);
      if ((cw.lastReviewed || 0) > (lw.lastReviewed || 0)) {
        Object.assign(lw, cw);
        changed = true;
      }
    }
  }
  if (changed) localStorage.setItem(DB_KEY, JSON.stringify(words)); // save without re-triggering sync
}

function mergeCloudStats(cs) {
  if ((cs.streak || 0) > (stats.streak || 0)) stats.streak = cs.streak;
  if (cs.todayDate === todayStr() && (cs.todayCount || 0) > (stats.todayCount || 0)) {
    stats.todayCount = cs.todayCount;
    stats.todayDate  = cs.todayDate;
  }
  if (!stats.lastStudied || (cs.lastStudied && cs.lastStudied > stats.lastStudied)) {
    stats.lastStudied = cs.lastStudied;
  }
  saveStats();
}

function scheduleSyncToCloud() {
  if (!currentUser) return;
  clearTimeout(syncTimer);
  setSyncDot('…');
  syncTimer = setTimeout(syncToCloud, 2000);
}

function setSyncDot(s) {
  const el = document.getElementById('syncDot');
  if (el) {
    el.textContent = s;
    el.className = 'sync-dot' + (s === '✓' ? ' ok' : s === '!' ? ' err' : '');
  }
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function updateStreak() {
  const today = todayStr();
  if (stats.lastStudied === today) return;           // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (stats.lastStudied === yesterday) {
    stats.streak = (stats.streak || 0) + 1;
  } else if (stats.lastStudied !== today) {
    // gap of more than 1 day — but don't reset here, only reset if we actually break it
    // We reset streak only if user misses a day they had studied (i.e. lastStudied is old)
    if (stats.lastStudied && stats.lastStudied < yesterday) {
      stats.streak = 0;
    }
  }
}

function markStudiedToday() {
  const today = todayStr();
  if (stats.todayDate !== today) {
    stats.todayDate  = today;
    stats.todayCount = 0;
  }
  stats.todayCount++;
  if (stats.lastStudied !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (stats.lastStudied === yesterday) {
      stats.streak = (stats.streak || 0) + 1;
    } else if (!stats.lastStudied) {
      stats.streak = 1;
    } else if (stats.lastStudied < yesterday) {
      stats.streak = 1; // broke streak, reset to 1 since studying today
    }
    stats.lastStudied = today;
  }
  saveStats();
}

// ===== SRS — Simplified SM-2 =====
function srsUpdate(word, quality) {
  // quality: 1 = hard, 3 = good, 5 = easy
  let { interval, easeFactor, repetitions } = word;
  if (!easeFactor)  easeFactor  = 2.5;
  if (!interval)    interval    = 0;
  if (!repetitions) repetitions = 0;

  if (quality >= 3) {
    if      (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * easeFactor);

    easeFactor = Math.max(1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
    repetitions += 1;
  } else {
    repetitions = 0;
    interval    = 1;
  }

  const nextReview    = Date.now() + interval * 86400000;
  const lastReviewed  = Date.now();
  const known         = repetitions >= 3 && interval >= 7;

  return { interval, easeFactor, repetitions, nextReview, lastReviewed, known };
}

function intervalLabel(interval) {
  if (interval <= 0) return '明天';
  if (interval === 1) return '明天';
  if (interval < 7)  return `${interval} 天後`;
  if (interval < 30) return `${Math.round(interval / 7)} 週後`;
  return `${Math.round(interval / 30)} 個月後`;
}

function previewIntervals(word) {
  return {
    hard: intervalLabel(srsUpdate(word, 1).interval),
    good: intervalLabel(srsUpdate(word, 3).interval),
    easy: intervalLabel(srsUpdate(word, 5).interval),
  };
}

// ===== STUDY QUEUE =====
const MAX_DUE  = 30;
const MAX_NEW  = 15;

function buildQueue(mode = 'mixed') {
  const now = Date.now();
  let queue = [];

  if (mode === 'due') {
    queue = words.filter(w => w.nextReview && w.nextReview <= now);
  } else {
    // Due words first
    const due = words.filter(w => w.nextReview && w.nextReview <= now);
    queue.push(...due.slice(0, MAX_DUE));
    // Fill with new (never studied) words
    if (queue.length < MAX_DUE + MAX_NEW) {
      const newW = words.filter(w => !w.lastReviewed);
      const need = Math.min(MAX_NEW, newW.length);
      queue.push(...newW.slice(0, need));
    }
  }

  // Shuffle
  return queue.sort(() => Math.random() - 0.5);
}

// ===== NAVIGATION =====
const VIEWS = ['home', 'study', 'read', 'add', 'library'];

function showView(name) {
  VIEWS.forEach(v => {
    document.getElementById(v + 'View').classList.toggle('active', v === name);
  });
  document.querySelectorAll('.nav-btn, .drawer-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  closeDrawer();

  if (name === 'home')    renderHome();
  if (name === 'library') renderLibrary();
  if (name === 'read')    renderReadHome();
}

// ===== DRAWER =====
function openDrawer() {
  document.getElementById('sideDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
}
function closeDrawer() {
  document.getElementById('sideDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
}

// ===== HOME =====
function renderHome() {
  const now    = Date.now();
  const today  = todayStr();
  const due    = words.filter(w => w.nextReview && w.nextReview <= now).length;
  const known  = words.filter(w => w.known).length;
  const todayCt = stats.todayDate === today ? (stats.todayCount || 0) : 0;

  document.getElementById('statTotal').textContent = words.length;
  document.getElementById('statDue').textContent   = due;
  document.getElementById('statKnown').textContent = known;
  document.getElementById('statToday').textContent = todayCt;
  const streak = stats.streak || 0;
  document.getElementById('streakCount').textContent = streak;
  document.getElementById('streakCountDrawer').textContent = streak;

  // Greeting
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning! 🌅'
              : h < 18 ? 'Good afternoon! ☀️'
              :           'Good evening! 🌙';
  document.getElementById('greetingText').textContent = greet;

  renderWOD();
}

function renderWOD() {
  // Pick a daily word based on date seed
  const today  = todayStr();
  const seed   = [...today].reduce((a, c) => a + c.charCodeAt(0), 0);
  const w      = words[seed % words.length];
  const el     = document.getElementById('wodCard');
  el.innerHTML = `
    <div class="wod-word">${w.word}</div>
    ${w.phonetic ? `<div class="wod-phonetic">${w.phonetic}</div>` : ''}
    ${w.pos ? `<div class="wod-pos">${w.pos}</div>` : ''}
    <div class="wod-def">${w.definition}</div>
    ${w.example ? `<div class="wod-example">"${w.example}"</div>` : ''}
  `;
}

// ===== STUDY =====
function startStudy(mode = 'mixed') {
  studyQueue  = buildQueue(mode);
  currentIdx  = 0;
  sessionGood = 0;

  if (studyQueue.length === 0) {
    alert('目前沒有待學習的單字！先去新增一些，或等明天的複習到期。');
    return;
  }

  document.getElementById('studyDone').style.display    = 'none';
  document.getElementById('ratingRow').style.display    = 'none';
  document.getElementById('flashcard').style.display    = '';
  document.getElementById('studyProgressFill').style.display = '';

  showView('study');
  showCard();
}

function showCard() {
  if (currentIdx >= studyQueue.length) {
    showComplete();
    return;
  }

  const w        = studyQueue[currentIdx];
  const total    = studyQueue.length;
  const pct      = Math.round((currentIdx / total) * 100);

  document.getElementById('studyProgressFill').style.width = pct + '%';
  document.getElementById('studyProgressText').textContent  = `${currentIdx} / ${total}`;

  // Front
  document.getElementById('cardPos').textContent      = w.pos || '';
  document.getElementById('cardWord').textContent     = w.word;
  document.getElementById('cardPhonetic').textContent = w.phonetic || '';
  // Back
  document.getElementById('cardPosBack').textContent  = w.pos || '';
  document.getElementById('cardWordBack').textContent = w.word;
  document.getElementById('cardDef').textContent      = w.definition;
  document.getElementById('cardExample').textContent  = w.example || '';
  document.getElementById('cardTags').innerHTML       = (w.tags || [])
    .map(t => `<span class="tag">${t}</span>`).join('');

  // Rating intervals preview
  const iv = previewIntervals(w);
  document.getElementById('nextHard').textContent = iv.hard;
  document.getElementById('nextGood').textContent = iv.good;
  document.getElementById('nextEasy').textContent = iv.easy;

  // Reset flip
  isFlipped = false;
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('ratingRow').style.display = 'none';
}

function flipCard() {
  if (isFlipped) return;
  isFlipped = true;
  document.getElementById('flashcard').classList.add('flipped');
  document.getElementById('ratingRow').style.display = 'flex';
}

function rateCard(quality) {
  const w   = studyQueue[currentIdx];
  const idx = words.findIndex(x => x.id === w.id);
  if (idx !== -1) {
    Object.assign(words[idx], srsUpdate(words[idx], quality));
  }
  if (quality >= 3) sessionGood++;
  markStudiedToday();
  saveWords();

  currentIdx++;
  showCard();
}

function showComplete() {
  document.getElementById('flashcard').style.display = 'none';
  document.getElementById('ratingRow').style.display = 'none';
  document.getElementById('studyProgressFill').style.width = '100%';
  document.getElementById('studyProgressText').textContent = `${studyQueue.length} / ${studyQueue.length}`;

  document.getElementById('doneCount').textContent = studyQueue.length;
  document.getElementById('doneKnown').textContent = sessionGood;
  document.getElementById('studyDone').style.display = 'block';
}

// ===== DICTIONARY LOOKUP =====
const POS_MAP = { noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.' };
let lookupTimer = null;

function setupLookup() {
  document.getElementById('fWord').addEventListener('input', function() {
    clearTimeout(lookupTimer);
    const val = this.value.trim();
    hideLookup();
    if (val.length < 2) return;
    showLookupSpinner(true);
    lookupTimer = setTimeout(() => fetchWordInfo(val), 650);
  });
}

async function fetchWordInfo(word) {
  try {
    const res  = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    showLookupSpinner(false);
    if (!res.ok) { showLookupNotFound(); return; }

    const data  = await res.json();
    const entry = data[0];

    // Phonetic
    const phonetic = entry.phonetic ||
      entry.phonetics?.find(p => p.text)?.text || '';

    // First meaning
    const meaning  = entry.meanings?.[0];
    const pos      = meaning?.partOfSpeech || '';
    const def      = meaning?.definitions?.[0]?.definition || '';
    const example  = meaning?.definitions?.[0]?.example || '';

    // Auto-fill IPA if empty
    if (phonetic && !document.getElementById('fPhonetic').value.trim()) {
      document.getElementById('fPhonetic').value = phonetic;
    }
    // Auto-fill part of speech
    if (pos && POS_MAP[pos]) {
      document.getElementById('fPos').value = POS_MAP[pos];
    }
    // Auto-fill example if empty
    if (example && !document.getElementById('fExample').value.trim()) {
      document.getElementById('fExample').value = example;
    }

    // Show English definition as reference
    if (def) {
      document.getElementById('lookupEnDef').textContent = def;
      document.getElementById('lookupPanel').style.display    = '';
      document.getElementById('lookupNotFound').style.display = 'none';
      // Focus the definition field so user can type Chinese meaning
      document.getElementById('fDef').focus();
    }
  } catch (e) {
    showLookupSpinner(false);
    showLookupNotFound();
  }
}

function showLookupSpinner(on) {
  document.getElementById('lookupSpinner').style.display = on ? '' : 'none';
}
function showLookupNotFound() {
  document.getElementById('lookupNotFound').style.display = '';
  document.getElementById('lookupPanel').style.display    = 'none';
}
function hideLookup() {
  showLookupSpinner(false);
  document.getElementById('lookupPanel').style.display    = 'none';
  document.getElementById('lookupNotFound').style.display = 'none';
}

// ===== ADD WORD =====
function submitAddForm() {
  const word = document.getElementById('fWord').value.trim();
  const def  = document.getElementById('fDef').value.trim();
  if (!word || !def) return;

  // Duplicate check
  if (words.some(w => w.word.toLowerCase() === word.toLowerCase())) {
    document.getElementById('dupWarning').style.display = 'block';
    return;
  }

  const tags = document.getElementById('fTags').value
    .split(',').map(t => t.trim()).filter(Boolean);

  const newWord = makeWord({
    id:         'u_' + Date.now(),
    word:       word,
    phonetic:   document.getElementById('fPhonetic').value.trim(),
    pos:        document.getElementById('fPos').value,
    definition: def,
    example:    document.getElementById('fExample').value.trim(),
    difficulty: document.getElementById('fDifficulty').value,
    tags:       tags
  }, true);

  words.push(newWord);
  saveWords();

  // Toast
  document.getElementById('toastWord').textContent = word;
  document.getElementById('addToast').style.display = 'flex';
  document.getElementById('addForm').style.display   = 'none';
}

function clearAddForm() {
  document.getElementById('addForm').reset();
  document.getElementById('dupWarning').style.display = 'none';
  document.getElementById('addToast').style.display   = 'none';
  document.getElementById('addForm').style.display    = '';
  hideLookup();
}

// Duplicate check on input
document.getElementById('fWord').addEventListener('input', function() {
  const val = this.value.trim().toLowerCase();
  const dup = val && words.some(w => w.word.toLowerCase() === val);
  document.getElementById('dupWarning').style.display = dup ? 'block' : 'none';
});

// ===== LIBRARY =====
function renderLibrary() {
  const now    = Date.now();
  const search = libSearch.toLowerCase();

  let filtered = words.filter(w => {
    if (search && !w.word.toLowerCase().includes(search) &&
        !w.definition.toLowerCase().includes(search)) return false;

    if (libFilter === 'due')   return w.nextReview && w.nextReview <= now;
    if (libFilter === 'new')   return !w.lastReviewed;
    if (libFilter === 'known') return w.known;
    if (libFilter === 'user')  return w.source === 'user';
    return true;
  });

  document.getElementById('filteredCount').textContent = `${filtered.length} 個單字`;

  const grid = document.getElementById('wordGrid');
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-2);padding:32px 0;text-align:center;">沒有符合的單字</p>';
    return;
  }

  grid.innerHTML = filtered.map(w => {
    const status = !w.lastReviewed  ? 'new'
                 : w.nextReview && w.nextReview <= now ? 'due'
                 : w.known          ? 'known'
                 :                   'learning';
    return `
      <div class="word-item" data-id="${w.id}">
        <div class="word-item-left">
          <div class="word-item-word">${w.word}${w.phonetic ? ` <small style="font-weight:400;color:var(--text-2)">${w.phonetic}</small>` : ''}</div>
          <div class="word-item-def">${w.definition}</div>
        </div>
        <div class="word-item-right">
          ${w.source === 'user' ? '<span class="source-badge">自訂</span>' : ''}
          <span class="diff-badge diff-${w.difficulty}">${{easy:'初',medium:'中',hard:'進'}[w.difficulty]||''}</span>
          <span class="status-dot status-${status}" title="${{new:'未學',due:'待複習',known:'已掌握',learning:'學習中'}[status]}"></span>
        </div>
      </div>
    `;
  }).join('');

  // Click to edit
  grid.querySelectorAll('.word-item').forEach(el => {
    el.addEventListener('click', () => openEditModal(el.dataset.id));
  });
}

// ===== EDIT MODAL =====
function openEditModal(id) {
  const w = words.find(x => x.id === id);
  if (!w) return;
  editingId = id;

  document.getElementById('eWord').value       = w.word;
  document.getElementById('ePos').value        = w.pos || '';
  document.getElementById('ePhonetic').value   = w.phonetic || '';
  document.getElementById('eDef').value        = w.definition;
  document.getElementById('eExample').value    = w.example || '';
  document.getElementById('eDifficulty').value = w.difficulty || 'medium';
  document.getElementById('eTags').value        = (w.tags || []).join(', ');

  document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  editingId = null;
}

function submitEditForm() {
  if (!editingId) return;
  const idx = words.findIndex(w => w.id === editingId);
  if (idx === -1) return;

  const tags = document.getElementById('eTags').value
    .split(',').map(t => t.trim()).filter(Boolean);

  words[idx] = {
    ...words[idx],
    word:       document.getElementById('eWord').value.trim(),
    pos:        document.getElementById('ePos').value,
    phonetic:   document.getElementById('ePhonetic').value.trim(),
    definition: document.getElementById('eDef').value.trim(),
    example:    document.getElementById('eExample').value.trim(),
    difficulty: document.getElementById('eDifficulty').value,
    tags:       tags
  };

  saveWords();
  closeModal();
  renderLibrary();
}

function deleteWord() {
  if (!editingId) return;
  const w = words.find(x => x.id === editingId);
  if (!w) return;
  if (!confirm(`確定要刪除「${w.word}」嗎？`)) return;
  words = words.filter(x => x.id !== editingId);
  saveWords();
  closeModal();
  renderLibrary();
}

// ===== READ VIEW =====

function todayArticle() {
  const today = todayStr();
  const seed  = [...today].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ARTICLES[seed % ARTICLES.length];
}

function diffLabel(d) {
  return { easy: '初級', medium: '中級', hard: '進階' }[d] || d;
}

function renderReadHome() {
  document.getElementById('readHome').style.display   = '';
  document.getElementById('readDetail').style.display = 'none';

  // Today's article card
  const ta  = todayArticle();
  const isRead = readArticles.has(ta.id);
  document.getElementById('todayArticleCard').innerHTML = `
    <div class="tac-topic">${ta.topic}</div>
    <div class="tac-title">${ta.title}</div>
    <div class="tac-meta">
      <span class="tac-badge">${diffLabel(ta.difficulty)}</span>
      <span class="tac-badge">⏱ ${ta.readingTime} 分鐘</span>
      ${isRead ? '<span class="tac-read-badge">✓ 已讀</span>' : ''}
    </div>
  `;
  document.getElementById('todayArticleCard').onclick = () => openArticle(ta.id);

  // Sync filter button active state
  document.querySelectorAll('.art-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === articleListFilter);
  });

  // Full list (filtered)
  let filtered = ARTICLES;
  if (articleListFilter === 'unread')    filtered = ARTICLES.filter(a => !readArticles.has(a.id));
  if (articleListFilter === 'read')      filtered = ARTICLES.filter(a =>  readArticles.has(a.id));
  if (articleListFilter === 'bookmarked') filtered = ARTICLES.filter(a => bookmarkedArticles.has(a.id));

  const list = document.getElementById('articleList');
  if (filtered.length === 0) {
    list.innerHTML = '<p style="color:var(--text-2);padding:24px 0;text-align:center;">沒有符合的文章</p>';
  } else {
    list.innerHTML = filtered.map(a => {
      const isR = readArticles.has(a.id);
      const isBk = bookmarkedArticles.has(a.id);
      const isToday = a.id === ta.id;
      return `
        <div class="article-item ${isR ? 'is-read' : ''}" data-id="${a.id}">
          <div class="article-item-left">
            <div class="article-item-title">${isToday ? '📖 ' : ''}${a.title}</div>
            <div class="article-item-meta">${a.topic} · ${diffLabel(a.difficulty)} · ${a.readingTime} 分鐘</div>
          </div>
          <div class="article-item-right">
            ${isBk ? '<span class="bk-star">⭐</span>' : ''}
            <span class="read-check">${isR ? '✅' : ''}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  list.querySelectorAll('.article-item').forEach(el => {
    el.addEventListener('click', () => openArticle(parseInt(el.dataset.id)));
  });
}

function openArticle(id) {
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return;
  currentArticleId = id;

  // Mark as read
  readArticles.add(id);
  saveRead();

  document.getElementById('readHome').style.display   = 'none';
  document.getElementById('readDetail').style.display = '';

  document.getElementById('detailTopic').textContent    = a.topic;
  document.getElementById('detailTitle').innerHTML = renderArticleBody(a.title).replace(/<\/?p>/g, '');
  document.getElementById('detailDiff').textContent     = diffLabel(a.difficulty);
  document.getElementById('detailTime').textContent     = `⏱ ${a.readingTime} 分鐘`;

  // Bookmark button
  updateBookmarkButton(id);

  // Source URL
  const srcSection = document.getElementById('articleSourceSection');
  const srcLink    = document.getElementById('articleSourceUrl');
  if (a.sourceUrl) {
    srcLink.href        = a.sourceUrl;
    srcLink.textContent = a.sourceUrl;
    srcSection.style.display = '';
  } else {
    srcSection.style.display = 'none';
  }

  // Notes
  document.getElementById('articleNoteInput').value = articleNotes[id] || '';
  document.getElementById('noteSavedHint').style.display = 'none';

  // Render body with tappable words
  document.getElementById('detailBody').innerHTML = renderArticleBody(a.body);

  // Key words chips
  document.getElementById('detailKeywords').innerHTML = a.keyWords.map(kw => {
    const found = words.find(w => w.word.toLowerCase() === kw.toLowerCase());
    return `<span class="kw-chip ${found ? 'in-vault' : ''}" data-word="${kw}">${kw}</span>`;
  }).join('');

  // Bind word tap events
  document.querySelectorAll('.w-tap').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      showWordPopup(el.dataset.word, el);
    });
  });
  document.querySelectorAll('.kw-chip').forEach(el => {
    el.addEventListener('click', () => showWordPopup(el.dataset.word, el));
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

function renderArticleBody(text) {
  return text.split('\n\n').map(para => {
    const processed = para.replace(/\b([a-zA-Z'']+)\b/g, (match) => {
      const clean    = match.replace(/['']/g, "'");
      const inVault  = words.some(w => w.word.toLowerCase() === clean.toLowerCase());
      return `<span class="w-tap ${inVault ? 'in-vault' : ''}" data-word="${clean}">${match}</span>`;
    });
    return `<p>${processed}</p>`;
  }).join('');
}

// ===== WORD POPUP =====
function showWordPopup(word, _el) {
  const found = words.find(w => w.word.toLowerCase() === word.toLowerCase());
  document.getElementById('wpWord').textContent = word;

  const body = document.getElementById('wpBody');

  if (found) {
    // Already in vault — show stored info + study button
    body.innerHTML = `
      <div class="wp-pos">${found.pos || ''}</div>
      <div class="wp-def">${found.definition}</div>
      ${found.phonetic ? `<div class="wp-phonetic">${found.phonetic}</div>` : ''}
      ${found.example  ? `<div class="wp-example">"${found.example}"</div>` : ''}
      <div class="wp-actions">
        <button class="btn-primary" id="wpStudyNow">加入今日學習</button>
      </div>
    `;
    document.getElementById('wpStudyNow').addEventListener('click', () => {
      closeWordPopup();
      startStudyWithWord(found.id);
    });
  } else {
    // Not in vault — show loading, then fetch from dictionary + translation
    body.innerHTML = `<div class="wp-fetching">⟳ 查詢字典中…</div>`;

    fetchWordInfoForPopup(word).then(info => {
      body.innerHTML = `
        ${info.phonetic ? `<div class="wp-phonetic">${info.phonetic}</div>` : ''}
        ${info.pos      ? `<div class="wp-pos">${info.pos}</div>`           : ''}
        ${info.def      ? `<div class="wp-en-def">${info.def}</div>`        : ''}
        <div class="wp-quick-add">
          <div class="wp-field-label">中文意思</div>
          <input type="text" id="wpDefInput" placeholder="中文意思" value="${(info.zh || '').replace(/"/g, '&quot;')}">
          <div class="wp-field-label">例句（可修改）</div>
          <textarea id="wpExInput" rows="2" placeholder="英文例句">${info.example || ''}</textarea>
          <button class="btn-primary" id="wpQuickAdd">加入 WordVault ✓</button>
        </div>
      `;

      document.getElementById('wpQuickAdd').addEventListener('click', () => {
        const def     = document.getElementById('wpDefInput').value.trim();
        const example = document.getElementById('wpExInput').value.trim();
        if (!def) { document.getElementById('wpDefInput').focus(); return; }
        const newWord = makeWord({
          id:         'u_' + Date.now(),
          word:       word,
          phonetic:   info.phonetic || '',
          pos:        info.pos      || '',
          definition: def,
          example:    example,
          difficulty: 'hard',
          tags:       ['from-article']
        }, true);
        words.push(newWord);
        saveWords();
        closeWordPopup();
        refreshArticleBody();
        showToast(`✅ "${word}" 已加入！`);
      });
    });
  }

  document.getElementById('popupBackdrop').style.display = '';
  document.getElementById('wordPopup').style.display     = '';
}

async function fetchWordInfoForPopup(word) {
  try {
    // Fetch English definition and Chinese translation in parallel
    const [dictRes, zhRes] = await Promise.allSettled([
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`),
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-TW`)
    ]);

    let phonetic = '', pos = '', def = '', example = '', zh = '';

    // Parse English dictionary
    if (dictRes.status === 'fulfilled' && dictRes.value.ok) {
      const data    = await dictRes.value.json();
      const entry   = data[0];
      const meaning = entry.meanings?.[0];
      const defObj  = meaning?.definitions?.[0];
      const posRaw  = meaning?.partOfSpeech || '';
      phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
      pos      = POS_MAP[posRaw] || (posRaw ? posRaw + '.' : '');
      def      = defObj?.definition || '';
      example  = defObj?.example    || '';
    }

    // Parse Chinese translation
    if (zhRes.status === 'fulfilled' && zhRes.value.ok) {
      const zhData = await zhRes.value.json();
      zh = zhData?.responseData?.translatedText || '';
      // Clean up: remove anything that looks like an error or is just the word itself
      if (zh.toLowerCase() === word.toLowerCase() || zh.includes('INVALID')) zh = '';
    }

    return { phonetic, pos, def, example, zh };
  } catch {
    return {};
  }
}

function refreshArticleBody() {
  const bodyEl = document.getElementById('detailBody');
  const a = ARTICLES.find(x => x.id === currentArticleId);
  if (!bodyEl || !a) return;
  bodyEl.innerHTML = renderArticleBody(a.body);
  document.querySelectorAll('.w-tap').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); showWordPopup(el.dataset.word, el); });
  });
  // Also refresh title
  const titleEl = document.getElementById('detailTitle');
  if (titleEl) {
    titleEl.innerHTML = renderArticleBody(a.title).replace(/<\/?p>/g, '');
    titleEl.querySelectorAll('.w-tap').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); showWordPopup(el.dataset.word, el); });
    });
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--purple);color:#fff;padding:10px 22px;border-radius:30px;font-size:0.88rem;font-weight:600;z-index:400;box-shadow:var(--shadow-lg);white-space:nowrap';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function closeWordPopup() {
  document.getElementById('popupBackdrop').style.display = 'none';
  document.getElementById('wordPopup').style.display     = 'none';
  // Restore tap-mode defaults
  document.getElementById('wpWord').style.display      = '';
  document.getElementById('wpWordInput').style.display  = 'none';
  document.getElementById('wpWordInput').value          = '';
  clearTimeout(manualLookupTimer);
}

// ===== MANUAL ADD POPUP =====
let manualLookupTimer = null;

function showManualAddPopup() {
  // Switch header to input mode
  document.getElementById('wpWord').style.display     = 'none';
  document.getElementById('wpWordInput').style.display = '';
  document.getElementById('wpWordInput').value         = '';

  document.getElementById('wpBody').innerHTML =
    '<div class="map-hint">輸入單字會自動查字典；輸入片語請直接填意思</div>';

  document.getElementById('popupBackdrop').style.display = '';
  document.getElementById('wordPopup').style.display     = '';

  setTimeout(() => document.getElementById('wpWordInput').focus(), 120);
}

function handleManualInput() {
  clearTimeout(manualLookupTimer);
  const val  = this.value.trim();
  const body = document.getElementById('wpBody');

  if (!val) {
    body.innerHTML = '<div class="map-hint">輸入單字會自動查字典；輸入片語請直接填意思</div>';
    return;
  }

  // Check duplicate
  if (words.some(w => w.word.toLowerCase() === val.toLowerCase())) {
    body.innerHTML = `<div class="map-dup">⚠️「${val}」已在單字庫中</div>`;
    return;
  }

  const isPhrase = val.includes(' ');
  if (isPhrase) {
    renderManualAddForm(val, { phonetic: '', pos: 'phrase', def: '', example: '', zh: '' });
    return;
  }

  body.innerHTML = '<div class="wp-fetching">⟳ 查詢字典中…</div>';
  manualLookupTimer = setTimeout(async () => {
    const info = await fetchWordInfoForPopup(val);
    renderManualAddForm(val, info);
  }, 600);
}

function renderManualAddForm(word, info) {
  const body = document.getElementById('wpBody');
  body.innerHTML = `
    ${info.phonetic ? `<div class="wp-phonetic">${info.phonetic}</div>` : ''}
    ${info.pos      ? `<div class="wp-pos">${info.pos}</div>`           : ''}
    ${info.def      ? `<div class="wp-en-def">${info.def}</div>`        : ''}
    <div class="wp-quick-add">
      <div class="wp-field-label">中文意思 <span style="color:var(--red)">*</span></div>
      <input type="text" id="mapDefInput" placeholder="中文意思或英文定義" value="${(info.zh || '').replace(/"/g, '&quot;')}">
      <div class="wp-field-label">例句（可略）</div>
      <textarea id="mapExInput" rows="2" placeholder="英文例句">${info.example || ''}</textarea>
      <button class="btn-primary" id="mapAddBtn">加入 WordVault ✓</button>
    </div>
  `;

  document.getElementById('mapAddBtn').addEventListener('click', () => {
    const def     = document.getElementById('mapDefInput').value.trim();
    const example = document.getElementById('mapExInput').value.trim();
    if (!def) { document.getElementById('mapDefInput').focus(); return; }

    const isPhrase = word.includes(' ');
    const newWord = makeWord({
      id:         'u_' + Date.now(),
      word:       word,
      phonetic:   info.phonetic || '',
      pos:        info.pos      || (isPhrase ? 'phrase' : ''),
      definition: def,
      example:    example,
      difficulty: 'hard',
      tags:       ['from-article']
    }, true);

    words.push(newWord);
    saveWords();
    closeWordPopup();
    refreshArticleBody();
    showToast(`✅ "${word}" 已加入！`);
  });
}

// ===== BOOKMARKS =====
function toggleBookmark(id) {
  if (bookmarkedArticles.has(id)) {
    bookmarkedArticles.delete(id);
  } else {
    bookmarkedArticles.add(id);
  }
  saveBookmarks();
  updateBookmarkButton(id);
}

function updateBookmarkButton(id) {
  const btn = document.getElementById('btnBookmark');
  if (!btn) return;
  const on = bookmarkedArticles.has(id);
  btn.textContent = on ? '★' : '☆';
  btn.classList.toggle('bookmarked', on);
}

// ===== NOTES =====
function saveNote(id) {
  const text = document.getElementById('articleNoteInput').value.trim();
  if (text) {
    articleNotes[id] = text;
  } else {
    delete articleNotes[id];
  }
  saveNotes();
  const hint = document.getElementById('noteSavedHint');
  hint.style.display = '';
  setTimeout(() => { hint.style.display = 'none'; }, 2000);
}

// Start a study session with one specific word first
function startStudyWithWord(wordId) {
  const w = words.find(x => x.id === wordId);
  if (!w) { startStudy('mixed'); return; }
  const rest = buildQueue('mixed').filter(x => x.id !== wordId);
  studyQueue  = [w, ...rest].slice(0, 20);
  currentIdx  = 0;
  sessionGood = 0;
  document.getElementById('studyDone').style.display    = 'none';
  document.getElementById('ratingRow').style.display    = 'none';
  document.getElementById('flashcard').style.display    = '';
  showView('study');
  showCard();
}

// ===== EVENT LISTENERS =====
function initEvents() {
  // Nav (top bar + drawer)
  document.querySelectorAll('.nav-btn, .drawer-btn').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Drawer open/close
  document.getElementById('btnHamburger').addEventListener('click', openDrawer);
  document.getElementById('btnDrawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);

  // Home
  document.getElementById('btnStartStudy').addEventListener('click', () => startStudy('mixed'));
  document.getElementById('btnReviewDue').addEventListener('click',  () => startStudy('due'));

  // Study
  document.getElementById('flashcard').addEventListener('click', flipCard);
  document.getElementById('flashcard').addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
  });
  document.getElementById('btnBackFromStudy').addEventListener('click', () => showView('home'));
  document.getElementById('btnDoneHome').addEventListener('click', () => {
    showView('home');
  });

  // Rating buttons
  document.querySelectorAll('.rate-btn').forEach(btn => {
    btn.addEventListener('click', () => rateCard(parseInt(btn.dataset.quality)));
  });

  // Keyboard shortcuts for rating (1/2/3)
  document.addEventListener('keydown', e => {
    const studyActive = document.getElementById('studyView').classList.contains('active');
    if (!studyActive || !isFlipped) return;
    if (e.key === '1') rateCard(1);
    if (e.key === '2') rateCard(3);
    if (e.key === '3') rateCard(5);
  });

  // Add form
  setupLookup();
  document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault();
    submitAddForm();
  });
  document.getElementById('btnClearForm').addEventListener('click', clearAddForm);
  document.getElementById('btnAddAnother').addEventListener('click', clearAddForm);
  document.getElementById('btnGoStudyFromAdd').addEventListener('click', () => {
    clearAddForm();
    startStudy('mixed');
  });

  // Read
  document.getElementById('btnBackFromArticle').addEventListener('click', () => {
    renderReadHome();
    window.scrollTo(0, 0);
  });
  document.getElementById('btnBookmark').addEventListener('click', () => {
    if (currentArticleId !== null) toggleBookmark(currentArticleId);
  });
  document.getElementById('btnAddPhrase').addEventListener('click', showManualAddPopup);
  document.getElementById('wpWordInput').addEventListener('input', handleManualInput);
  document.getElementById('btnSaveNote').addEventListener('click', () => {
    if (currentArticleId !== null) saveNote(currentArticleId);
  });
  document.querySelectorAll('.art-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      articleListFilter = this.dataset.filter;
      renderReadHome();
    });
  });
  document.getElementById('wpClose').addEventListener('click', closeWordPopup);
  document.getElementById('popupBackdrop').addEventListener('click', closeWordPopup);

  // Library search & filter
  document.getElementById('searchInput').addEventListener('input', function() {
    libSearch = this.value;
    renderLibrary();
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      libFilter = this.dataset.filter;
      renderLibrary();
    });
  });

  // Modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('btnCancelEdit').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.getElementById('editForm').addEventListener('submit', e => {
    e.preventDefault();
    submitEditForm();
  });
  document.getElementById('btnDeleteWord').addEventListener('click', deleteWord);
}

// ===== INIT =====
function init() {
  loadData();
  initEvents();
  renderHome();
  appInitialized = true;
  initFirebase();
}

document.addEventListener('DOMContentLoaded', init);

// Register Service Worker for offline / PWA support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
