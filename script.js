import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { t, onLangChange } from './Bahasa.js'

const btn = document.querySelector("#toggleTheme");

btn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");
    btn.textContent = isLight ? "☀️" : "🌙";
});

const skills = ["Laptop Troubleshooting", "Mikrotik", "MS Office"];
const skillContainer = document.querySelector("#skill-container");

skills.forEach((skill) => {
    const badge = document.createElement("span");
    badge.className = "skill-badge";
    badge.textContent = skill;
    skillContainer.appendChild(badge);
});

const hobiKeys = ["hobby.read", "hobby.type", "hobby.think"];
const hobiContainer = document.querySelector("#hobi-container");

function renderHobi() {
    hobiContainer.replaceChildren();
    hobiKeys.forEach((key) => {
        const badge = document.createElement("span");
        badge.className = "skill-badge";
        badge.textContent = t(key);
        hobiContainer.appendChild(badge);
    });
}

renderHobi();
onLangChange(renderHobi);

const form = document.querySelector("#formKontak");
const namaInput = document.querySelector("#namaInput");
const emailInput = document.querySelector("#emailInput");
const pesanInput = document.querySelector("#pesanInput");
const formMsg = document.querySelector("#formMsg");

function showFormMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className = 'form-msg ' + type;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = namaInput.value.trim();
  const email = emailInput.value.trim();
  const pesan = pesanInput.value.trim();

  if (nama === '' || pesan === '') {
    showFormMsg(t('form.required'), 'error');
    return;
  }

  showFormMsg(t('form.sending'), 'loading');

  const { error } = await supabase
    .from('pesan')
    .insert([{ nama: nama, email: email, pesan: pesan }]);

  if (error) {
    showFormMsg(t('form.fail'), 'error');
    console.error(error);
  } else {
    showFormMsg(t('form.ok', { name: nama }), 'success');
    form.reset();
  }
});

const supabaseUrl = 'https://pfoyzrdvyejsbdwxqygp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmb3l6cmR2eWVqc2Jkd3hxeWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0OTU5NzgsImV4cCI6MjEwMjA3MTk3OH0.szQb-wbImWzX5YhrNxPqjJUFJtu4opm8Wf7yWNmjosM'

const supabase = createClient(supabaseUrl, supabaseKey)

const { data: proyek, error } = await supabase
  .from('proyek')
  .select('*')
  .order('created_at', { ascending: false })

if (error) {
  console.error('Gagal mengambil data:', error.message)
} else {
  console.log(proyek)
}

function isSafeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

const container = document.querySelector('#proyek-container');

(proyek ?? []).forEach((item) => {
  if (!isSafeUrl(item.gambar_url)) return;

  const isGambar = /\.(png|jpe?g|gif|webp|svg)$/i.test(item.gambar_url);
  const card = document.createElement(isGambar ? 'div' : 'a');
  card.className = isGambar ? 'project-card' : 'project-card project-card--text';

  if (isGambar) {
    const img = document.createElement('img');
    img.src = item.gambar_url;
    img.alt = item.judul;
    img.className = 'project-image';
    card.appendChild(img);
  } else {
    card.href = item.gambar_url;
    card.target = '_blank';
    card.rel = 'noreferrer noopener';
  }

  const h3 = document.createElement('h3');
  h3.textContent = item.judul;
  const p = document.createElement('p');
  p.textContent = item.deskripsi;
  card.append(h3, p);

  container.appendChild(card);
});

const submenuBtn = document.querySelector("#toggleSubmenu");
const submenu = document.querySelector("#subMenu");

submenuBtn.addEventListener("click", () => {
    submenu.classList.toggle("open");
    submenuBtn.classList.toggle("open");
});

const modal = document.querySelector("#modal");
const openModalBtn = document.querySelector("#openModal");

openModalBtn.addEventListener("click", () => {
    modal.classList.add("open");
});

modal.addEventListener("click", () => {
    modal.classList.remove("open");
});