// =========== Inicio: Preguntas Verdadero/Falso ===========
const questionsVF = {
    "mod1" : [
        {
            question: "Una plataforma de streaming recomienda películas según los gustos y hábitos de visualización de cada usuario.",
            options: ["Verdadero", "Falso"],
            values: [true, false],
            answer: true,
        },
        {
            question: "Una calculadora realiza operaciones matemáticas siguiendo fórmulas predefinidas.",
            options: ["Verdadero", "Falso"],
            values: [true, false],
            answer: false,
        },
        {
            question: "Un asistente virtual reconoce comandos de voz y responde preguntas en lenguaje natural.",
            options: ["Verdadero", "Falso"],
            values: [true, false],
            answer: true,
        },
        {
            question: "Una herramienta que genera textos originales a partir de las instrucciones del usuario.",
            options: ["Verdadero", "Falso"],
            values: [true, false],
            answer: true,
        },
        {
            question: "Un semáforo cambia de color siguiendo una secuencia.",
            options: ["Verdadero", "Falso"],
            values: [true, false],
            answer: false,
        },
    ],
    "mod2" : [
        {
            question: "Un sistema experto médico utiliza reglas predefinidas para sugerir diagnósticos.",
            options: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"],
            values: [true, false, false],
            answer: true,
        },
        {
            question: "Una plataforma de streaming recomienda películas según los hábitos de visualización del usuario.",
            options: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"],
            values: [false, true, false],
            answer: true,
        },
        {
          question: "Un vehículo autónomo reconoce señales de tránsito mediante cámaras y redes neuronales profundas.",
          options: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"],
          values: [false, false, true],
          answer: true,
        },
        {
          question: "Un chatbot responde preguntas frecuentes siguiendo un conjunto de reglas programadas.",
          options: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"],
          values: [true, false, false],
          answer: true,
        },
        {
          question: "Una aplicación identifica rostros en fotografías utilizando redes neuronales convolucionales.",
          options: ["Inteligencia Artificial", "Machine Learning", "Deep Learning"],
          values: [false, false, true],
          answer: true,
        },
    ],
    "mod4" : [
        {
            question: "Una IA genera el título de un artículo científico y el nombre de su autor. Por tanto, el artículo existe y puede citarse en un trabajo académico.",
            options: ["Rojo", "Amarillo", "Verde"],
            values: [true, false, false],
            answer: true,
        },
        {
            question: "Una plataforma de recomendaciones muestra repetidamente contenidos similares a los que una persona ya ha visto. Esto puede limitar la perspectiva que recibe.",
            options: ["Rojo", "Amarillo", "Verde"],
            values: [false, false, true],
            answer: true,
        },
        {
            question: "Una IA afirma que un medicamento ayuda con cierto malestar. La respuesta incluye un enlace, pero todavía no se ha comprobado si conduce a una fuente oficial.",
            options: ["Rojo", "Amarillo", "Verde"],
            values: [false, true, false],
            answer: true,
        },
        {
            question: "Si dos páginas web repiten una afirmación generada por IA, queda demostrado que la afirmación es verdadera. ",
            options: ["Rojo", "Amarillo", "Verde"],
            values: [true, false, false],
            answer: true,
        },
        {
            question: "Antes de adjuntar una hoja de cálculo con nombres y calificaciones de estudiantes en una IA, conviene revisar la autorización de esos datos y las condiciones de privacidad.",
            options: ["Rojo", "Amarillo", "Verde"],
            values: [false, false, true],
            answer: true,
        },
    ]

};

// Función que genera dinámicamente las preguntas
function createQuestionsVF(elementContainer, mod, act) {
    const container = document.getElementById(elementContainer);
    container.innerHTML = "";
    const startQuestion = (mod === "mod2") ? "Situación" : "Enunciado";
    
    questionsVF[mod].forEach((item, index) => {
      let buttonsHTML = "";
      (item.options).forEach((textOption, indexOption) => {
        buttonsHTML += `<button class="gen-btn gen-btn--${textOption.toLowerCase()}" onclick="checkAnswer('${mod}', '${act}', ${index}, ${item.values[indexOption]})">${textOption}</button>`;
      });

      const questionHTML = `
      <div class="activity-box">
        <p class="activity-enunciate"><strong>${startQuestion} ${index + 1}:</strong> ${item.question}</p>
        <div class="activity-options-row"> ${buttonsHTML} </div>
        <div id="${mod}_${act}_question${index}_feedback" class="feedback-banner"></div>
      </div>`;
      container.insertAdjacentHTML("beforeend", questionHTML);
    });

}

// Función para validar cada respuesta
function checkAnswer(mod, act, index, selectedAnswer) {
  const question = questionsVF[mod][index];
  const fb = document.getElementById(`${mod}_${act}_question${index}_feedback`);
  fb.classList.add("show");

  if (!question.feedback) { question.feedback = "Respuesta acertada."; }
  if (selectedAnswer === question.answer) {
    playSuccess();
    fb.className = "feedback-banner show feedback-success";
    fb.innerHTML = `<strong>¡Correcto!</strong> ${question.feedback}`;
  } else {
    playClick();
    fb.className = "feedback-banner show feedback-hint";
    fb.innerHTML = `<strong>¡Ups!</strong> Piénsalo de nuevo.`;
  }

}

// Crear las preguntas al cargar la página
document.addEventListener("DOMContentLoaded", createQuestionsVF('mod2-act1-container', 'mod2', 'act1'));
document.addEventListener("DOMContentLoaded", createQuestionsVF('mod4-act1-container', 'mod4', 'act1'));
// =========== Fin: Preguntas Verdadero/Falso ===========

// =========== Inicio: Juego de emparejar ===========
const matchingData = {
    "mod1": [
        {
          id: 1,
          concept: "Inteligencia Artificial",
          definition: "Tecnología capaz de simular habilidades humanas como aprender, razonar, resolver problemas y comprender lenguaje."
        },
        {
          id: 2,
          concept: "Machine Learning",
          definition: "Tipo de inteligencia artificial que aprende patrones a partir de datos para realizar tareas o tomar decisiones."
        },
        {
          id: 3,
          concept: "Inteligencia artificial generativa",
          definition: "Tipo de IA capaz de crear contenido nuevo, como textos, imágenes, música o código."
        },
        {
          id: 4,
          concept: "Sistema basado en reglas",
          definition: "Sistema que sigue instrucciones o reglas definidas previamente por un programador sin capacidad de aprendizaje."
        },
        {
          id: 5,
          concept: "Datos de entrada",
          definition: "Información que recibe un sistema para analizarla y procesarla."
        }
    ],
    "mod3": [
        {
          id: 1,
          concept: `<img src="src/assets/img/option1.png" class="obj-img obj-img--mini" alt="Asistente conversacional">`,
          definition: "Necesitas resolver una duda sobre un tema visto en clase y hacer preguntas adicionales para comprenderlo mejor."
        },
        {
          id: 2,
          concept: `<img src="src/assets/img/option2.png" class="obj-img obj-img--mini" alt="Herramienta de resumen y organización de información">`,
          definition: "Debes resumir un artículo largo para identificar rápidamente las ideas principales."
        },
        {
          id: 3,
          concept: `<img src="src/assets/img/option3.png" class="obj-img obj-img--mini" alt="Herramienta de creación de imágenes mediante IA">`,
          definition: "Quieres crear una imagen para una presentación sin utilizar fotografías tomadas por ti."
        },
        {
          id: 4,
          concept: `<img src="src/assets/img/option4.png" class="obj-img obj-img--mini" alt="Herramienta de traducción automática">`,
          definition: "Necesitas traducir un texto de inglés a español para comprender mejor su contenido."
        },
        {
          id: 5,
          concept: `<img src="src/assets/img/option5.png" class="obj-img obj-img--mini" alt="Herramienta de generación de texto">`,
          definition: "Necesitas redactar un borrador inicial para un informe o una exposición."
        }
    ]
};

let selectedConcept = null;
let selectedDefinition = null;
let score = 0;
function shuffle(array) {return [...array].sort(() => Math.random() - 0.5);}// Mezclar elementos aleatoriamente

function createGame(mod, act) {
  const conceptsContainer = document.getElementById(`${mod}_concepts-container`);
  const definitionsContainer = document.getElementById(`${mod}_definitions-container`);
  conceptsContainer.innerHTML = "";
  definitionsContainer.innerHTML = "";
  const feedback = document.getElementById(`${mod}_${act}_feedback`);
  feedback.className = "feedback-banner show";
  feedback.textContent = "";
  selectedConcept = null;
  selectedDefinition = null;
  score = 0;

  const concepts = shuffle(matchingData[mod]); // Crear conceptos
  concepts.forEach(item => {
    const button = document.createElement("button");
    button.className = "gen-btn match-item";
    if (mod === "mod3") { button.innerHTML = item.concept; }
    else { button.textContent = item.concept; }
    button.dataset.id = item.id;

    button.addEventListener("click", () => {selectConcept(button, mod, act);});
    conceptsContainer.appendChild(button);
  });

  
  const definitions = shuffle(matchingData[mod]); // Crear definiciones
  definitions.forEach(item => {
    const button = document.createElement("button");
    button.className = "gen-btn match-item";
    button.textContent = item.definition;
    button.dataset.id = item.id;

    button.addEventListener("click", () => {selectDefinition(button, mod, act);});
    definitionsContainer.appendChild(button);
  });
}

// Seleccionar concepto
function selectConcept(button, mod, act) {
  if (button.disabled) return;
  document.querySelectorAll(`#${mod}_concepts-container .match-item`).forEach(btn => btn.classList.remove("selected"));
  selectedConcept = button;
  button.classList.add("selected");
  checkMatch(mod, act);
}

// Seleccionar definición
function selectDefinition(button, mod, act) {
  if (button.disabled) return;
  document.querySelectorAll(`#${mod}_definitions-container .match-item`).forEach(btn => btn.classList.remove("selected"));
  selectedDefinition = button;
  button.classList.add("selected");
  checkMatch(mod, act);
}

// Comprobar pareja
function checkMatch(mod, act) {
  if (!selectedConcept || !selectedDefinition) return;
  const conceptId = selectedConcept.dataset.id;
  const definitionId = selectedDefinition.dataset.id;
  const feedbackCheck = document.getElementById(`${mod}_${act}_feedback`);

  if (conceptId === definitionId) {

    // Respuesta correcta
    selectedConcept.classList.remove("selected");
    selectedDefinition.classList.remove("selected");

    selectedConcept.classList.add("correct");
    selectedDefinition.classList.add("correct");

    selectedConcept.disabled = true;
    selectedDefinition.disabled = true;

    score++;

    feedbackCheck.className = "feedback-banner show feedback-success";
    feedbackCheck.innerHTML = "<strong>¡Correcto!</strong> Pareja acertada.";
    playSuccess();

    selectedConcept = null;
    selectedDefinition = null;

    if (score === matchingData[mod].length) { // Comprobar si terminó el juego
      feedbackCheck.className = "feedback-banner show feedback-success";
      feedbackCheck.innerHTML = `<strong>¡Felicidades!</strong> Actividad completada.`;
    }

  } else {
    // Respuesta incorrecta
    feedbackCheck.className = "feedback-banner show feedback-hint";
    feedbackCheck.innerHTML = "<strong>¡Ups!</strong> Piénsalo de nuevo.";
    playClick();

    selectedConcept.classList.remove("selected");
    selectedDefinition.classList.remove("selected");

    selectedConcept = null;
    selectedDefinition = null;
  }
}

// Crear el juego al cargar la página
document.addEventListener("DOMContentLoaded", createGame('mod3', 'act2'));
