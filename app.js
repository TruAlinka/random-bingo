const texts = {
  'ru': {
    mainTitle: "Ввод слов для игры",
    placeholder: "Введите слова, по одному на строке",
    start: "Начать игру",
    gameTitle: "Случайное слово:",
    next: "Следующее слово",
    restart: "Рестарт (те же слова)",
    back: "Назад к меню",
    finish: "Все слова отгаданы! 🎉🎉🎉",
    listTitle: "Ваш список слов:",
    copied: "Скопировано!"
  },
  'en': {
    mainTitle: "Enter words for the game",
    placeholder: "Enter words, one per line",
    start: "Start game",
    gameTitle: "Random word:",
    next: "Next word",
    restart: "Restart (same words)",
    back: "Back to menu",
    finish: "All words done! 🎉🎉🎉",
    listTitle: "Your word list:",
    copied: "Copied!"
  },
  'es': {
    mainTitle: "Introduce las palabras para el juego",
    placeholder: "Introduce palabras, una por línea",
    start: "Comenzar el juego",
    gameTitle: "Palabra aleatoria:",
    next: "Siguiente palabra",
    restart: "Reiniciar (mismas palabras)",
    back: "Volver al menú",
    finish: "¡Todas las palabras usadas! 🎉🎉🎉",
    listTitle: "Tu lista de palabras:",
    copied: "¡Copiado!"
  },
  'de': {
    mainTitle: "Wörter für das Spiel eingeben",
    placeholder: "Wörter eingeben, eins pro Zeile",
    start: "Spiel starten",
    gameTitle: "Zufälliges Wort:",
    next: "Nächstes Wort",
    restart: "Nochmal (gleiche Wörter)",
    back: "Zurück zum Menü",
    finish: "Alle Wörter benutzt! 🎉🎉🎉",
    listTitle: "Deine Wörterliste:",
    copied: "Kopiert!"
  }
};

let allWords = [];
let originalWords = [];
let words = [];
let used = [];
let currentLang = 'ru';
let currentWord = null;
let animating = false;

window.onload = function() {
  document.body.classList.add('theme-blue');
  document.documentElement.style.setProperty('--gameFont', `'Patrick Hand', Arial, sans-serif`);
  // Если открыли страницу с параметром ?w=..., сразу заполним словами
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('w')) {
    const w = urlParams.get('w');
    document.getElementById('wordsInput').value = decodeURIComponent(w);
  }
  updateLangUI();
};

document.getElementById('themeSelect').addEventListener('change', function() {
  document.body.classList.remove(
    'theme-blue', 'theme-dark', 'theme-pink', 'theme-green', 'theme-yellow',
    'theme-orange', 'theme-purple');
  document.body.classList.add('theme-' + this.value);
});

document.getElementById('fontSelect').addEventListener('change', function() {
  document.documentElement.style.setProperty('--gameFont', `'${this.value}', Arial, sans-serif`);
});

function updateLangUI() {
  document.getElementById('title').textContent = texts[currentLang].mainTitle;
  document.getElementById('wordsInput').placeholder = texts[currentLang].placeholder;
  document.getElementById('startBtn').textContent = texts[currentLang].start;
  document.getElementById('gameTitle').textContent = texts[currentLang].gameTitle;
  document.getElementById('nextWordBtn').textContent = texts[currentLang].next;
  document.getElementById('restartGameBtn').textContent = texts[currentLang].restart;
  document.getElementById('backBtn').textContent = texts[currentLang].back;
  document.getElementById('restartBtn').textContent = texts[currentLang].restart;
  document.getElementById('copiedMsg').textContent = texts[currentLang].copied;
}

document.getElementById('langSelect').addEventListener('change', function() {
  currentLang = this.value;
  updateLangUI();
});

document.getElementById('startBtn').onclick = function() {
  allWords = document.getElementById('wordsInput').value.split('\n').map(w => w.trim()).filter(w => w);
  if (allWords.length === 0) return;
  originalWords = allWords.slice();
  words = allWords.slice();
  used = [];
  document.getElementById('main').style.display = 'none';
  document.getElementById('game').style.display = '';
  document.getElementById('nextWordBtn').disabled = false;
  showRandomWord();
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';

function animateSlotsWord(word, callback) {
  const display = document.getElementById('wordDisplay');
  display.innerHTML = '';
  animating = true;
  let finishedSlots = 0;
  let slots = [];
  for (let i = 0; i < word.length; i++) {
    let span = document.createElement('span');
    span.className = 'slot';
    span.textContent = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    display.appendChild(span);
    slots.push(span);
  }
  slots.forEach((slot, i) => {
    let cycles = 8 + Math.floor(Math.random() * 5);
    let counter = 0;
    let interval = setInterval(() => {
      if (counter < cycles) {
        slot.textContent = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        counter++;
      } else {
        clearInterval(interval);
        slot.textContent = word[i];
        finishedSlots++;
        if (finishedSlots === slots.length) {
          animating = false;
          if (callback) callback();
        }
      }
    }, 50);
  });
}

function showRandomWord() {
  const display = document.getElementById('wordDisplay');
  if (words.length === 0) {
    display.innerHTML = `<div class="finish-phrase">${texts[currentLang].finish}</div>`;
    document.getElementById('nextWordBtn').disabled = true;
    return;
  }
  const index = Math.floor(Math.random() * words.length);
  const word = words.splice(index, 1)[0];
  used.push(word);
  currentWord = word;
  document.getElementById('nextWordBtn').disabled = true;
  animateSlotsWord(word, () => {
    document.getElementById('nextWordBtn').disabled = false;
  });
}

// --- Кнопка "Скопировать iframe"
document.getElementById('copyIframeBtn').onclick = function() {
  const wordsRaw = document.getElementById('wordsInput').value
    .split('\n').map(w => w.trim()).filter(w => w);
  if (wordsRaw.length === 0) {
    alert('Введите хотя бы одно слово!');
    return;
  }
  const wParam = encodeURIComponent(wordsRaw.join('\n'));
  const url = `https://trualinka.github.io/bingo-editor/?w=${wParam}`;
  const code = `<iframe src="${url}" width="100%" height="650" style="border:none;border-radius:20px;" allowfullscreen loading="lazy"></iframe>`;
  const result = document.getElementById('iframeResult');
  result.value = code;
  result.style.display = '';
  result.select();
  try { document.execCommand('copy'); } catch(e){}
  result.blur();
  result.style.background = '#d4ffe4';
  result.style.transition = 'background 0.6s';

  // Показать надпись "Скопировано!"
  document.getElementById('copiedMsg').style.display = '';
  setTimeout(()=>{
    document.getElementById('copiedMsg').style.display='none';
    result.style.background='';
  },1200);
};

// --- Кнопка "Открыть этот набор в новом окне"
document.getElementById('openWordsBtn').onclick = function() {
  const wordsRaw = document.getElementById('wordsInput').value
    .split('\n').map(w => w.trim()).filter(w => w);
  if (wordsRaw.length === 0) {
    alert('Введите хотя бы одно слово!');
    return;
  }
  const wParam = encodeURIComponent(wordsRaw.join('\n'));
  const url = `https://trualinka.github.io/bingo-editor/?w=${wParam}`;
  window.open(url, '_blank');
};

document.getElementById('iframeResult').style.display = 'none';

document.getElementById('nextWordBtn').onclick = function() {
  if (animating) return;
  showRandomWord();
};
document.getElementById('restartGameBtn').onclick = function() {
  if (animating) return;
  words = originalWords.slice();
  used = [];
  document.getElementById('nextWordBtn').disabled = false;
  showRandomWord();
};
document.getElementById('backBtn').onclick = function() {
  if (animating) return;
  document.getElementById('game').style.display = 'none';
  document.getElementById('main').style.display = '';
  animating = false;
};
document.getElementById('restartBtn').onclick = function() {
  document.getElementById('game').style.display = 'none';
  document.getElementById('main').style.display = '';
  document.getElementById('wordsInput').value = '';
  document.getElementById('wordDisplay').textContent = '';
  words = [];
  allWords = [];
  originalWords = [];
  used = [];
  currentWord = null;
  updateLangUI();
  animating = false;
};

updateLangUI();
