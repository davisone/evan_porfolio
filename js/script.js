// --- Barre de progression de lecture ---
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-bar").style.width = scrollPercent + "%";
});

// --- Fonctions modals et sliders ---
const slideIndexMap = {}; // Pour les sliders

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'block';

  const slides = modal.querySelectorAll('.slides-container img');
  if (slides.length > 0) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[0].classList.add('active');
    slideIndexMap[id] = 0;
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function changeSlide(modalId, direction) {
  const container = document.querySelector(`#${modalId} .slides-container`);
  const slides = container.querySelectorAll('img');

  if (!slideIndexMap[modalId]) slideIndexMap[modalId] = 0;

  slides[slideIndexMap[modalId]].classList.remove('active');
  slideIndexMap[modalId] += direction;

  if (slideIndexMap[modalId] < 0) slideIndexMap[modalId] = slides.length - 1;
  if (slideIndexMap[modalId] >= slides.length) slideIndexMap[modalId] = 0;

  slides[slideIndexMap[modalId]].classList.add('active');
}

function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// --- DOM Ready (tout le reste) ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Menu burger ---
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    burger.classList.toggle('active'); // animation croix
  });

  // Fermer le menu après clic sur un lien
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      burger.classList.remove('active');
    });
  });
}


  // --- Lien actif selon la section visible ---
  const sections = document.querySelectorAll("section[id], header[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // --- Animations au scroll (apparition des éléments) ---
  const animatedElements = document.querySelectorAll(".animate-fade, .animate-slide");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(el => observer.observe(el));

  // --- Animation des barres de compétences ---
  const skillsSection = document.querySelector("#competences");
  const progressBars = document.querySelectorAll(".progress-bar-fill");
  let hasAnimated = false;

  const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        progressBars.forEach(bar => {
          const target = bar.getAttribute("data-percentage");
          bar.style.width = target + "%";
        });
        hasAnimated = true;
      }
    });
  }, {
    threshold: 0.3
  });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
});
