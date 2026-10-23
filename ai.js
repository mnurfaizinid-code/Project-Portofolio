const formAI = document.querySelector('#formAI');
const aiInput = document.querySelector('#aiInput');
const aiMsg = document.querySelector('#aiMsg');

let classifier = null;

function showAiMsg(text, type) {
  aiMsg.textContent = text;
  aiMsg.className = 'form-msg ' + type;
}

async function loadModel() {
  if (classifier) return classifier; 

  const { pipeline } = await import(
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1'
  );

  classifier = await pipeline(
    'sentiment-analysis',
    'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    {
      dtype: 'q8', 
      progress_callback: (p) => {
        if (p.status === 'progress') {
          showAiMsg('⏳ Mengunduh model... ' + Math.round(p.progress) + '%', 'loading');
        }
      },
    }
  );
  return classifier;
}

formAI.addEventListener('submit', async (e) => {
  e.preventDefault();
  const teks = aiInput.value.trim();

  if (teks === '') {
    showAiMsg('⚠️ Tulis kalimat dulu!', 'error');
    return;
  }

  try {
    const model = await loadModel();
    showAiMsg('🤔 Menganalisis...', 'loading');

    const [hasil] = await model(teks);
    const persen = Math.round(hasil.score * 100);
    const label = hasil.label === 'POSITIVE' ? 'Positif 😊' : 'Negatif 😞';

    showAiMsg(label + ' (yakin ' + persen + '%)', 'success');
  } catch (err) {
    console.error(err);
    showAiMsg('❌ Model gagal dimuat, coba lagi nanti.', 'error');
  }
});