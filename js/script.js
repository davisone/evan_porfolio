// --- Barre de progression de lecture ---
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-bar").style.width = scrollPercent + "%";
});

// --- Fonctions modals et sliders ---
const slideIndexMap = {};

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'block';
  const slides = modal.querySelectorAll('.slides-container img');
  if (slides.length > 0) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[0].classList.add('active');
    slideIndexMap[id] = 0;
  }

  // Focus sur le bouton de fermeture pour l'accessibilité
  const closeButton = modal.querySelector('.close');
  if (closeButton) {
    closeButton.focus();
  }

  // Piéger le focus dans le modal
  trapFocus(modal);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'none';

  // Retirer l'écouteur d'événement Escape
  document.removeEventListener('keydown', handleModalEscape);
}

// Fonction pour gérer la touche Escape
function handleModalEscape(event) {
  if (event.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
    openModals.forEach(modal => {
      modal.style.display = 'none';
    });
    document.removeEventListener('keydown', handleModalEscape);
  }
}

// Fonction pour piéger le focus dans le modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Ajouter l'écouteur pour Escape
  document.addEventListener('keydown', handleModalEscape);
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

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
  // Event listeners pour les modals de projets
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      const projectId = `project${index + 1}`;
      openModal(projectId);
    });
    // Rendre les cards accessibles au clavier
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = `project${index + 1}`;
        openModal(projectId);
      }
    });
  });

  // Event listeners pour les boutons de fermeture des modals
  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      closeModal(modal.id);
    });
  });

  // Event listeners pour les boutons prev/next des sliders
  document.querySelectorAll('.slider .prev').forEach(prevBtn => {
    prevBtn.addEventListener('click', () => {
      const modal = prevBtn.closest('.modal');
      changeSlide(modal.id, -1);
    });
  });

  document.querySelectorAll('.slider .next').forEach(nextBtn => {
    nextBtn.addEventListener('click', () => {
      const modal = nextBtn.closest('.modal');
      changeSlide(modal.id, 1);
    });
  });

  // Event listeners pour les images dans les sliders (lightbox)
  document.querySelectorAll('.slides-container img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
    // Rendre les images accessibles au clavier
    img.setAttribute('tabindex', '0');
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src);
      }
    });
  });

  // Event listener pour fermer le lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
  }

  // Menu burger
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('show');
      burger.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Lien actif selon la section visible
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

  // Animation au scroll
  const animatedElements = document.querySelectorAll(".animate-fade, .animate-slide");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => observer.observe(el));

  // Animation des barres de compétences
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
  }, { threshold: 0.3 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Formulaire contact (Formspree)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Supprimer les anciens messages d'erreur
      const oldMessage = contactForm.querySelector(".form-message");
      if (oldMessage) {
        oldMessage.remove();
      }

      const message = document.createElement("p");
      message.classList.add("form-message");
      message.setAttribute("role", "status");
      message.setAttribute("aria-live", "polite");

      try {
        const formData = new FormData(contactForm);

        // Validation côté client
        const name = formData.get("name");
        const email = formData.get("email");
        const messageText = formData.get("message");

        if (!name || name.trim().length < 2) {
          throw new Error("Veuillez entrer un nom valide (minimum 2 caractères).");
        }

        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          throw new Error("Veuillez entrer une adresse e-mail valide.");
        }

        if (!messageText || messageText.trim().length < 10) {
          throw new Error("Votre message doit contenir au moins 10 caractères.");
        }

        // Envoi du formulaire
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          contactForm.reset();
          message.textContent = "✓ Merci ! Votre message a bien été envoyé.";
          message.style.color = "green";
        } else {
          const errorData = await response.json().catch(() => null);
          const errorText = errorData?.error || "Une erreur s'est produite lors de l'envoi.";
          throw new Error(errorText);
        }
      } catch (error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          message.textContent = "✗ Erreur réseau. Vérifiez votre connexion et réessayez.";
        } else {
          message.textContent = `✗ ${error.message}`;
        }
        message.style.color = "red";
        console.error("Erreur formulaire:", error);
      }

      contactForm.appendChild(message);
      setTimeout(() => message.remove(), 7000);
    });
  }

  // Gérer les cookies depuis le footer
  const manageCookiesBtn = document.getElementById("manage-cookies");
  if (manageCookiesBtn) {
    manageCookiesBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("cookiesConsent");
      location.reload();
    });
  }

  // Bouton retour en haut
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Gestion du pop-up cookies
  const cookiePopup = document.getElementById("cookie-popup");
  const acceptCookies = document.getElementById("accept-cookies");
  const rejectCookies = document.getElementById("reject-cookies");
  const toggleMoreInfo = document.getElementById("toggle-more-info");
  const moreInfoBlock = document.getElementById("cookie-more-info");

  const consent = localStorage.getItem("cookiesConsent");
  if (!consent) {
    cookiePopup.style.display = "flex";
  } else if (consent === "accepted") {
    loadGoogleAnalytics();
  }

  acceptCookies?.addEventListener("click", () => {
    localStorage.setItem("cookiesConsent", "accepted");
    cookiePopup.style.display = "none";
    loadGoogleAnalytics();
  });

  rejectCookies?.addEventListener("click", () => {
    localStorage.setItem("cookiesConsent", "rejected");
    cookiePopup.style.display = "none";
  });

  toggleMoreInfo?.addEventListener("click", () => {
    moreInfoBlock.style.display = (moreInfoBlock.style.display === "none") ? "block" : "none";
  });
});

// --- Chargement de Google Analytics après consentement ---
function loadGoogleAnalytics() {
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-DC4DK4D1P2";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-DC4DK4D1P2', { anonymize_ip: true });
}
