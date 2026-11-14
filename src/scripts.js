let currentSlide = 0; 
const totalSlides = 7;
let currentSubSlide = 1;
const subslides = [ 1, 5, 5, 4, 5, 1, 1, 1];
let audioEnabled = true;
let quizScore = 0;
let answeredQuestions = {};
let quizSubmitted = false;
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
    if (currentSlide > 0 && currentSlide < (totalSlides - 2)){
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
            if (currentSlide > 0 && currentSlide < (totalSlides - 2)){
                changeSwitchTab();
            }
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
    if (currentSlide > 0 && currentSlide < (totalSlides - 2)){
        changeSwitchTab();
    }
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
    body: '<div class="video-container video-container--resumen"> <video class="video-tag" controls preload="none"> <source src="src/assets/video/mod_1/pantalla_4.mp4" type="video/mp4"></video> </div>'
  },
  mod2_info: {
    title: 'Modulo 2: Explorando las Ramas de la Inteligencia Artificial',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"> <video class="video-tag" controls preload="none"> <source src="src/assets/video/mod_2/pantalla_12.mp4" type="video/mp4"></video> </div>'
  },
  mod3_info: {
    title: 'Modulo 3: La Inteligencia Artificial en la vida cotidiana',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"> <video class="video-tag" controls preload="none"> <source src="src/assets/video/mod_3/pantalla_18.mp4" type="video/mp4"></video> </div>'
  },
  mod4_info: {
    title: 'Modulo 4: Sesgos, veracidad y uso responsable de la IA',
    badge: 'Resumen',
    body: '<div class="video-container video-container--resumen"> <video class="video-tag" controls preload="none"> <source src="src/assets/video/mod_4/pantalla_23.mp4" type="video/mp4"></video> </div>'
  },
  mod5_info: {
    title: 'Modulo 5: Evaluación final',
    badge: 'Resumen',
    body: '<p>Esta evaluación final te permitirá poner en práctica los conocimientos obtenidos a lo largo del desarrollo de las temáticas de estudio. Considera los siguientes elementos que te serán útiles para tener una mejor experiencia al resolver el cuestionario:​</p><ul class="card-bullets"><li>No hay un número límite de intentos para resolverlo.</li><li>Debes disponer de 20 minutos para contestarlo.</li><li>Ten presente que la calificación final será la obtenida con mejor puntuación.</li><li>Lee cuidadosamente las preguntas que se te presenta y selecciona la opción correcta.</li></ul>'
  },
  mod1_actividad1: {
    title: '',
    badge: 'Actividad #1: ¿Es IA o No?',
    body: '<span style="font-size: 0.83rem; color: var(--text-muted);"><strong>Instrucción:</strong> Lee cada situación y marca <strong>Verdadero (V)</strong> si consideras que se trata de un sistema de inteligencia artificial o <strong>Falso (F)</strong> si corresponde a un programa basado en reglas fijas.</span><div id="mod1-act1-container"></div>'
  },
  mod1_actividad2: {
    title: '',
    badge: 'Actividad #2: Emparejar',
    body: `<span style="font-size: 0.83rem; color: var(--text-muted);"><strong>Instrucción:</strong> Lee cuidadosamente todas las opciones antes de responder y relaciona conceptos con sus definiciones por medio de tarjetas. Algunos conceptos pueden parecer similares, por lo que es importante identificar las características que los diferencian.</span>
      <div class="cards-grid-2">
        <div class="activity-box">
          <div style="text-align: center;"><span class="activity-badge bagde--azul">Conceptos</span></div><div id="mod1_concepts-container"></div></div>
        <div class="activity-box"><div style="text-align: center;"><span class="activity-badge bagde--azul">Definiciones</span></div><div id="mod1_definitions-container"></div></div>
      </div>
      <div id="mod1_act2_feedback" class="feedback-banner"></div>`
  },
};

function openModal(key) {
  playClick();
  const data = modalData[key];
  if (data) {
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalBadge').innerText = data.badge;
    document.getElementById('modalBody').innerHTML = data.body;
    const infoModal = document.getElementById('infoModal');

    if(key === 'mod1_actividad1') { createQuestionsVF('mod1-act1-container', 'mod1', 'act1'); infoModal.querySelector('.modal-box').style.maxWidth = "850px"; }
    if(key === 'mod1_actividad2') { createGame('mod1', 'act2'); infoModal.querySelector('.modal-box').style.maxWidth = "950px"; }

    infoModal.classList.add('active');
  }
}

function closeModal() {
  document.getElementById('infoModal').classList.remove('active');
  document.querySelector('#infoModal .modal-box').style.maxWidth = "650px";
  createGame('mod3', 'act2');
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

function toggleHint(hintId) {
  playClick();
  const h = document.getElementById(hintId);
  h.classList.toggle('show');
}

// ======== EXAMEN ========

const preguntas = [
    {
        pregunta: "1.	Un estudiante afirma que cualquier programa informático utiliza Inteligencia Artificial.",
        opciones: [
            { letra: "A", texto: "Es correcto, porque toda automatización aprende de los datos.", correcta: false },
            { letra: "B", texto: "Es correcto, porque todo programa procesa información.", correcta: false },
            { letra: "C", texto: "Es incorrecto, porque la IA solo funciona con robots físicos.", correcta: false },
            { letra: "D", texto: "Es incorrecto, porque existen programas que siguen instrucciones fijas sin usar IA.", correcta: true }
        ],
        pista: "Distingue entre ejecutar instrucciones previamente definidas y utilizar técnicas que realizan tareas asociadas con la IA.",
        color: "purple"
    },
    {
        pregunta: "2. Un estudiante quiere utilizar una herramienta de IA para preparar una exposición escolar. ¿Qué acción se considera como irresponsable?",
        opciones: [
            { letra: "A", texto: "Contrastar los datos importantes con fuentes confiables.", correcta: false },
            { letra: "B", texto: "Introducir datos personales sensibles de sus compañeros para personalizar la respuesta.", correcta: true },
            { letra: "C", texto: "Revisar y adaptar el contenido para comprenderlo y expresarlo con sus propias palabras.", correcta: false },
            { letra: "D", texto: "Reconocer el uso de la herramienta cuando las normas académicas lo requieran.", correcta: false }
        ],
        pista: "No comprobar la información y/o no actuar con transparencia en el uso de la herramienta.",
        color: "cyan"
    },
    {
        pregunta: "3.	¿Qué afirmación describe mejor la relación entre Machine Learning y Deep Learning?",
        opciones: [
            { letra: "A", texto: "Machine Learning es una parte de Deep Learning", correcta: false },
            { letra: "B", texto: "Deep Learning es una rama de Machine Learning que utiliza redes neuronales profundas", correcta: true },
            { letra: "C", texto: "Son conceptos sin ninguna relación", correcta: false },
            { letra: "D", texto: "Deep Learning es el nombre de cualquier aplicación informática", correcta: false }
        ],
        pista: "Piensa en cuál de los dos conceptos abarca al otro y en el papel de las redes neuronales.",
        color: "green"
    },
    {
        pregunta: "4. Una herramienta genera una explicación sobre un tema científico y presenta una referencia que el estudiante no logra encontrar. ¿Qué debería hacer primero?",
        opciones: [
            { letra: "A", texto: "Aceptar la referencia porque parece académica.", correcta: false },
            { letra: "B", texto: "Compartir la explicación sin modificaciones.", correcta: false },
            { letra: "C", texto: "Verificar la referencia y contrastar la afirmación con fuentes confiables.", correcta: true },
            { letra: "D", texto: "Suponer que todas las referencias generadas son falsas.", correcta: false }
        ],
        pista: "Diferencia entre confiar en la apariencia de una respuesta y comprobar sus evidencias.",
        color: "purple"
    },
    {
        pregunta: "5. Un modelo de Machine Learning puede aprender patrones a partir de datos y utilizarlos para realizar predicciones sobre ejemplos nuevos.",
        opciones: [
            { letra: "A", texto: "Verdadero.", correcta: true },
            { letra: "B", texto: "Falso.", correcta: false }
        ],
        pista: "Piensa en lo que ocurre después del entrenamiento: el modelo puede aplicar los patrones aprendidos a datos que todavía no había visto, aunque puede equivocarse.",
        color: "cyan"
    },
    {
        pregunta: "6. Una respuesta generada por una herramienta de IA siempre es verdadera porque el sistema procesa grandes cantidades de información.",
        opciones: [
            { letra: "A", texto: "Verdadero.", correcta: false },
            { letra: "B", texto: "Falso.", correcta: true }
        ],
        pista: "Una respuesta convincente no siempre es correcta. Pregúntate si procesar mucha información garantiza que todas las afirmaciones generadas sean verdaderas.",
        color: "green"
    },
    {
        pregunta: "7. Un modelo de Deep Learning procesa fotografías mediante varias capas de una red neuronal para identificar características y reconocer animales. ¿Qué función cumplen principalmente esas capas?",
        opciones: [
            { letra: "A", texto: "Transformar y combinar representaciones de los datos durante el procesamiento.", correcta: true },
            { letra: "B", texto: "Garantizar que las fotografías no contienen errores ni ruido.", correcta: false },
            { letra: "C", texto: "Sustituir por completo la necesidad de datos de entrenamiento.", correcta: false },
            { letra: "D", texto: "Convertir cualquier fotografía en una explicación escrita extensa.", correcta: false }
        ],
        pista: "Imagina que cada capa transforma la información recibida y la prepara para la siguiente. El procesamiento sucesivo permite aprender características útiles para reconocer patrones.",
        color: "purple"
    },
    {
        pregunta: "8. Una aplicación reconoce objetos en fotografías y distingue bicicletas, automóviles y peatones. ¿Qué área de la IA está más directamente relacionada con esta tarea?",
        opciones: [
            { letra: "A", texto: "Procesamiento del lenguaje natural.", correcta: false },
            { letra: "B", texto: "Gestión de bases de datos.", correcta: false },
            { letra: "C", texto: "Síntesis de voz.", correcta: false },
            { letra: "D", texto: "Visión por computador.", correcta: true }
        ],
        pista: "La tarea consiste en interpretar fotografías e identificar elementos visuales. Busca el área de la IA que trabaja directamente con imágenes.",
        color: "cyan"
    },
    {
        pregunta: "9. Un estudiante desea utilizar una IA para comprender un tema difícil antes de un examen. ¿Qué estrategia favorece mejor su aprendizaje?",
        opciones: [
            { letra: "A", texto: "Pedir la respuesta final y memorizarla sin revisarla.", correcta: false },
            { letra: "B", texto: "Solicitar una explicación, pedir ejemplos, resolver ejercicios y contrastar la información.", correcta: true },
            { letra: "C", texto: "Copiar toda la conversación y presentarla como trabajo propio.", correcta: false },
            { letra: "D", texto: "Evitar cualquier otra fuente porque la IA siempre ofrece la explicación más completa.", correcta: false }
        ],
        pista: "El objetivo no es únicamente obtener una respuesta. Piensa en una estrategia que combine comprensión, ejemplos, práctica y comprobación de la información.",
        color: "green"
    },
    {
        pregunta: "10. Una herramienta de IA resume un artículo científico, pero omite una condición importante que cambia el significado de una conclusión. ¿Cuál es la mejor acción del estudiante?",
        opciones: [
            { letra: "A", texto: "Revisar el artículo original y corregir el resumen antes de utilizarlo.", correcta: true },
            { letra: "B", texto: "Utilizar el resumen sin consultar el artículo.", correcta: false },
            { letra: "C", texto: "Suponer que todos los resúmenes automáticos omiten información esencial.", correcta: false },
            { letra: "D", texto: "Eliminar la conclusión porque fue producida por una herramienta de IA.", correcta: false }
        ],
        pista: "Un resumen puede omitir condiciones o matices importantes. Si una conclusión parece incompleta, consulta la fuente original antes de utilizarla.",
        color: "purple"
    }
];

function generarPreguntas() {
  const container = document.getElementById("exam-container");
  container.innerHTML = "";

  const colores = {
      purple: {
          background: "rgba(124, 58, 237, 0.2)",
          color: "#c4b5fd",
          border: "rgba(124, 58, 237, 0.4)"
      },
      cyan: {
          background: "rgba(6, 182, 212, 0.2)",
          color: "#67e8f9",
          border: "rgba(6, 182, 212, 0.4)"
      },
      green: {
          background: "rgba(16, 185, 129, 0.2)",
          color: "#6ee7b7",
          border: "rgba(16, 185, 129, 0.4)"
      }
  };

  preguntas.forEach((pregunta, index) => {
      const numero = index + 1;
      const color = colores[pregunta.color] || colores.purple;

      const activityBox = document.createElement("div");
      activityBox.className = "activity-box";
      activityBox.style.marginBottom = "14px";

      activityBox.innerHTML = `
          <div class="activity-title-bar">
            <span class="activity-badge" style="background: ${color.background}; color: ${color.color}; border-color: ${color.border}; ">
                Pregunta ${numero} de ${preguntas.length}
            </span>
            <button class="gen-btn" style="padding: 4px 10px; font-size: 0.75rem;"onclick="toggleHint('hint${numero}')">💡 Pista</button>
          </div>

          <p style="font-size: 0.88rem;font-weight: 600;color: #fff;margin-bottom: 10px;">
              ${pregunta.pregunta}
          </p>

          ${pregunta.opciones.map(opcion => `
              <button class="quiz-option-btn" onclick="answerQ(${numero}, '${opcion.letra}', ${opcion.correcta}, this)">
                <span class="quiz-opt-letter">${opcion.letra}</span>
                ${opcion.texto}
              </button>
          `).join("")}

          <div id="hint${numero}" class="feedback-banner feedback-hint--pista"> <strong>Pista:</strong> ${pregunta.pista} </div>
          <div id="q${numero}_fb" class="feedback-banner"></div>
      `;

      container.appendChild(activityBox);
  });
}

function answerQ(qNum, letter, isCorrect, btn) {

    // Evitar modificaciones después de enviar
    if (quizSubmitted) return;

    const parentBox = btn.closest('.activity-box');
    const allBtns = parentBox.querySelectorAll('.quiz-option-btn');// Quitar selección anterior

    allBtns.forEach(b => { b.classList.remove('selected', 'correct', 'wrong', 'locked'); });
    btn.classList.add('selected');// Marcar selección actual

    // Guardar respuesta
    answeredQuestions[qNum] = {
        letter: letter,
        isCorrect: isCorrect,
        button: btn
    };

}

function verificarRespuestas() {

    if (quizSubmitted) return;

    quizSubmitted = true;
    quizScore = 0;
    const totalPreguntas = preguntas.length;

    preguntas.forEach((pregunta, index) => {

        const qNum = index + 1;
        const parentBox = document.querySelectorAll('#exam-container .activity-box')[index];
        const allBtns = parentBox.querySelectorAll('#exam-container .quiz-option-btn');
        const fb = document.querySelector(`#exam-container #q${qNum}_fb`);
        const respuesta = answeredQuestions[qNum];

        // Bloquear todas las opciones
        allBtns.forEach(btn => { btn.classList.add('locked'); });

        // Buscar respuesta correcta
        const opcionCorrecta = pregunta.opciones.find(op => op.correcta);

        if (respuesta) {
            if (respuesta.isCorrect) {
                quizScore++;
                respuesta.button.classList.add('correct');
                fb.className = 'feedback-banner show feedback-success';
                fb.innerHTML = `<strong>¡Correcto!</strong>`;
            } else {
                respuesta.button.classList.add('wrong');
                fb.className = 'feedback-banner show feedback-hint';
                fb.innerHTML = `<strong>Incorrecto.</strong>`;

                // Mostrar la respuesta correcta
                allBtns.forEach(btn => {
                    if (btn.querySelector('.quiz-opt-letter').textContent.trim() === opcionCorrecta.letra) {
                        btn.classList.add('correct');
                    }
                });
            }
        } else {
            // Pregunta sin responder
            fb.className = 'feedback-banner show feedback-hint';
            fb.innerHTML = `<strong>Sin responder.</strong>La respuesta correcta era ${opcionCorrecta.letra}.`;

            allBtns.forEach(btn => {
                if (btn.querySelector('.quiz-opt-letter').textContent.trim() === opcionCorrecta.letra) {
                    btn.classList.add('correct');
                }
            });
        }

    });

    // Actualizar puntuación
    document.getElementById('quizScoreBadge').innerText =`Aciertos: ${quizScore} / ${totalPreguntas}`;
    // Ocultar botón de verificar
    document.getElementById('btnVerificar').style.display = 'none';
    // Mostrar resultado final
    mostrarResultadoFinal(quizScore, totalPreguntas);
}

function mostrarResultadoFinal(aciertos, total) {

    const porcentaje = Math.round((aciertos / total) * 100);
    let mensaje = "";

    if (porcentaje === 100) {
        mensaje = "¡Excelente! Has respondido correctamente todas las preguntas.";
    } else if (porcentaje >= 70) {
        mensaje = "¡Muy bien! Tienes un buen dominio del tema.";
    } else if (porcentaje >= 50) {
        mensaje = "Buen esfuerzo. Te recomendamos repasar algunos conceptos.";
    } else {
        mensaje = "Sigue practicando. Puedes reforzar los conceptos y volver a intentarlo.";
    }

    const resultado = document.getElementById('quizFinalResult');
    resultado.innerHTML = `
        <div class="feedback-banner show feedback-success">
            <h3>¡Cuestionario finalizado!</h3>
            <h2>${aciertos} / ${total} respuestas correctas</h2>
            <h3>${porcentaje}%</h3>
            <p>${mensaje}</p>
        </div>
    `;
    resultado.style.display = 'block';
}

/*
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
*/

document.addEventListener("DOMContentLoaded", () => {
  updateSlideUI();
  generarPreguntas();
});
