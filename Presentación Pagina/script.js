/* ============================================================
   PRICE NICE – SCRIPT.JS
   Interactividad: navbar, hamburger, tabs, slider,
   FAQ accordion, formulario, back-to-top, animaciones scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. NAVBAR – cambio al hacer scroll
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // estado inicial


  /* ──────────────────────────────────────────
     2. HAMBURGER – menú móvil
  ────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const overlay    = createOverlay();

  function createOverlay() {
    const el = document.createElement('div');
    el.id = 'navOverlay';
    Object.assign(el.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(0,0,0,.5)',
      zIndex: '998',
      display: 'none',
      backdropFilter: 'blur(2px)'
    });
    document.body.appendChild(el);
    return el;
  }

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────
     3. SMOOTH SCROLL con offset para navbar fijo
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navbarH = navbar.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navbarH - 8;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     4. TABS – Servicios (Nube / Móvil)
  ────────────────────────────────────────── */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(`tab-${tabId}`);
      if (target) target.classList.add('active');
    });
  });


  /* ──────────────────────────────────────────
     5. SLIDER – Testimonios
  ────────────────────────────────────────── */
  const cards      = document.querySelectorAll('.testimonio-card');
  const dotsWrap   = document.getElementById('sliderDots');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  let   current    = 0;
  let   autoSlide;

  // Crear dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoSlide() {
    autoSlide = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  prevBtn.addEventListener('click', () => { stopAutoSlide(); goTo(current - 1); startAutoSlide(); });
  nextBtn.addEventListener('click', () => { stopAutoSlide(); goTo(current + 1); startAutoSlide(); });

  startAutoSlide();

  // Pausar al hover
  const sliderEl = document.getElementById('testimoniosSlider');
  sliderEl.addEventListener('mouseenter', stopAutoSlide);
  sliderEl.addEventListener('mouseleave', startAutoSlide);

  // Swipe táctil
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAutoSlide();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoSlide();
    }
  });


  /* ──────────────────────────────────────────
     6. FAQ – Accordion
  ────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar todos
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Abrir el clickeado si estaba cerrado
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });

    // Accesibilidad: Enter/Space
    question.setAttribute('aria-expanded', 'false');
  });


  /* ──────────────────────────────────────────
     7. FORMULARIO DE CONTACTO – validación
  ────────────────────────────────────────── */
  const form       = document.getElementById('contactoForm');
  const successMsg = document.getElementById('formSuccess');

  function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`error-${fieldId}`);
    if (input)  input.closest('.input-wrapper').querySelector('input, textarea')
                     ?.classList.add('invalid');
    if (error)  error.textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();

      const nombre  = form.nombre.value.trim();
      const email   = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();
      let   valid   = true;

      if (!nombre) {
        showError('nombre', 'Por favor ingresa tu nombre.');
        valid = false;
      }
      if (!email) {
        showError('email', 'Por favor ingresa tu correo.');
        valid = false;
      } else if (!validateEmail(email)) {
        showError('email', 'Correo inválido. Ej: usuario@dominio.com');
        valid = false;
      }
      if (!mensaje) {
        showError('mensaje', 'Por favor escribe un mensaje.');
        valid = false;
      }

      if (!valid) return;

      // Simular envío
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
        successMsg.style.display = 'flex';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }, 1500);
    });

    // Limpiar error al escribir
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const errorEl = document.getElementById(`error-${el.id}`);
        if (errorEl) errorEl.textContent = '';
      });
    });
  }


  /* ──────────────────────────────────────────
     8. BACK TO TOP
  ────────────────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ──────────────────────────────────────────
     9. ANIMACIONES – Intersection Observer
        (fade-in al hacer scroll)
  ────────────────────────────────────────── */
  const animElements = document.querySelectorAll(
    '.problema-card, .mv-card, .valor-card, .servicio-card, ' +
    '.tech-card, .proyecto-card, .beneficio-card, ' +
    '.testimonio-card, .faq-item, .info-card, .obj-item, ' +
    '.historia-box, .mono-card, .producto-hero'
  );

  // Añadir clase base para animación
  animElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .5s ease ${(i % 6) * 0.07}s, transform .5s ease ${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animElements.forEach(el => observer.observe(el));


  /* ──────────────────────────────────────────
     10. ENLACE ACTIVO en navbar según sección
  ────────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 60;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(a => {
          a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // Estilo para enlace activo
  const activeStyle = document.createElement('style');
  activeStyle.textContent = '.nav-links a.nav-active { color: var(--gold) !important; }';
  document.head.appendChild(activeStyle);

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  /* ──────────────────────────────────────────
     11. COUNTER ANIMATION – stats del hero
  ────────────────────────────────────────── */
  // Se activa cuando la sección hero es visible (si contiene números)
  // En este caso los valores son simbólicos (100%, 0, ∞) así que no se anima.


  /* ──────────────────────────────────────────
     12. YEAR en footer (actualización automática)
  ────────────────────────────────────────── */
  const yearEls = document.querySelectorAll('.footer-bottom');
  // El año ya está en el HTML, no se sobreescribe.

}); // fin DOMContentLoaded
