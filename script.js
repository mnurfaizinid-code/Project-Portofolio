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

const hobi = ["Baca", "Mengetik", "Berpikir"];
const hobiContainer = document.querySelector("#hobi-container");

hobi.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "skill-badge";
    badge.textContent = item;
    hobiContainer.appendChild(badge);
});

const form = document.querySelector("#formKontak");
const namaInput = document.querySelector("#namaInput");

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nama = document.querySelector('#namaInput').value.trim(); 

  if (nama === '') {
    alert('Nama wajib diisi!');
    return;
  }

  const { error } = await supabase
    .from('pesan') 
    .insert([{ nama: nama }]);

  if (error) {
    alert('Gagal mengirim pesan: ' + error.message); 
    console.error("Detail Error:", error);
  } else {
    alert('Pesan terkirim, ' + nama + '!');
    document.querySelector('#namaInput').value = ''; 
  }
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

const container =
  document.querySelector('#proyek-container')

proyek.forEach((item) => {
  const card = document.createElement('div')
  card.className = 'project-card'
  card.innerHTML = `
    <h3>${item.judul}</h3>
    <p>${item.deskripsi}</p>
  `
  container.appendChild(card)
})


