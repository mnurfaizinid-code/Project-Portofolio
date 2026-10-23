import { showView } from './nav.js';
import { t, onLangChange } from './Bahasa.js';

// true  = menu langsung terbuka otomatis
// false = tampilkan tombol "Buka ..." dulu (lebih nyaman, jawabannya tetap terlihat)
const AUTO_OPEN = false;
const MAX_LEN = 100;

// Daftar menu yang boleh dituju. keywords = kata kunci kuat (bobot 2),
// weak = kata umum (bobot 1). Sudah campur Indonesia + Inggris.
const ROUTES = [
  { id: 'home', nameKey: 'nav.about',
    keywords: ['siapa', 'who', 'profil', 'profile', 'home', 'beranda', 'foto', 'photo', 'diri', 'yourself', 'intro', 'kenalan'],
    weak: ['tentang', 'about'] },
  { id: 'skills', nameKey: 'nav.skills',
    keywords: ['skill', 'keahlian', 'kemampuan', 'ability', 'abilities', 'ahli', 'mikrotik', 'laptop', 'office', 'jaringan', 'network'],
    weak: ['bisa', 'can'] },
  { id: 'hobi', nameKey: 'nav.hobby',
    keywords: ['hobi', 'hobby', 'hobbies', 'pastime', 'senggang'],
    weak: ['suka', 'like', 'minat', 'interest'] },
  { id: 'proyek', nameKey: 'nav.projects',
    keywords: ['proyek', 'project', 'karya', 'portfolio', 'portofolio', 'desain', 'design'],
    weak: ['work', 'kerja'] },
  { id: 'contact', nameKey: 'nav.contact',
    keywords: ['kontak', 'contact', 'instagram', 'ig', 'whatsapp', 'wa', 'sosmed', 'social', 'nomor', 'number', 'telepon', 'phone'],
    weak: [] },
  { id: 'hubungi', nameKey: 'nav.message',
    keywords: ['hubungi', 'pesan', 'message', 'kirim', 'send', 'email', 'surel', 'feedback', 'saran'],
    weak: ['tanya', 'ask', 'kritik'] },
];

const formAI = document.querySelector('#formAI');
const aiInput = document.querySelector('#aiInput');
const aiReply = document.querySelector('#aiReply');

// "Kemampuanmu apa?" -> ['kemampuanmu', 'apa']
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// kata pendek (<4 huruf) harus persis sama, kata panjang boleh berimbuhan
function matches(word, keyword) {
  return word === keyword || (keyword.length >= 4 && word.startsWith(keyword));
}

function countMatches(words, list) {
  return list.filter((k) => words.some((w) => matches(w, k))).length;
}

function findRoute(text) {
  const words = normalize(text.slice(0, MAX_LEN));
  let best = null;
  let bestScore = 0;

  for (const route of ROUTES) {
    const score =
      countMatches(words, route.keywords) * 2 + countMatches(words, route.weak ?? []);
    if (score > bestScore) {
      best = route;
      bestScore = score;
    }
  }
  return best;
}

function showReply(text, route) {
  aiReply.replaceChildren();

  const p = document.createElement('p');
  p.textContent = text; // textContent, bukan innerHTML
  aiReply.appendChild(p);

  if (route) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = t('ai.open', { menu: t(route.nameKey) });
    btn.addEventListener('click', () => showView(route.id));
    aiReply.appendChild(btn);
  }
}

formAI.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = aiInput.value.trim();

  if (text === '') {
    showReply(t('ai.empty'));
    return;
  }

  const route = findRoute(text);
  if (!route) {
    showReply(t('ai.notfound'));
    return;
  }

  if (AUTO_OPEN) {
    showView(route.id);
    return;
  }

  showReply(t('ai.found', { menu: t(route.nameKey) }), route);
  aiInput.value = '';
});

onLangChange(() => showReply(t('ai.hello')));
showReply(t('ai.hello'));