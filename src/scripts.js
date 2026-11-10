let currentSlide = 0; 
const totalSlides = 6;
let currentSubSlide = 1;
const subslides = [ 1, 5, 5, 4, 5, 1, 1];
let audioEnabled = true;
let quizScore = 0;
const answeredQuestions = {};
const icon_sound_active = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>';
const icon_sound_inactive = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9.5 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>';
let audioCtx = null;

function playClick() {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

function playSuccess() {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.2);
    });
  } catch(e) {}
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  document.getElementById('audioBtn').innerHTML = audioEnabled ? icon_sound_active : icon_sound_inactive;
}

function updateSlideUI() {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

  if ( currentSlide === 0 ) {
    (document.querySelector('.topbar-right')).classList.add("hidden");
    (document.querySelector('.nav-buttons-group')).classList.add("hidden");
  } else {
    (document.querySelector('.topbar-right')).classList.remove("hidden");
    (document.querySelector('.nav-buttons-group')).classList.remove("hidden");

    document.getElementById('slideIndicator').innerText = `0${currentSlide} / 0${totalSlides}`;
    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    document.getElementById('prevBtn').disabled = ((currentSlide === 1) && (currentSubSlide === 1));
    document.getElementById('nextBtn').disabled = (currentSlide === totalSlides);
  }

  const target = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
  if (target) target.classList.add('active');
  
}

function goToSlide(n) {
  if (n >= 0 && n <= totalSlides) {
    currentSlide = n;
    currentSubSlide = 1;
    playClick();
    updateSlideUI();
    if (currentSlide > 0 && currentSlide < totalSlides){
        changeSwitchTab();
    }
  }
}

function nextSlide() {
    currentSubSlide++;
    if (currentSubSlide > subslides[currentSlide]) { 
        currentSubSlide = 1;
        if(currentSlide < totalSlides){ //Cambio de slide
            currentSlide++;
            playClick();
            updateSlideUI();
        }
    } else { //Cambio de tab
        changeSwitchTab();
    }
}

function prevSlide() {
    currentSubSlide--;
    if (currentSubSlide < 1) { 
        if (currentSlide > 1) { //Cambio de slide
            currentSlide--;
            currentSubSlide = subslides[currentSlide];
            playClick();
            updateSlideUI();
        }
    }
    changeSwitchTab();//Cambio de tab
    
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
  }
});

function changeSwitchTab() {
    let idTab = `m${currentSlide}_t${currentSubSlide}`;
    let tabElement = document.querySelector(`#btn_${idTab}`);
    switchTab(tabElement, idTab);
}

function switchTab(btn, paneId) {
  playClick();
  const parentSlide = btn.closest('.slide');
  parentSlide.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parentSlide.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  
  const pane = parentSlide.querySelector(`#${paneId}`);
  if (pane) pane.classList.add('active');

  const [array_slide, array_tab] = paneId.match(/\d+/g).map(Number);
  currentSlide = array_slide;
  currentSubSlide = array_tab;
  document.getElementById('prevBtn').disabled = ((currentSlide === 1) && (currentSubSlide === 1));

}

function openDrawer() {
  playClick();
  document.getElementById('drawerOverlay').classList.add('open');
}

function closeDrawer(e) {
  if (!e || e.target === document.getElementById('drawerOverlay') || e.target.classList.contains('drawer-close')) {
    document.getElementById('drawerOverlay').classList.remove('open');
  }
}

const modalData = {
  mod1_info: {
    title: 'Modulo 1: Introduccion a la Inteligencia Artificial',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"><iframe src="https://www.youtube.com/embed/92XVwY54h5k?si=nzOCo1UOihr0hwgV" title="YouTube video player" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
  },
  mod2_info: {
    title: 'Modulo 2: Explorando las Ramas de la Inteligencia Artificial',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"><iframe src="https://www.youtube.com/embed/92XVwY54h5k?si=nzOCo1UOihr0hwgV" title="YouTube video player" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
  },
  mod3_info: {
    title: 'Modulo 3: La Inteligencia Artificial en la vida cotidiana',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"><iframe src="https://www.youtube.com/embed/92XVwY54h5k?si=nzOCo1UOihr0hwgV" title="YouTube video player" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
  },
  mod4_info: {
    title: 'Modulo 4: Sesgos, veracidad y uso responsable de la IA',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"><iframe src="https://www.youtube.com/embed/92XVwY54h5k?si=nzOCo1UOihr0hwgV" title="YouTube video player" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
  },
  mod5_info: {
    title: 'Modulo 5: Evaluación final',
    badge: 'Resumen',
    body: '<p>Esta evaluación final te permitirá poner en práctica los conocimientos obtenidos a lo largo del desarrollo de las temáticas de estudio. Considera los siguientes elementos que te serán útiles para tener una mejor experiencia al resolver el cuestionario:​</p><ul class="card-bullets"><li>No hay un número límite de intentos para resolverlo.</li><li>Debes disponer de 20 minutos para contestarlo.</li><li>Ten presente que la calificación final será la obtenida con mejor puntuación.</li><li>Lee cuidadosamente las preguntas que se te presenta y selecciona la opción correcta.</li></ul>'
  },
};

function openModal(key) {
  playClick();
  const data = modalData[key];
  if (data) {
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalBadge').innerText = data.badge;
    document.getElementById('modalBody').innerHTML = data.body;
    document.getElementById('infoModal').classList.add('active');
  }
}

function closeModal() {
  document.getElementById('infoModal').classList.remove('active');
}

function toggleFullscreen() {
  playClick();
  const stage = document.getElementById('geniallyStage');
  if (!document.fullscreenElement) {
    stage.requestFullscreen().catch(err => {});
  } else {
    document.exitFullscreen().catch(err => {});
  }
}

function checkAct1(btn, isAI) {
  const fb = document.getElementById('act1_feedback');
  fb.classList.add('show');
  if (isAI) {
    playSuccess();
    fb.className = 'feedback-banner show feedback-success';
    fb.innerHTML = '<strong>Â¡Correcto!</strong> Un filtro antispam que aprende de tus interacciones y adapta sus patrones de clasificacion es un ejemplo claro de Inteligencia Artificial (Machine Learning).';
  } else {
    playClick();
    fb.className = 'feedback-banner show feedback-hint';
    fb.innerHTML = '<strong>PiÃ©nsalo de nuevo:</strong> Si el sistema aprende y se adapta conforme marcas correos nuevos, no estÃ¡ siguiendo instrucciones fijas estÃ¡ticas.';
  }
}

function checkAct2(btn, choice) {
  const fb = document.getElementById('act2_feedback');
  fb.classList.add('show');
  if (choice === 'dl') {
    playSuccess();
    fb.className = 'feedback-banner show feedback-success';
    fb.innerHTML = '<strong>Â¡Excelente!</strong> El uso de redes neuronales profundas de mÃºltiples capas para analizar imÃ¡genes complejas pixel a pixel corresponde exactamente a <strong>Deep Learning</strong>.';
  } else {
    playClick();
    fb.className = 'feedback-banner show feedback-hint';
    fb.innerHTML = '<strong>Casi:</strong> Aunque estÃ¡ dentro de la IA y el Machine Learning, el uso explÃ­cito de redes neuronales de mÃºltiples capas lo clasifica en <strong>Deep Learning</strong>.';
  }
}

function checkAct3(btn, isCorrect) {
  const fb = document.getElementById('act3_feedback');
  fb.classList.add('show');
  if (isCorrect) {
    playSuccess();
    fb.className = 'feedback-banner show feedback-success';
    fb.innerHTML = '<strong>Â¡Uso Correcto y Responsable!</strong> La IA funciona Ã³ptimamente como sintetizador y estructurador preliminar, permitiÃ©ndote comprobar las ideas principales sin suplantar tu comprension crÃ­tica.';
  } else {
    playClick();
    fb.className = 'feedback-banner show feedback-hint';
    fb.innerHTML = '<strong>Atencion:</strong> Delegar la tarea completa sin leer ni comprobar genera falta de comprension y riesgo de incorporar alucinaciones.';
  }
}

function checkAct4(btn, isCorrect) {
  const fb = document.getElementById('act4_feedback');
  fb.classList.add('show');
  if (isCorrect) {
    playSuccess();
    fb.className = 'feedback-banner show feedback-success';
    fb.innerHTML = '<strong>Â¡Exacto!</strong> Nunca se debe aceptar una cita atribuida a un autor sin contrastarla con documentos y fuentes fidedignas.';
  } else {
    playClick();
    fb.className = 'feedback-banner show feedback-hint';
    fb.innerHTML = '<strong>Cuidado:</strong> Los modelos de lenguaje producen texto elocuente y bien redactado, pero pueden atribuir citas inexistentes con total seguridad formal.';
  }
}

function toggleHint(hintId) {
  playClick();
  const h = document.getElementById(hintId);
  h.classList.toggle('show');
}

const qFeedbacks = {
  1: {
    text: 'Respuesta correcta: <strong>B</strong>. Muchos programas ejecutan reglas explÃ­citas y operaciones predefinidas sin emplear tÃ©cnicas de IA.'
  },
  2: {
    text: 'Respuesta correcta: <strong>B</strong>. El aprendizaje profundo utiliza redes neuronales con mÃºltiples capas para aprender representaciones a partir de datos.'
  },
  3: {
    text: 'Respuesta correcta: <strong>C</strong>. Comprobar la existencia de la fuente y contrastar la informacion permite evaluar su veracidad. La apariencia formal no garantiza autenticidad.'
  }
};

function answerQ(qNum, letter, isCorrect, btn) {
  const parentBox = btn.closest('.activity-box');
  const allBtns = parentBox.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.classList.add('locked'));

  const fb = document.getElementById(`q${qNum}_fb`);
  fb.classList.add('show');

  if (isCorrect) {
    btn.classList.add('correct');
    playSuccess();
    fb.className = 'feedback-banner show feedback-success';
    fb.innerHTML = `<strong>Â¡Correcto!</strong> ${qFeedbacks[qNum].text}`;
    if (!answeredQuestions[qNum]) {
      quizScore++;
      answeredQuestions[qNum] = true;
    }
  } else {
    btn.classList.add('wrong');
    playClick();
    allBtns.forEach(b => {
      if (b.innerText.startsWith('B') && (qNum === 1 || qNum === 2)) b.classList.add('correct');
      if (b.innerText.startsWith('C') && qNum === 3) b.classList.add('correct');
    });
    fb.className = 'feedback-banner show feedback-hint';
    fb.innerHTML = `<strong>Incorrecto.</strong> ${qFeedbacks[qNum].text}`;
    answeredQuestions[qNum] = true;
  }

  document.getElementById('quizScoreBadge').innerText = `Aciertos: ${quizScore} / 3`;
}

updateSlideUI();