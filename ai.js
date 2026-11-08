import { showView } from './nav.js';
import { t, getLang, onLangChange } from './Bahasa.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://pfoyzrdvyejsbdwxqygp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmb3l6cmR2eWVqc2Jkd3hxeWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0OTU5NzgsImV4cCI6MjEwMjA3MTk3OH0.szQb-wbImWzX5YhrNxPqjJUFJtu4opm8Wf7yWNmjosM';
const supabase = createClient(supabaseUrl, supabaseKey);

const AUTO_OPEN = false;
const MAX_LEN = 100;

// Daftar menu (lengkap dengan kata slang 'ngontak')
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
    keywords: ['kontak', 'contact', 'ngontak', 'instagram', 'ig', 'whatsapp', 'wa', 'sosmed', 'social', 'nomor', 'number', 'telepon', 'phone'],
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

// Memanggil Supabase Edge Function
async function askSupabaseAI(userQuery) {
  const currentLang = getLang() === 'en' ? 'English' : 'Indonesian';
  
  try {
    const { data, error } = await supabase.functions.invoke('ask-ai', {
      body: { prompt: userQuery, lang: currentLang }
    });

    if (error) throw error;
    return data.text;
  } catch (err) {
    console.error('Supabase AI Function Error:', err);
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

  const loadingText = getLang() === 'en' ? '⏳ Thinking...' : '⏳ Sedang berpikir...';
  showReply(loadingText, null, true);

  const aiAnswer = await askSupabaseAI(text);
  showReply(aiAnswer, null);
  aiInput.value = '';
});

onLangChange(() => showReply(t('ai.hello')));
showReply(t('ai.hello'));