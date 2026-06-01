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
  const mCommon = document.getElementById('m-common');
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

      mCommon.textContent = card.getAttribute('data-common') || '';
      mCommon.style.display = card.getAttribute('data-common') ? 'inline-block' : 'none';
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
      name: 'Monstera Deliciosa', common: 'Costilla de Adán / Balazo',
      family: 'Familia: Araceae | Origen: México',
      luz: 'media', espacio: 'grande', riego: 'moderado', experiencia: 'intermedio', valor: 'decorativa',
      desc: 'Sus agujeros en las hojas no son un defecto, ¡son su superpoder! Los desarrolló para aguantar vientos fuertes en la selva y dejar pasar la luz a sus vecinas de abajo.',
      cuidado: 'Luz indirecta brillante', riego: 'Cada 1 o 2 semanas',
      dato: 'Puede crecer hasta 3 metros dentro de tu casa. Con un palo de musgo, trepa feliz y saca hojas enormes.',
      img: 'https://i.pinimg.com/originals/02/44/09/0244091b32b048107fb95e98793eb989.jpg', color: 'var(--c-pink)',
    },
    {
      name: 'Epipremnum Aureum', common: 'Poto / Pothos',
      family: 'Familia: Araceae | Origen: Sudeste Asiático',
      luz: 'baja', espacio: 'pequeño', riego: 'moderado', experiencia: 'principiante', valor: 'purificación',
      desc: 'Esta planta no conoce el rendirse. Crece en oficinas oscuras, en rincones sin ventana, y hasta olvidada semanas enteras. La amiga más tolerante del reino vegetal.',
      cuidado: 'Tolera desde poca luz hasta indirecta brillante', riego: 'Cuando la tierra esté seca',
      dato: 'La NASA la usó en sus estudios de purificación de aire: se come el formaldehído y el benceno.',
      img: 'https://d.newsweek.com/en/full/1978483/when-plant-pothos-plant.jpg', color: 'var(--c-blue)',
    },
    {
      name: 'Dracaena Trifasciata', common: 'Lengua de Suegra / Sanseviera',
      family: 'Familia: Asparagaceae | Origen: África Tropical',
      luz: 'baja', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'Duerme durante el día para no perder agua, y respira de noche. Es como una planta con turno nocturno. Casi no necesita riego y sobrevive en los rincones más olvidados.',
      cuidado: 'Cualquier luz, incluso baños sin ventana', riego: 'Cada 3 a 6 semanas',
      dato: 'Perfecta para el cuarto: absorbe CO₂ de noche y suelta O₂, al revés que la mayoría de plantas.',
      img: 'https://o-remonte.com/wp-content/uploads/2021/07/Sansevieriya.jpg', color: 'var(--c-purple)',
    },
    {
      name: 'Spathiphyllum', common: 'Lirio de Paz / Cuna de Moisés',
      family: 'Familia: Araceae | Origen: América Tropical',
      luz: 'baja', espacio: 'medio', riego: 'frecuente', experiencia: 'intermedio', valor: 'flores',
      desc: 'Hace algo que pocas logran: florecer dentro de casa, sin sol directo. Y cuando tiene sed, te lo dice de la manera más dramática posible: se deja caer todita. Pero con agua vuelve.',
      cuidado: 'Poca a media luz, ambiente húmedo', riego: 'Frecuente, no dejarla secar',
      dato: 'Purifica el aire de amoníaco y acetona. Bonita y útil, la combinación perfecta.',
      img: 'https://jardinurbano.com.uy/wp-content/uploads/2022/01/Spathiphyllum-en-maceta.jpg', color: 'var(--c-yellow)',
    },
    {
      name: 'Ficus Lyrata', common: 'Ficus Lira / Violinero',
      family: 'Familia: Moraceae | Origen: África Occidental',
      luz: 'alta', espacio: 'grande', riego: 'moderado', experiencia: 'experto', valor: 'decorativa',
      desc: 'El árbol favorito de los diseñadores de interiores. Sus hojas enormes en forma de violín son puro impacto visual. Eso sí, es un poco dramático: odia que lo muevan.',
      cuidado: 'Mucha luz indirecta, no cambiarla de lugar', riego: 'Moderado, verificar tierra',
      dato: 'Si lo cambias de sitio puede botar todas las hojas de un día para otro. Y luego volver a sacarlas cuando se acostumbra.',
      img: 'https://images.squarespace-cdn.com/content/v1/64067c5471624b6a98a0228c/1678148164421-SV30PJ7XVQOH9QGLKW2O/image-asset.png', color: 'var(--c-mint)',
    },
    {
      name: 'Aloe Vera', common: 'Sábila',
      family: 'Familia: Asphodelaceae | Origen: Península Arábiga',
      luz: 'alta', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'Una farmacia en maceta. Necesita sol y casi nada de agua. Y si te quemas o te pica algo, abres una hoja y te la unta. Lleva miles de años en la casa de la gente y por algo es.',
      cuidado: 'Sol directo o luz muy brillante', riego: 'Cada 2 o 3 semanas',
      dato: 'El gel de sus hojas se usa en cremas, medicamentos y hasta en bebidas. Es una planta de verdad útil.',
      img: 'https://growyouryard.com/wp-content/uploads/2020/09/how-long-does-it-take-for-aloe-vera-to-grow-2048x1365.jpg', color: 'var(--c-orange)',
    },
    {
      name: 'Calathea Orbifolia', common: 'Calatea',
      family: 'Familia: Marantaceae | Origen: Bolivia',
      luz: 'media', espacio: 'medio', riego: 'frecuente', experiencia: 'experto', valor: 'decorativa',
      desc: 'La obra de arte del reino vegetal. Sus hojas rayadas en verde y plata son hipnóticas. Eso sí, es exigente: necesita agua sin cloro, humedad alta y mucha atención.',
      cuidado: 'Luz indirecta, agua sin cloro, humedad constante', riego: 'Frecuente y con cuidado',
      dato: 'Sus hojas se mueven durante el día siguiendo la luz. De noche se enrollan. Todo en silencio.',
      img: 'https://plantglossary.com/wp-content/uploads/2024/04/Calathea-Ornata-Pinstripe-Calathea.jpg', color: 'var(--c-pink)',
    },
    {
      name: 'Zamioculcas Zamiifolia', common: 'ZZ Plant / Zamioculca',
      family: 'Familia: Araceae | Origen: África Oriental',
      luz: 'baja', espacio: 'medio', riego: 'poco', experiencia: 'principiante', valor: 'fácil',
      desc: 'El superhéroe del descuido. Tolera oscuridad, sequía y abandono total. Si pudieras matar esta planta, sería todo un logro. Casi no se puede.',
      cuidado: 'Cualquier luz, incluso muy poca', riego: 'Muy esporádico, cada mes o más',
      dato: 'Guarda agua en unos bulbos subterráneos. Por eso aguanta tanto sin riego: tiene su propia reserva.',
      img: 'https://www.petalrepublic.com/wp-content/uploads/2020/09/The-Most-Popular-ZZ-Plant-Varieties-e1600090897264.jpg', color: 'var(--c-mint)',
    },
    {
      name: 'Helecho de Boston', common: 'Helecho Colgante',
      family: 'Familia: Nephrolepidaceae | Origen: Trópicos',
      luz: 'media', espacio: 'medio', riego: 'frecuente', experiencia: 'intermedio', valor: 'purificación',
      desc: 'Crea ese ambiente fresco y selvático que convierte cualquier rincón en algo especial. Perfecta para baños o cocinas donde hay humedad natural.',
      cuidado: 'Luz indirecta, no le gusta el sol directo', riego: 'Frecuente, tierra siempre algo húmeda',
      dato: 'Es uno de los mejores purificadores de aire del mundo vegetal. Se come el formaldehído con ganas.',
      img: 'https://www.jardinjosefina.cl/wp-content/uploads/2024/02/helecho_boston.jpg', color: 'var(--c-blue)',
    },
    {
      name: 'Ficus Elastica', common: 'Caucho / Árbol de Caucho',
      family: 'Familia: Moraceae | Origen: Asia',
      luz: 'media', espacio: 'grande', riego: 'moderado', experiencia: 'intermedio', valor: 'purificación',
      desc: 'Hojas grandes, brillantes y oscuras que hacen que cualquier espacio se vea más elegante. Purifica el aire y crece despacio, así que dura mucho tiempo contigo.',
      cuidado: 'Luz indirecta brillante, limpiar las hojas', riego: 'Moderado, dejar secar entre riegos',
      dato: 'De su savia se fabricó el caucho natural durante años. Hoy está en tu sala, más tranquila.',
      img: 'https://tse1.mm.bing.net/th/id/OIP.K_ft_vWVn0BU54y6YgyT3AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', color: 'var(--c-purple)',
    },
    {
      name: 'Crassula Ovata', common: 'Planta Jade / Árbol de Jade',
      family: 'Familia: Crassulaceae | Origen: Sudáfrica',
      luz: 'alta', espacio: 'pequeño', riego: 'poco', experiencia: 'principiante', valor: 'decorativa',
      desc: 'Parece esculpida en madera, con hojas que brillan como piedras verdes. Suculenta que vive muchos años y no pide casi nada. La tienen en las casas de abuelas de todo el mundo.',
      cuidado: 'Mucha luz, tierra que drene bien', riego: 'Mínimo, es suculenta',
      dato: 'En muchas culturas se regala como símbolo de buena suerte y prosperidad. Quizás por eso sobrevive tanto.',
      img: 'https://cdn.mos.cms.futurecdn.net/8V37anNuyg7s3u9uanCgHT-1600-80.jpg', color: 'var(--c-orange)',
    },
    {
      name: 'Anthurium', common: 'Anturio',
      family: 'Familia: Araceae | Origen: América Tropical',
      luz: 'media', espacio: 'pequeño', riego: 'frecuente', experiencia: 'intermedio', valor: 'flores',
      desc: 'Puro color y actitud. Sus espatas lacadas en rojo brillante florecen varias veces al año y duran semanas. Una de las plantas más bonitas para regalar o quedarse.',
      cuidado: 'Luz indirecta brillante, sin sol directo', riego: 'Frecuente pero sin encharcar',
      dato: 'Lo que parece la flor roja es en realidad una hoja modificada. La flor de verdad es el palito central.',
      img: 'https://cdn.mos.cms.futurecdn.net/UToRRP2vRoz6gt5dUfgBA8.jpg', color: 'var(--c-pink)',
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
    document.getElementById('quizResultCommon').textContent = plant.common || '';
    document.getElementById('quizResultName').textContent = plant.name;
    document.getElementById('quizResultFamily').textContent = plant.family;
    document.getElementById('quizResultDesc').textContent = plant.desc;
    document.getElementById('quizResultLuz').textContent = plant.cuidado;
    document.getElementById('quizResultRiego').textContent = plant.riego;
    document.getElementById('quizResultDiff').textContent = plant.experiencia.charAt(0).toUpperCase() + plant.experiencia.slice(1);
    document.getElementById('quizResultDato').textContent = plant.dato;
    const imgWrap = document.getElementById('quizResultImgWrap');
    imgWrap.style.backgroundColor = plant.color;
    const img = document.getElementById('quizResultImg');
    img.src = plant.img;
    img.alt = plant.common || plant.name;

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
