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

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
  // Menu burger
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      burger.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        burger.classList.remove('active');
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
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: { Accept: "application/json" }
      });

      const message = document.createElement("p");
      message.classList.add("form-message");

      if (response.ok) {
        contactForm.reset();
        message.textContent = "Merci ! Votre message a bien été envoyé.";
        message.style.color = "green";
      } else {
        message.textContent = "Une erreur s’est produite. Veuillez réessayer.";
        message.style.color = "red";
      }

      contactForm.appendChild(message);
      setTimeout(() => message.remove(), 5000);
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
