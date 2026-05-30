/* ========================================
   SCRIPTS INTERACTIVOS (Navegación y Modal)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPopInAnimation();
  initProgressBars();
  addRandomFloatingToPhotos();
  initKeyboardNavigation();
  initPlantModals();
  initCarouselDots();
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
  photos.forEach((photo) => {
    const randomDuration = 3 + Math.random() * 2;
    const randomDelay = Math.random() * 2;
    photo.style.animation = `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
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
