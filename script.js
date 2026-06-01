/* ========================================
   SCRIPTS INTERACTIVOS (Navegación y Modal)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
  initPopInAnimation();
  initProgressBars();
  addRandomFloatingToPhotos();
  initKeyboardNavigation();
  initPlantModals();
  initCarouselDots();
  initCarouselDotsFor('powerCarousel', 'powerDots');
  initCarouselDotsFor('friendsCarousel', 'friendsDots');
  initSectionIndicator();
  initQuiz();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* --- ANIMACION POP-IN --- */
function initPopInAnimation() {
  const popElements = document.querySelectorAll('.pop-in');
  const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  popElements.forEach(el => observer.observe(el));
}

/* --- ANIMACION BARRAS --- */
function initProgressBars() {
  const powerCards = document.querySelectorAll('.power-card');
  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.progress-fill');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width');
          }, 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  powerCards.forEach(card => observer.observe(card));
}

/* --- EFECTO FLOTANTE FOTOS --- */
function addRandomFloatingToPhotos() {
  const photos = document.querySelectorAll('.photo-card');
  const animNames = ['float-card1', 'float-card2', 'float-card3'];
  photos.forEach((photo, index) => {
    const randomDuration = 3 + Math.random() * 2;
    const randomDelay = Math.random() * 2;
    photo.style.animation = `${animNames[index]} ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
  });
}

/* --- NAVEGACION POR TECLADO (FLECHAS ABAJO/ARRIBA) --- */
function initKeyboardNavigation() {
  const sections = document.querySelectorAll('section');
  let isScrolling = false;

  window.addEventListener('keydown', (e) => {
    // Solo actuar si no hay modales abiertos y no se esta scrolleando ya
    if (document.body.classList.contains('modal-open') || isScrolling) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); // Evitar scroll nativo a saltos
      
      // Encontrar en que seccion estamos actualmente basados en el scroll
      let currentSectionIndex = 0;
      const scrollY = window.scrollY + (window.innerHeight / 3); // Margen de holgura

      sections.forEach((sec, index) => {
        if (sec.offsetTop <= scrollY) {
          currentSectionIndex = index;
        }
      });

      // Determinar la siguiente seccion
      let targetIndex = currentSectionIndex;
      if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
        targetIndex++;
      } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
        targetIndex--;
      }

      if (targetIndex !== currentSectionIndex) {
        isScrolling = true;
        
        window.scrollTo({
          top: sections[targetIndex].offsetTop,
          behavior: 'smooth'
        });

        // Desbloquear tras 800ms (tiempo aproximado del scroll smooth)
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    }
  });
}

/* --- LOGICA DEL MODAL DE PLANTAS --- */
function initPlantModals() {
  const cards = document.querySelectorAll('.friend-card');
  const modal = document.getElementById('plantModal');
  const closeBtn = document.getElementById('closeModal');
  const body = document.body;

  // Elementos internos del modal
  const mImgWrap = document.getElementById('m-imgWrap');
  const mImg = document.getElementById('m-img');
  const mTitle = document.getElementById('m-title');
  const mSub = document.getElementById('m-sub');
  const mDesc = document.getElementById('m-desc');
  const mDiff = document.getElementById('m-diff');
  const mLuz = document.getElementById('m-luz');
  const mAgua = document.getElementById('m-agua');
  const mExtra = document.getElementById('m-extra');

  // Abrir Modal
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Poblar datos
      mImg.src = card.getAttribute('data-img');
      mImgWrap.style.backgroundColor = card.getAttribute('data-color');
      
      mTitle.textContent = card.getAttribute('data-name');
      mSub.textContent = card.getAttribute('data-sub');
      mDesc.textContent = card.getAttribute('data-desc');
      mDiff.textContent = card.getAttribute('data-diff');
      mLuz.textContent = card.getAttribute('data-luz');
      mAgua.textContent = card.getAttribute('data-agua');
      mExtra.textContent = card.getAttribute('data-extra');

      // Mostrar modal
      modal.classList.add('active');
      body.classList.add('modal-open');
    });
  });

  // Cerrar Modal (Boton)
  const closeModal = () => {
    modal.classList.remove('active');
    body.classList.remove('modal-open');
  };

  closeBtn.addEventListener('click', closeModal);

  // Cerrar Modal (Click fuera de la caja)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar Modal (Tecla Escape)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --- LOGICA DEL CARRUSEL DE CUIDADOS --- */
function initCarouselDots() {
  const carousel = document.getElementById('lessonsCarousel');
  const dots = document.querySelectorAll('#carouselDots .dot');
  
  if (!carousel || dots.length === 0) return;

  carousel.addEventListener('scroll', () => {
    // Math.round is a simple way to see which card is taking up the most space
    const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    
    dots.forEach((dot, i) => {
      if(i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      const cardWidth = carousel.querySelector('.lesson-card').offsetWidth;
      // 24px is approx 1.5rem gap
      const scrollPosition = index * (cardWidth + 24);
      
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* --- DOTS GENÉRICOS PARA CARRUSEL HORIZONTAL --- */
function initCarouselDotsFor(carouselId, dotsId) {
  const carousel = document.getElementById(carouselId);
  const dotsContainer = document.getElementById(dotsId);
  if (!carousel || !dotsContainer) return;

  const dots = dotsContainer.querySelectorAll('.dot');

  carousel.addEventListener('scroll', () => {
    const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }, { passive: true });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      const firstCard = carousel.firstElementChild;
      const gap = parseFloat(getComputedStyle(carousel).gap) || 16;
      carousel.scrollTo({ left: index * (firstCard.offsetWidth + gap), behavior: 'smooth' });
    });
  });
}

/* --- QUIZ: ENCUENTRA TU PLANTA IDEAL --- */
function initQuiz() {
  const PLANTS = [
    {
      name: 'Monstera Deliciosa', family: 'Familia: Araceae | Origen: México',
      luz: 'media', espacio: 'grande', riego: 'moderado', experiencia: 'intermedio', valor: 'decorativa',
      desc: 'La reina de las plantas de interior. Sus hojas fenestradas son únicas y le dan un toque selvático e impactante a cualquier espacio.',
      cuidado: 'Luz indirecta brillante, riego cada 1-2 semanas', dato: 'Sus agujeros en las hojas le permiten resistir vientos fuertes en su hábitat natural.',
      img: '', color: 'var(--c-pink)',
    },
    {
      name: 'Epipremnum Aureum', family: 'Familia: Araceae | Origen: Sudeste Asiático',
      luz: 'baja', espacio: 'pequeño', riego: 'moderado', experiencia: 'principiante', valor: 'purificación',
      desc: 'El Pothos es casi indestructible. Cuelga elegante desde estantes y tolera el olvido con una sonrisa. Perfecta para empezar.',
      cuidado: 'Tolera poca luz, riego cuando la tierra esté seca', dato: 'Puede purificar el aire de formaldehído y benceno según estudios de la NASA.',
      img: '', color: 'var(--c-blue)',
    },
    {
      name: 'Dracaena Trifasciata', family: 'Familia: Asparagaceae | Origen: África Tropical',
      luz: 'baja', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'La Lengua de Suegra es la campeona del abandono. Acumula agua en sus hojas y puede pasar semanas sin que la toques.',
      cuidado: 'Cualquier luz, riego cada 3-6 semanas', dato: 'Fotosíntesis de tipo CAM: absorbe CO₂ de noche y libera O₂, ideal para el dormitorio.',
      img: '', color: 'var(--c-purple)',
    },
    {
      name: 'Spathiphyllum', family: 'Familia: Araceae | Origen: América Tropical',
      luz: 'baja', espacio: 'medio', riego: 'frecuente', experiencia: 'intermedio', valor: 'flores',
      desc: 'El Lirio de Paz florece en interiores con poca luz, algo poco común. Sus flores blancas elegantes alegran cualquier rincón oscuro.',
      cuidado: 'Poca luz, riego frecuente, ambiente húmedo', dato: 'Te avisa cuando tiene sed: sus hojas caen dramáticamente. Con agua, se recupera en horas.',
      img: '', color: 'var(--c-yellow)',
    },
    {
      name: 'Ficus Lyrata', family: 'Familia: Moraceae | Origen: África Occidental',
      luz: 'alta', espacio: 'grande', riego: 'moderado', experiencia: 'experto', valor: 'decorativa',
      desc: 'El Ficus Lyrata es el árbol favorito de los diseñadores de interiores. Sus hojas en forma de violín son magnéticas y estructurales.',
      cuidado: 'Mucha luz indirecta, riego moderado, no moverlo', dato: 'Odia los cambios de lugar. Moverlo puede provocar que suelte todas sus hojas.',
      img: '', color: 'var(--c-mint)',
    },
    {
      name: 'Aloe Vera', family: 'Familia: Asphodelaceae | Origen: Península Arábiga',
      luz: 'alta', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'El Aloe es una farmacia en maceta. Fácil de cuidar, necesita sol y casi nada de agua. Un clásico que nunca falla.',
      cuidado: 'Sol directo o luz brillante, riego cada 2-3 semanas', dato: 'El gel de sus hojas tiene propiedades antiinflamatorias usadas en medicina y cosmética.',
      img: '', color: 'var(--c-orange)',
    },
    {
      name: 'Calathea Orbifolia', family: 'Familia: Marantaceae | Origen: Bolivia',
      luz: 'media', espacio: 'medio', riego: 'frecuente', experiencia: 'experto', valor: 'decorativa',
      desc: 'La Calathea es la obra de arte del reino vegetal. Sus hojas rayadas en verde y plata son visualmente hipnóticas.',
      cuidado: 'Luz indirecta, riego frecuente con agua sin cloro, humedad alta', dato: 'Sus hojas se mueven siguiendo la luz durante el día, fenómeno llamado nictinastia.',
      img: '', color: 'var(--c-pink)',
    },
    {
      name: 'Zamioculcas Zamiifolia', family: 'Familia: Araceae | Origen: África Oriental',
      luz: 'baja', espacio: 'medio', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'La ZZ Plant es el superhéroe del descuido. Tolera oscuridad, sequía y abandono total. Casi imposible de matar.',
      cuidado: 'Poca o ninguna luz directa, riego muy esporádico', dato: 'Almacena agua en sus rizomas subterráneos, lo que la hace extremadamente resistente a la sequía.',
      img: '', color: 'var(--c-mint)',
    },
    {
      name: 'Helecho de Boston', family: 'Familia: Nephrolepidaceae | Origen: Trópicos',
      luz: 'media', espacio: 'medio', riego: 'frecuente', experiencia: 'intermedio', valor: 'purificación',
      desc: 'El Helecho de Boston crea ambientes frescos y naturales con sus frondas colgantes. Ideal para baños o cocinas húmedas.',
      cuidado: 'Luz indirecta, riego frecuente, humedad constante', dato: 'Uno de los mejores purificadores de aire: elimina formaldehído con gran eficiencia.',
      img: '', color: 'var(--c-blue)',
    },
    {
      name: 'Ficus Elastica', family: 'Familia: Moraceae | Origen: Asia',
      luz: 'media', espacio: 'grande', riego: 'moderado', experiencia: 'intermedio', valor: 'purificación',
      desc: 'El Árbol de Caucho combina elegancia y resistencia. Sus hojas brillantes y oscuras crean un contraste dramático en interiores.',
      cuidado: 'Luz indirecta brillante, riego moderado, limpia las hojas', dato: 'Su savia látex fue usada históricamente para fabricar caucho natural.',
      img: '', color: 'var(--c-purple)',
    },
    {
      name: 'Crassula Ovata', family: 'Familia: Crassulaceae | Origen: Sudáfrica',
      luz: 'alta', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'decorativa',
      desc: 'La Planta Jade parece esculpida en madera, con hojas brillantes como piedras preciosas. Suculenta de bajo mantenimiento y larga vida.',
      cuidado: 'Mucha luz, riego mínimo, tierra que drene bien', dato: 'En muchas culturas se considera planta de la suerte y la prosperidad económica.',
      img: '', color: 'var(--c-orange)',
    },
    {
      name: 'Anthurium', family: 'Familia: Araceae | Origen: América Tropical',
      luz: 'media', espacio: 'pequeño', riego: 'frecuente', experiencia: 'intermedio', valor: 'flores',
      desc: 'El Anturio es puro color y elegancia. Sus espatas lacadas en rojo intenso florecen varias veces al año y duran semanas.',
      cuidado: 'Luz indirecta brillante, riego frecuente pero sin encharcamiento', dato: 'Sus flores en realidad son espatas (hojas modificadas), no pétalos. La flor real es el espádice central.',
      img: '', color: 'var(--c-pink)',
    },
  ];

  const TRAITS = ['luz', 'espacio', 'riego', 'experiencia', 'valor'];

  const state = { step: 0, name: '', answers: [], submissionId: null };

  const overlay = document.getElementById('quizModal');
  const progressDots = document.querySelectorAll('.quiz-progress-dot');
  const steps = document.querySelectorAll('.quiz-step');

  function openQuiz() {
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    goToStep(0);
  }

  function closeQuiz() {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    resetQuiz();
  }

  function goToStep(n) {
    state.step = n;
    steps.forEach(s => s.classList.remove('active'));
    document.getElementById('quiz-step-' + n).classList.add('active');

    const showProgress = n >= 1 && n <= 5;
    document.getElementById('quizProgress').style.visibility = showProgress ? 'visible' : 'hidden';

    progressDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === n) dot.classList.add('active');
      else if (i + 1 < n) dot.classList.add('done');
    });
  }

  function selectAnswer(qIndex, value) {
    state.answers[qIndex] = value;

    // Brief visual feedback before advancing
    setTimeout(() => {
      if (qIndex === 4) {
        const result = calculateResult();
        showResult(result);
        goToStep(6);
      } else {
        goToStep(qIndex + 2);
      }
    }, 250);
  }

  function calculateResult() {
    const scored = PLANTS.map(plant => {
      const score = TRAITS.reduce((sum, trait, i) => {
        return sum + (plant[trait] === state.answers[i] ? 3 : 0);
      }, 0);
      return { ...plant, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  function showResult(plant) {
    const name = state.name || 'Amigo';
    document.getElementById('quizResultIntro').textContent = name + ', tu planta ideal es...';
    document.getElementById('quizResultName').textContent = plant.name;
    document.getElementById('quizResultFamily').textContent = plant.family;
    document.getElementById('quizResultDesc').textContent = plant.desc;
    document.getElementById('quizResultLuz').textContent = plant.cuidado.split(',')[0];
    document.getElementById('quizResultRiego').textContent = plant.cuidado.split(',')[1] || 'Moderado';
    document.getElementById('quizResultDiff').textContent = plant.experiencia.charAt(0).toUpperCase() + plant.experiencia.slice(1);
    document.getElementById('quizResultDato').textContent = plant.dato;
    const imgWrap = document.getElementById('quizResultImgWrap');
    imgWrap.style.backgroundColor = plant.color;
    const img = document.getElementById('quizResultImg');
    img.src = plant.img;
    img.alt = plant.name;

    // Guardar resultado en DB (non-blocking)
    if (state.submissionId) {
      fetch('/api/quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: state.submissionId,
          answers: state.answers,
          result_plant: plant.name,
        }),
      }).catch(() => {});
    }
  }

  function resetQuiz() {
    state.step = 0;
    state.name = '';
    state.answers = [];
    state.submissionId = null;
    document.getElementById('quizName').value = '';
    document.querySelectorAll('.quiz-option.selected').forEach(o => o.classList.remove('selected'));
  }

  // Events
  document.getElementById('startQuiz').addEventListener('click', openQuiz);
  document.getElementById('closeQuiz').addEventListener('click', closeQuiz);
  document.getElementById('quizClose2').addEventListener('click', closeQuiz);
  document.getElementById('quizRetry').addEventListener('click', () => { resetQuiz(); goToStep(0); });

  overlay.addEventListener('click', e => { if (e.target === overlay) closeQuiz(); });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeQuiz();
  });

  document.getElementById('quizStart').addEventListener('click', () => {
    const nameInput = document.getElementById('quizName');
    state.name = nameInput.value.trim();
    if (!state.name) {
      nameInput.focus();
      nameInput.style.boxShadow = '0 0 0 3px var(--c-pink)';
      setTimeout(() => { nameInput.style.boxShadow = ''; }, 1200);
      return;
    }
    // Registrar en DB al ingresar nombre (non-blocking)
    fetch('/api/quiz-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: state.name }),
    })
      .then(r => r.json())
      .then(data => { if (data.id) state.submissionId = data.id; })
      .catch(() => {});
    goToStep(1);
  });

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIndex = parseInt(btn.getAttribute('data-q'));
      const val = btn.getAttribute('data-val');
      // Visual selection
      document.querySelectorAll(`.quiz-option[data-q="${qIndex}"]`).forEach(o => o.classList.remove('selected'));
      btn.classList.add('selected');
      selectAnswer(qIndex, val);
    });
  });
}

/* --- INDICADOR DE SECCIÓN (puntos derecha) --- */
function initSectionIndicator() {
  const indicator = document.getElementById('sectionIndicator');
  const dots = document.querySelectorAll('#sectionIndicator .sec-dot');
  const sections = document.querySelectorAll('section');
  const footer = document.querySelector('footer');

  if (!indicator) return;

  const update = () => {
    // Ocultar cuando el footer es visible
    const footerVisible = footer.getBoundingClientRect().top < window.innerHeight * 0.85;
    indicator.classList.toggle('hidden', footerVisible);

    // Punto activo según sección en pantalla
    let activeIndex = 0;
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollMid) activeIndex = i;
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Clic para navegar
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      sections[i].scrollIntoView({ behavior: 'smooth' });
    });
  });
}
