import { showView } from './nav.js';
import { t, getLang, onLangChange } from './Bahasa.js';
import { SYSTEM_PROMPT } from './knowledge.js';

// true  = menu langsung terbuka otomatis
// false = tampilkan tombol "Buka ..." dulu (lebih nyaman, jawabannya tetap terlihat)
const AUTO_OPEN = false;
const MAX_LEN = 100;

// Masukkan Gemini API Key kamu di sini
const GEMINI_API_KEY = "AQ.Ab8RN6L3l-PkWm8X4pZP7wWfTxnktaHGNvGZw8xLRhNngLf67g"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Daftar menu yang boleh dituju. keywords = kata kunci kuat (bobot 2), weak = kata umum (bobot 1)
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

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

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
  // Hanya kembalikan route jika skor mencukupi (minimal 2)
  return bestScore >= 2 ? best : null;
}

function showReply(text, route, isLoading = false) {
  aiReply.replaceChildren();

  const p = document.createElement('p');
  p.textContent = text;
  if (isLoading) p.style.opacity = '0.7';
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

// Fungsi Fetch ke Gemini API
async function askGemini(userQuery) {
  const currentLang = getLang() === 'en' ? 'English' : 'Indonesian';
  
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${SYSTEM_PROMPT}\n\nUser Question (${currentLang}): ${userQuery}` }
        ]
      }
    ]
  };

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Gemini Fetch Error:', err);
    return getLang() === 'en' 
      ? "Sorry, I'm having trouble connecting to my AI brain right now."
      : "Maaf, sepertinya ada kendala koneksi ke otak AI saat ini.";
  }
}

formAI.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = aiInput.value.trim();

  if (text === '') {
    showReply(t('ai.empty'));
    return;
  }

  // 1. Cek apakah pengguna hanya bermaksud navigasi menu
  const route = findRoute(text);
  if (route) {
    if (AUTO_OPEN) {
      showView(route.id);
    } else {
      showReply(t('ai.found', { menu: t(route.nameKey) }), route);
    }
    aiInput.value = '';
    return;
  }

  // 2. Jika bukan navigasi kaku, panggil Gemini AI untuk menjawab pertanyaan
  const loadingText = getLang() === 'en' ? '⏳ Thinking...' : '⏳ Sedang berpikir...';
  showReply(loadingText, null, true);

  const aiAnswer = await askGemini(text);
  showReply(aiAnswer, null);
  aiInput.value = '';
});

onLangChange(() => showReply(t('ai.hello')));
showReply(t('ai.hello'));