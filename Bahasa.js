const dict = {
  id: {
    'nav.about': 'Tentang',
    'nav.skills': 'Keahlian',
    'nav.projects': 'Proyek',
    'nav.hobby': 'Hobi',
    'nav.contact': 'Kontak',
    'nav.message': 'Hubungi Saya',
    'hero.major': 'Prodi Informatika',
    'hero.hint': '👆 Tap untuk memperbesar',
    'about.title': 'Tentang Saya',
    'about.text': 'Kalo ditanya gw orang yang gimana? Kalo serius ya serius, kalo becanda? Hayu aja.',
    'skills.title': 'Keahlian',
    'hobby.title': 'Hobi',
    'hobby.read': 'Baca',
    'hobby.type': 'Mengetik',
    'hobby.think': 'Berpikir',
    'contact.title': 'Kontak',
    'projects.title': 'Proyek',
    'form.label': 'Hubungi Saya',
    'form.name': 'Nama',
    'form.email': 'Email',
    'form.messageLabel': 'Pesan',
    'form.messagePh': 'Pesan...',
    'form.send': 'Kirim Pesan 🚀',
    'form.required': '⚠️ Nama dan pesan wajib diisi!',
    'form.sending': '⏳ Mengirim...',
    'form.fail': '❌ Gagal mengirim pesan, coba lagi nanti.',
    'form.ok': '✔ Pesan terkirim, {name}!',
    'ai.title': 'AI Assistant',
    'ai.label': 'Cari menu',
    'ai.placeholder': 'Cari menu... (cth: mau lihat proyek)',
    'ai.send': 'Cari Menu 🔎',
    'ai.hello': 'Halo! Ketik apa yang kamu cari, nanti kutunjukkan menunya.',
    'ai.empty': 'Tulis dulu yang kamu cari ya.',
    'ai.notfound': 'Hmm, belum nemu menu yang cocok. Coba kata seperti "skill", "proyek", "hobi", atau "kontak".',
    'ai.found': 'Kayaknya kamu cari menu {menu}.',
    'ai.open': 'Buka {menu} →',
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.hobby': 'Hobbies',
    'nav.contact': 'Contact',
    'nav.message': 'Message Me',
    'hero.major': 'Informatics Student',
    'hero.hint': '👆 Tap to enlarge',
    'about.title': 'About Me',
    'about.text': "If you ask what kind of person I am: serious when it's time to be serious, and joking around? I'm always up for it.",
    'skills.title': 'Skills',
    'hobby.title': 'Hobbies',
    'hobby.read': 'Reading',
    'hobby.type': 'Typing',
    'hobby.think': 'Thinking',
    'contact.title': 'Contact',
    'projects.title': 'Projects',
    'form.label': 'Message Me',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.messageLabel': 'Message',
    'form.messagePh': 'Message...',
    'form.send': 'Send Message 🚀',
    'form.required': '⚠️ Name and message are required!',
    'form.sending': '⏳ Sending...',
    'form.fail': '❌ Failed to send the message, please try again later.',
    'form.ok': '✔ Message sent, {name}!',
    'ai.title': 'AI Assistant',
    'ai.label': 'Find a menu',
    'ai.placeholder': 'Find a menu... (e.g. show me projects)',
    'ai.send': 'Find Menu 🔎',
    'ai.hello': 'Hi! Type what you are looking for and I will point you to the right menu.',
    'ai.empty': 'Please type what you are looking for first.',
    'ai.notfound': 'Hmm, I could not find a matching menu. Try words like "skills", "projects", "hobby", or "contact".',
    'ai.found': 'It looks like you are looking for the {menu} menu.',
    'ai.open': 'Open {menu} →',
  },
};

let lang = 'id';
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'id' || saved === 'en') lang = saved;
} catch {}

const listeners = [];

export function getLang() {
  return lang;
}

export function t(key, vars = {}) {
  let text = dict[lang][key] ?? dict.id[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll('{' + name + '}', () => value);
  }
  return text;
}

export function onLangChange(fn) {
  listeners.push(fn);
}

function apply() {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  const btn = document.querySelector('#toggleLang');
  if (btn) btn.textContent = lang === 'id' ? 'EN' : 'ID';

  listeners.forEach((fn) => fn(lang));
}

export function setLang(next) {
  if (next !== 'id' && next !== 'en') return; // hanya nilai yang diizinkan
  lang = next;
  try {
    localStorage.setItem('lang', lang);
  } catch {}
  apply();
}

document.querySelector('#toggleLang')?.addEventListener('click', () => {
  setLang(lang === 'id' ? 'en' : 'id');
});

apply();