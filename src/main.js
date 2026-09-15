import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initSmoothScroll();
  initCustomCursor();
  initHeader();
  initHeroAnimations();
  initSteamCanvas('hero-steam-canvas', 25);
  initSteamCanvas('coffee-steam-canvas', 20);
  initHorizontalCraftTimeline();
  initLeafPlateBuilder();
  initSignatureCallouts();
  initPongalParallax();
  initBrewCalculator();
  initMenuPreviewModal();
  initDishDetailModal();
  initUniversalModal();
  initReservationModal();
  initMobileDrawer();
  initSoundscapeGenerator();
  initGeneralScrollReveals();
});

/* LENIS SMOOTH SCROLL SYSTEM */
let lenis;
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  lenis.on('scroll', (e) => {
    ScrollTrigger.update();
    updateScrollProgress();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const progressEl = document.getElementById('scroll-progress');
  if (progressEl) {
    progressEl.style.width = `${scrollPercent}%`;
  }
}

/* CUSTOM CURSOR SYSTEM */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorText = cursor ? cursor.querySelector('.cursor-text') : null;

  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const hoverElements = document.querySelectorAll('[data-cursor], a, button, .dish-card, .kitchen-card');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-cursor') || 'VIEW';
      cursor.classList.add('active-hover');
      if (cursorText) cursorText.textContent = label;
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active-hover');
      if (cursorText) cursorText.textContent = '';
    });
  });

  const magnetButtons = document.querySelectorAll('.magnet-btn');
  magnetButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* MAIN HEADER & ACTIVE SECTION TRACKER */
function initHeader() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .drawer-link');
  const sections = document.querySelectorAll('section[id]');

  if (!header) return;

  function updateActiveNav() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      drawerLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* HERO ENTRANCE */
function initHeroAnimations() {
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.to('.hero-bg-img', { scale: 1, duration: 2.2, ease: 'power2.out' });
  heroTl.from('.hero-tagline-small', { y: 20, opacity: 0, duration: 0.8 }, '-=1.6');
  heroTl.from('.hero-title span', { y: 60, opacity: 0, duration: 1.2, stagger: 0.25 }, '-=0.6');
  heroTl.from('.hero-subtext', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6');
  heroTl.from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4');
  heroTl.from('.morning-timeline-bar', { scale: 0.9, opacity: 0, duration: 0.8 }, '-=0.4');
  heroTl.from('.hero-scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.4');
}

/* CANVAS STEAM PARTICLES */
function initSteamCanvas(canvasId, particleCount = 25) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  class SteamParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 40 + 30;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.18 + 0.05;
      this.growth = Math.random() * 0.2 + 0.1;
      this.waveFactor = Math.random() * 0.02 + 0.01;
      this.time = Math.random() * 100;
    }
    update() {
      this.time += this.waveFactor;
      this.y -= this.speedY;
      this.x += Math.sin(this.time) * 0.6 + this.speedX;
      this.size += this.growth;

      const progress = (height - this.y) / height;
      if (progress < 0.2) {
        this.opacity = (progress / 0.2) * this.maxOpacity;
      } else if (progress > 0.6) {
        this.opacity = (1 - (progress - 0.6) / 0.4) * this.maxOpacity;
      } else {
        this.opacity = this.maxOpacity;
      }

      if (this.y < -50 || this.opacity <= 0) { this.reset(); }
    }
    draw() {
      ctx.save();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      grad.addColorStop(0.6, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: particleCount }, () => new SteamParticle());
  function animateSteam() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animateSteam);
  }
  animateSteam();
}

/* REDESIGNED 1-CARD CINEMATIC CRAFT STAGE CONTROLLER */
function initHorizontalCraftTimeline() {
  const nodes = document.querySelectorAll('.hz-node');
  const fillBar = document.getElementById('hz-progress-fill');
  const activeCard = document.getElementById('craft-active-card');

  const cardImg = document.getElementById('single-card-img');
  const stepBadge = document.getElementById('single-step-badge');
  const timeBadge = document.getElementById('single-time-badge');
  const cardTag = document.getElementById('single-card-tag');
  const cardTitle = document.getElementById('single-card-title');
  const cardQuote = document.getElementById('single-card-quote');
  const cardDesc = document.getElementById('single-card-desc');

  const prevBtn = document.getElementById('craft-prev-btn');
  const nextBtn = document.getElementById('craft-next-btn');

  const craftSteps = [
    {
      step: 1,
      badge: '01 / 06',
      time: '04:30 AM',
      tag: 'CHAPTER ONE • FOUNDATION',
      title: 'RICE & DAL SOAKING',
      quote: '“Washed in cold mountain spring water.”',
      img: './images/rice_soak.jpg',
      desc: 'Selecting short-grain parboiled rice and pristine white urad dal. Six slow hours of soaking in mountain spring water to activate natural starches and absorb moisture.',
    },
    {
      step: 2,
      badge: '02 / 06',
      time: '06:00 AM',
      tag: 'CHAPTER TWO • MILLING',
      title: 'GRANITE STONE GRINDING',
      quote: '“Cold friction granite milling.”',
      img: './images/stone_grind.jpg',
      desc: 'Ground slowly between hand-carved Salem granite stones. Low friction pressure creates velvety smooth batter without heat damage to natural yeasts.',
    },
    {
      step: 3,
      badge: '03 / 06',
      time: '10:00 PM',
      tag: 'CHAPTER THREE • FERMENTATION',
      title: '14-HOUR NATURAL FERMENT',
      quote: '“Undisturbed under brass covers overnight.”',
      img: './images/ferment.jpg',
      desc: 'Rested in dark brass cauldrons overnight. Natural lactobacillus ferment doubles the batter in volume, creating thousands of airy micro-bubbles.',
    },
    {
      step: 4,
      badge: '04 / 06',
      time: '05:30 AM',
      tag: 'CHAPTER FOUR • VAPOR',
      title: 'ATMOSPHERIC STEAM VAPOR',
      quote: '“Billowy clouds of 100°C steam vapor.”',
      img: './images/steam.jpg',
      desc: 'Poured into perforated brass steamer plates stretched with pristine white cotton cloth. Steamed under intense vapor for 12 minutes.',
    },
    {
      step: 5,
      badge: '05 / 06',
      time: '06:15 AM',
      tag: 'CHAPTER FIVE • TAWA ROAST',
      title: 'CAST IRON TAWA ROAST',
      quote: '“Golden ghee lattice crispiness.”',
      img: './images/tawa.jpg',
      desc: 'Ladled onto seasoned 400°F heavy cast iron tawas, swirled in concentric circles with pure cow ghee until razor-thin golden lattices form.',
    },
    {
      step: 6,
      badge: '06 / 06',
      time: '06:30 AM',
      tag: 'GRAND FINALE • MORNING TABLE',
      title: 'SERVED ON BANANA LEAF',
      quote: '“Weightless warmth, fragrant spices & hot filter coffee.”',
      img: './images/final_spread.jpg',
      desc: 'Harvested fresh from steam & tawa directly onto fresh green banana leaves with triple chutneys, drumstick sambar, and hot brass filter coffee.',
    },
  ];

  let currentStepIndex = 0;

  function updateStep(index) {
    currentStepIndex = index;
    const data = craftSteps[index];

    nodes.forEach((node, i) => {
      if (i <= index) node.classList.add('active');
      else node.classList.remove('active');
      if (i === index) {
        node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    if (fillBar) {
      const pct = ((index + 1) / craftSteps.length) * 100;
      fillBar.style.width = `${pct}%`;
    }

    if (!activeCard) return;

    gsap.to(activeCard, {
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      onComplete: () => {
        if (cardImg) cardImg.src = data.img;
        if (stepBadge) stepBadge.textContent = data.badge;
        if (timeBadge) timeBadge.textContent = data.time;
        if (cardTag) cardTag.textContent = data.tag;
        if (cardTitle) cardTitle.textContent = data.title;
        if (cardQuote) cardQuote.textContent = data.quote;
        if (cardDesc) cardDesc.textContent = data.desc;

        activeCard.setAttribute('data-time', data.time);
        activeCard.setAttribute('data-title', `${data.badge} — ${data.title}`);
        activeCard.setAttribute('data-desc', data.desc);

        gsap.to(activeCard, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });
  }

  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => updateStep(idx));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIdx = (currentStepIndex - 1 + craftSteps.length) % craftSteps.length;
      updateStep(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIdx = (currentStepIndex + 1) % craftSteps.length;
      updateStep(newIdx);
    });
  }

  updateStep(0);
}

/* BANANA LEAF PLATE BUILDER */
function initLeafPlateBuilder() {
  const addButtons = document.querySelectorAll('.add-item-btn');
  const resetBtn = document.getElementById('reset-leaf');
  const container = document.getElementById('leaf-items-container');
  const emptyMsg = document.getElementById('empty-leaf-msg');

  const comfortEl = document.getElementById('comfort-score');
  const crispEl = document.getElementById('crisp-score');
  const joyEl = document.getElementById('joy-score');

  if (!container) return;

  const placedItems = [];

  const itemMeta = {
    idli: { label: 'Steamed Idli', icon: '⚪', comfort: 25, crisp: 0 },
    vada: { label: 'Medu Vada', icon: '🍩', comfort: 20, crisp: 35 },
    dosa: { label: 'Masala Dosa', icon: '🌯', comfort: 20, crisp: 45 },
    pongal: { label: 'Ven Pongal', icon: '🍲', comfort: 30, crisp: 0 },
    chutney: { label: 'Coconut Chutney', icon: '🥣', comfort: 15, crisp: 0 },
    sambar: { label: 'Spiced Sambar', icon: '🥘', comfort: 15, crisp: 0 },
    coffee: { label: 'Filter Coffee', icon: '☕', comfort: 25, crisp: 10 },
  };

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-item');
      if (itemMeta[type]) {
        placedItems.push(itemMeta[type]);
        renderLeaf();
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      placedItems.length = 0;
      renderLeaf();
    });
  }

  function renderLeaf() {
    if (!placedItems.length) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      container.innerHTML = '';
      if (emptyMsg) container.appendChild(emptyMsg);
      if (comfortEl) comfortEl.textContent = '0%';
      if (crispEl) crispEl.textContent = '0%';
      if (joyEl) joyEl.textContent = 'QUIET';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    container.innerHTML = '';

    let totalComfort = 0;
    let totalCrisp = 0;

    placedItems.forEach((item) => {
      totalComfort += item.comfort;
      totalCrisp += item.crisp;

      const div = document.createElement('div');
      div.className = 'placed-leaf-item';
      div.innerHTML = `<span>${item.icon}</span> <span>${item.label}</span>`;
      container.appendChild(div);
    });

    const cScore = Math.min(100, totalComfort);
    const crScore = Math.min(100, totalCrisp);

    if (comfortEl) comfortEl.textContent = `${cScore}%`;
    if (crispEl) crispEl.textContent = `${crScore}%`;

    if (joyEl) {
      if (cScore > 80 && crScore > 50) joyEl.textContent = 'ROYAL BLISS 🌟';
      else if (cScore > 50) joyEl.textContent = 'WARM & COMFY ☕';
      else joyEl.textContent = 'DELIGHTFUL 🍃';
    }
  }
}

/* SIGNATURE CALLOUTS */
function initSignatureCallouts() {
  const nodes = document.querySelectorAll('.callout-node');
  if (!nodes.length) return;

  ScrollTrigger.create({
    trigger: '#signature',
    start: 'top 50%',
    onEnter: () => {
      nodes.forEach((node, idx) => {
        setTimeout(() => { node.classList.add('visible'); }, idx * 250);
      });
    },
  });
}

/* PONGAL PARALLAX */
function initPongalParallax() {
  const section = document.getElementById('pongal');
  const pills = document.querySelectorAll('.pill-badge');
  if (!section || !pills.length) return;

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    pills.forEach((pill) => {
      const factor = parseFloat(pill.getAttribute('data-parallax') || '0.2');
      gsap.to(pill, { x: x * factor * 60, y: y * factor * 60, duration: 0.6, ease: 'power2.out' });
    });
  });
}

/* COFFEE BREW CALCULATOR */
function initBrewCalculator() {
  const presetBtns = document.querySelectorAll('.brew-preset-btn');
  const ratioEl = document.getElementById('stat-ratio');
  const tempEl = document.getElementById('stat-temp');
  const foamEl = document.getElementById('stat-foam');
  const brewBtn = document.getElementById('trigger-brew-anim');
  const fillWave = document.querySelector('.liquid-wave');
  const fillStatus = document.getElementById('brew-fill-status');

  const presets = {
    madras: { ratio: '70:30 Chicory', temp: '92°C Scalded', foam: '3.5 cm Crown' },
    mysore: { ratio: '80:20 Chicory', temp: '94°C Steam', foam: '4.0 cm Crown' },
    velvet: { ratio: '100% Plantation A', temp: '90°C Gentle', foam: '2.5 cm Crown' },
  };

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const pKey = btn.getAttribute('data-preset');
      if (presets[pKey]) {
        if (ratioEl) ratioEl.textContent = presets[pKey].ratio;
        if (tempEl) tempEl.textContent = presets[pKey].temp;
        if (foamEl) foamEl.textContent = presets[pKey].foam;
      }
    });
  });

  if (brewBtn && fillWave && fillStatus) {
    brewBtn.addEventListener('click', () => {
      fillStatus.textContent = 'BREWING DECOCTION...';
      fillWave.style.width = '0%';

      setTimeout(() => {
        fillWave.style.width = '100%';
        fillStatus.textContent = 'PERFECT FOAM BREW READY ☕';
      }, 100);
    });
  }
}

/* MENU HOVER PREVIEW */
function initMenuPreviewModal() {
  const modal = document.getElementById('menu-preview-modal');
  const modalImg = document.getElementById('menu-preview-img');
  const modalTitle = document.getElementById('menu-preview-title');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!modal || !menuItems.length) return;

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (modal.classList.contains('active')) {
      gsap.to(modal, { left: mouseX + 24, top: mouseY - 100, duration: 0.3, ease: 'power2.out' });
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const imgSrc = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;

      modal.style.left = `${mouseX + 24}px`;
      modal.style.top = `${mouseY - 100}px`;
      modal.classList.add('active');
    });

    item.addEventListener('mouseleave', () => { modal.classList.remove('active'); });
  });
}

/* DISH DETAIL CRAFT MODAL */
function initDishDetailModal() {
  const modal = document.getElementById('dish-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  const modalImg = document.getElementById('modal-dish-img');
  const modalTitle = document.getElementById('modal-dish-title');
  const modalSub = document.getElementById('modal-dish-sub');
  const modalStory = document.getElementById('modal-dish-story');
  const modalPairing = document.getElementById('modal-dish-pairing');

  const dishData = {
    idli: {
      title: 'IDLI',
      sub: '“Soft, warm and quietly comforting.”',
      img: './images/idli.jpg',
      story: 'Soaked for 6 slow hours in mountain spring water, stone-ground in traditional granite mills, and fermented naturally overnight under brass lids. Weightless, pillowy perfection.',
      pairing: 'Stone-ground Fresh Coconut Chutney & Piping Hot Drumstick Sambar',
    },
    vada: {
      title: 'MEDU VADA',
      sub: '“Crisp golden crust, soft aromatic heart.”',
      img: './images/vada.jpg',
      story: 'Fluffy urad dal batter whipped by hand with whole black peppercorns, crushed ginger, and curry leaves. Deep fried in small batches to golden crunch perfection.',
      pairing: 'Spiced Red Tomato Chutney & Coconut Dip',
    },
    pongal: {
      title: 'VEN PONGAL',
      sub: '“Ghee, pepper, cashew harmony.”',
      img: './images/pongal.jpg',
      story: 'Short grain rice and moong dal simmered together in earthen pots, finished with a boiling temper of pure cow ghee, crackling peppercorns, cumin, and fried cashews.',
      pairing: 'Rich Coconut Chutney & Filter Coffee',
    },
    dosa: {
      title: 'MASALA DOSA',
      sub: '“Golden crisp paper-thin craft.”',
      img: './images/dosa.jpg',
      story: 'Ladled onto seasoned black cast iron tawa grill, spread in concentric motion, roasted with pure ghee, and filled with fragrant turmeric mustard potato masala.',
      pairing: 'Triple Chutney Selection & Hot Sambar Bowl',
    },
    coffee: {
      title: 'FILTER COFFEE',
      sub: '“The iconic morning foam ritual.”',
      img: './images/coffee.jpg',
      story: 'Dark roasted Mysore beans blended with chicory, brewed through a brass drip filter, and aerated between tumbler and davara for a thick, velvety foam crown.',
      pairing: 'Hot Masala Dosa or Fresh Crisp Vada',
    },
  };

  const clickableDishes = document.querySelectorAll('.dish-card, .menu-item');
  clickableDishes.forEach((card) => {
    card.addEventListener('click', () => {
      const dId = card.getAttribute('data-dish-id') || 'idli';
      if (dishData[dId] && modal) {
        if (modalImg) modalImg.src = dishData[dId].img;
        if (modalTitle) modalTitle.textContent = dishData[dId].title;
        if (modalSub) modalSub.textContent = dishData[dId].sub;
        if (modalStory) modalStory.textContent = dishData[dId].story;
        if (modalPairing) modalPairing.textContent = dishData[dId].pairing;

        modal.classList.add('open');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => { modal.classList.remove('open'); });
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => { modal.classList.remove('open'); });
  }
}

/* UNIVERSAL POPUP MODAL CONTROLLER */
function initUniversalModal() {
  const modal = document.getElementById('universal-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('univ-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');
  const modalImg = document.getElementById('univ-img');
  const modalTag = document.getElementById('univ-tag');
  const modalTitle = document.getElementById('univ-title');
  const modalSub = document.getElementById('univ-sub');
  const modalDesc = document.getElementById('univ-desc');
  const modalInsight = document.getElementById('univ-insight');

  const kitchenStories = {
    tawa: {
      tag: 'KITCHEN ARTISAN',
      title: 'THE CAST IRON TAWA',
      sub: '“Seasoned over decades with pure cow ghee.”',
      img: './images/tawa.jpg',
      desc: 'Our heavy cast-iron tawas weigh over 18kg and maintain a continuous thermal equilibrium at 410°F. Ladled with freshly fermented batter and swirled with a custom brass ladle to form razor-crisp golden lattices.',
      insight: 'Hand-seasoned every evening with organic sesame oil and crushed shallots to build a non-stick natural patina.',
    },
    steam: {
      tag: 'KITCHEN ARTISAN',
      title: 'THE STEAM CHAMBER',
      sub: '“Gentle 100°C atmospheric vapor.”',
      img: './images/steam.jpg',
      desc: 'Traditional woven cotton cloth stretched over perforated brass plates. Steam passes through the cloth to gently lift the rice batter into ultra-light, cloud-soft idlis without drying out the moisture.',
      insight: 'Cloth steaming preserves 98% more internal humidity than metal molds, ensuring pillowy texture.',
    },
    chutney: {
      tag: 'KITCHEN ARTISAN',
      title: 'FRESH COCONUT CHUTNEY',
      sub: '“Ground fresh every 45 minutes.”',
      img: './images/hands.jpg',
      desc: 'Freshly grated mature coconut meat hand-pounded with green chilies, roasted chana dal, fresh ginger, and tempered with crackling mustard seeds & curry leaves in hot sesame oil.',
      insight: 'Never stored in refrigeration to preserve delicate, aromatic coconut oils.',
    },
    coffee: {
      tag: 'KITCHEN ARTISAN',
      title: 'BRASS FILTER COFFEE METER',
      sub: '“Slow drip percolation heritage.”',
      img: './images/coffee.jpg',
      desc: 'Dark-roasted Mysore Chikmagalur Arabica & Robusta beans combined with 15% chicory root. Percolation through double-perforated brass filters yields a thick, aromatic first-drip decoction.',
      insight: 'Aerated high-pour between davara & tumbler creates a velvety micro-foam crown.',
    },
    stone: {
      tag: 'KITCHEN ARTISAN',
      title: 'GRANITE WET STONE MILL',
      sub: '“Cold friction stone milling.”',
      img: './images/stone_grind.jpg',
      desc: 'Heavy natural Salem granite stones rotating slowly at 45 RPM. The low-friction rotation ensures batter temperature never exceeds 28°C during grinding, preserving wild yeasts for fermentation.',
      insight: 'Preserves natural enzymes for a rich, airy 14-hour natural ferment.',
    },
    crew: {
      tag: 'KITCHEN ARTISAN',
      title: 'THE MORNING CREW',
      sub: '“4:30 AM culinary dedication.”',
      img: './images/hero_breakfast.jpg',
      desc: 'A team of master craftsmen with over 35 years of collective breakfast heritage. Every dish is seasoned by human touch, memory, and an unwavering devotion to morning comfort.',
      insight: 'Over 800 breakfasts served every morning with artisanal consistency.',
    },
  };

  const ingredientStories = {
    rice: {
      tag: 'INGREDIENT DEEP DIVE',
      title: 'SONAMASURI SHORT GRAIN RICE',
      sub: '“Sourced from paddy fields fed by river streams.”',
      img: './images/rice_soak.jpg',
      desc: 'Aged for 12 months to lower starch moisture content. Yields exceptionally light batter that ferments evenly without heaviness.',
      insight: 'Soaked in natural mountain spring water for 6 full hours prior to wet grinding.',
    },
    pepper: {
      tag: 'INGREDIENT DEEP DIVE',
      title: 'TELLICHERRY BLACK PEPPERCORNS',
      sub: '“Sun-dried wild mountain peppercorns.”',
      img: './images/pongal.jpg',
      desc: 'Whole berries cracked coarsly at the moment of cooking. Releases fiery warmth and volatile essential oils that complement melted cow ghee.',
      insight: 'Directly sourced from organic biodiversity farms in Malabar.',
    },
    ghee: {
      tag: 'INGREDIENT DEEP DIVE',
      title: 'A2 VILAYATI COW GHEE',
      sub: '“Slow clarified golden elixir.”',
      img: './images/final_spread.jpg',
      desc: 'Simmered slowly in brass cauldrons until nutty, golden, and rich with granular texture. Imparts rich aroma to Ven Pongal and Crispy Masala Dosa.',
      insight: 'Hand-churned using traditional bilona curd churning methods.',
    },
    cashew: {
      tag: 'INGREDIENT DEEP DIVE',
      title: 'PANRUTI WHOLE CASHEWS',
      sub: '“Creamy, golden fried crunch.”',
      img: './images/pongal.jpg',
      desc: 'Large unbroken kernel cashews flash fried in boiling ghee until golden tan. Adds butteriness and nutty contrast to warm Ven Pongal.',
      insight: 'Sourced directly from coastal Tamil Nadu cashew groves.',
    },
    curry: {
      tag: 'INGREDIENT DEEP DIVE',
      title: 'FRESH MOUNTAIN CURRY LEAVES',
      sub: '“Pristine dawn hand-picked foliage.”',
      img: './images/hands.jpg',
      desc: 'Deep green, glossy leaves crushed slightly by hand before tempering to release pinene and caryophyllene aroma compounds into sizzling ghee.',
      insight: 'Harvested fresh every morning from local organic kitchen gardens.',
    },
  };

  const journalStories = {
    instagram: {
      tag: 'VISUAL GALLERY',
      title: 'MORNING LEAF VISUAL CHRONICLES',
      sub: '“A visual celebration of dawn, steam & spice.”',
      img: './images/hero_breakfast.jpg',
      desc: 'Explore high-definition food photography, morning kitchen documentary reels, and artisan stories updated daily on our visual showcase.',
      insight: 'Follow @morningleaf.culinary for daily dawn kitchen live updates.',
    },
    spotify: {
      tag: 'AUDIO AMBIENCE',
      title: 'DAWN RAGAS & COFFEE STEAM PLAYLIST',
      sub: '“Curated morning acoustic soundscapes.”',
      img: './images/coffee.jpg',
      desc: 'A calming mix of traditional veena melodies, ambient brown noise, gentle rainwater, and soft dawn acoustics designed for slow breakfast mornings.',
      insight: 'Available for streaming on all audio platforms under Morning Leaf Dawn Sessions.',
    },
    journal: {
      tag: 'EDITORIAL STORY',
      title: 'THE ART OF SLOW MORNINGS',
      sub: '“Why South Indian breakfast is a spiritual ritual.”',
      img: './images/final_spread.jpg',
      desc: 'An essay on the science of natural lactobacillus fermentation, thermal conductivity of cast iron, and why eating off fresh banana leaves elevates digestion.',
      insight: 'Printed quarterly in our limited-edition morning journal newspaper.',
    },
  };

  function openPopup(data) {
    if (modalImg) modalImg.src = data.img;
    if (modalTag) modalTag.textContent = data.tag || 'MORNING STORY';
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSub) modalSub.textContent = data.sub;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalInsight) modalInsight.textContent = data.insight;
    modal.classList.add('open');
  }

  document.querySelectorAll('.clickable-kitchen').forEach((el) => {
    el.addEventListener('click', () => {
      const kId = el.getAttribute('data-kitchen-id') || 'tawa';
      if (kitchenStories[kId]) openPopup(kitchenStories[kId]);
    });
  });

  document.querySelectorAll('.clickable-time').forEach((el) => {
    el.addEventListener('click', () => {
      const timeStr = el.getAttribute('data-time') || '06:30 AM';
      const titleStr = el.getAttribute('data-title') || 'Morning Ritual';
      const descStr = el.getAttribute('data-desc') || 'Behind the scenes dawn preparation.';
      openPopup({
        tag: `MORNING TIMELINE • ${timeStr}`,
        title: titleStr.toUpperCase(),
        sub: `“The ritual at ${timeStr}.”`,
        img: './images/hero_breakfast.jpg',
        desc: descStr,
        insight: 'Every morning follows exact culinary timing perfected over generations.',
      });
    });
  });

  document.querySelectorAll('.clickable-ingredient').forEach((el) => {
    el.addEventListener('click', () => {
      const ingId = el.getAttribute('data-ingredient') || 'rice';
      if (ingredientStories[ingId]) openPopup(ingredientStories[ingId]);
    });
  });

  document.querySelectorAll('.clickable-journal').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const jId = el.getAttribute('data-journal') || 'journal';
      if (journalStories[jId]) openPopup(journalStories[jId]);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  if (backdrop) backdrop.addEventListener('click', () => modal.classList.remove('open'));
}

/* VIP TABLE RESERVATION MODAL CONTROLLER */
function initReservationModal() {
  const modal = document.getElementById('reservation-modal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.open-reserve-modal, a[href="#visit"]');
  const closeBtn = document.getElementById('res-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');
  const form = document.getElementById('reservation-form');
  const successCard = document.getElementById('res-success-card');
  const doneBtn = document.getElementById('res-done-btn');

  const successMsg = document.getElementById('res-success-msg');
  const voucherRef = document.getElementById('res-voucher-ref');
  const voucherDetails = document.getElementById('res-voucher-details');

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('open-reserve-modal') || btn.getAttribute('href') === '#visit') {
        e.preventDefault();
        modal.classList.add('open');
        if (form) form.style.display = 'flex';
        if (successCard) successCard.style.display = 'none';
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name')?.value || 'Valued Guest';
      const guests = document.getElementById('res-guests')?.value || '2 Guests';
      const time = document.getElementById('res-time')?.value || '07:30 AM';
      const seat = document.getElementById('res-seat')?.value || 'Courtyard';

      const randomRef = 'ML-2026-' + Math.floor(1000 + Math.random() * 9000);

      if (successMsg) successMsg.textContent = `Warm greetings, ${name}! Your morning table is confirmed.`;
      if (voucherRef) voucherRef.textContent = `REF: #${randomRef}`;
      if (voucherDetails) voucherDetails.textContent = `${guests} • ${time} • ${seat}`;

      form.style.display = 'none';
      if (successCard) successCard.style.display = 'block';
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  if (backdrop) backdrop.addEventListener('click', () => modal.classList.remove('open'));
}

/* MOBILE DRAWER */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = drawer ? drawer.querySelector('.drawer-backdrop') : null;
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-reserve-btn');

  if (!toggleBtn || !drawer) return;

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* SOUNDSCAPE GENERATOR */
function initSoundscapeGenerator() {
  const soundBtn = document.getElementById('sound-toggle');
  const menu = document.getElementById('soundscape-menu');
  const options = document.querySelectorAll('.sound-opt');

  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu) menu.classList.toggle('open');
    if (!isPlaying) startSoundscape('brown');
  });

  options.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      options.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');

      const sType = opt.getAttribute('data-type');
      if (isPlaying) stopSoundscape();
      startSoundscape(sType);
    });
  });

  window.addEventListener('click', () => {
    if (menu) menu.classList.remove('open');
  });

  function startSoundscape(type = 'brown') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      
      const freqMap = { brown: 320, coffee: 550, tawa: 800 };
      filterNode.frequency.setValueAtTime(freqMap[type] || 320, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      isPlaying = true;
      soundBtn.classList.add('playing');
    } catch (err) {
      console.warn('AudioContext failed:', err);
    }
  }

  function stopSoundscape() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        soundBtn.classList.remove('playing');
      }, 500);
    }
  }
}

/* GENERAL SCROLL REVEALS */
function initGeneralScrollReveals() {
  const titles = document.querySelectorAll('.section-title, .section-subtitle');
  titles.forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  const cards = document.querySelectorAll('.dish-card, .kitchen-card');
  cards.forEach((card) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
    });
  });

  const finalBg = document.querySelector('.final-bg-img');
  if (finalBg) {
    gsap.to(finalBg, {
      scale: 1.15,
      scrollTrigger: {
        trigger: '.final-hero-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

/* LUXURY PRELOADER ANIMATION SYSTEM */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');

  if (!preloader) {
    document.body.classList.remove('loading');
    return;
  }

  const statusMessages = [
    { pct: 0, text: 'Selecting rain-fed short-grain rice & urad dal...' },
    { pct: 28, text: 'Grinding slowly on cold Salem granite stones...' },
    { pct: 55, text: 'Fermenting 14 hours in brass cauldrons overnight...' },
    { pct: 80, text: 'Brewing fresh brass filter coffee decoction...' },
    { pct: 96, text: 'Welcome to Morning Leaf.' },
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 6;
    if (progress > 100) progress = 100;

    if (loaderPercent) loaderPercent.textContent = progress;
    if (loaderBar) loaderBar.style.width = `${progress}%`;

    // Dynamic status text update
    for (let i = statusMessages.length - 1; i >= 0; i--) {
      if (progress >= statusMessages[i].pct) {
        if (loaderStatus && loaderStatus.textContent !== statusMessages[i].text) {
          loaderStatus.textContent = statusMessages[i].text;
        }
        break;
      }
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          scale: 1.03,
          duration: 0.24,
          ease: 'power2.out',
          onComplete: () => {
            preloader.classList.add('fade-out');
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            ScrollTrigger.refresh();
          },
        });
      }, 60);
    }
  }, 25);
}
