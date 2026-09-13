// Hero background slideshow
var heroBg = document.getElementById('heroBg');
if (heroBg) {
  var heroImages = [
    'images/hero-1.jpg',
    'images/hero-2.jpg',
    'images/hero-3.jpg',
    'images/hero-4.jpg'
  ];
  var layers = heroBg.querySelectorAll('.hero-bg-layer');
  var activeLayer = 0;
  var nextImage = 2;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (layers.length === 2 && heroImages.length > 2 && !reduceMotion) {
    setInterval(function () {
      var idleLayer = activeLayer === 0 ? 1 : 0;
      layers[idleLayer].style.backgroundImage = "url('" + heroImages[nextImage] + "')";
      layers[idleLayer].classList.add('active');
      layers[activeLayer].classList.remove('active');
      activeLayer = idleLayer;
      nextImage = (nextImage + 1) % heroImages.length;
    }, 5000);
  }
}

// Footer year
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Mobile nav toggle
var navToggle = document.getElementById('navToggle');
var navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Upcoming events (reads events.json, generated from events/ by scripts/build_events.py)
var eventsGrid = document.getElementById('eventsGrid');
if (eventsGrid) {
  var eventsEmpty = document.getElementById('eventsEmpty');
  fetch('events.json', { cache: 'no-store' })
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (events) {
      var today = new Date().toISOString().slice(0, 10);
      var upcoming = events.filter(function (e) { return !e.expires || e.expires >= today; });

      if (upcoming.length === 0) {
        eventsEmpty.hidden = false;
        return;
      }

      upcoming.forEach(function (event) {
        var card = document.createElement('figure');
        card.className = 'event-card';

        var img = document.createElement('img');
        img.src = event.image;
        img.alt = event.title || 'Event flyer';
        card.appendChild(img);

        eventsGrid.appendChild(card);
      });
    })
    .catch(function () { eventsEmpty.hidden = false; });
}

// EmailJS setup shared by the contact form (index.html) and the survey
// (survey/index.html). Same account/public key/service for both; each
// form has its own template since their fields differ.
var EMAILJS_PUBLIC_KEY = 'xffaqQw6sW_Na69o3';
var EMAILJS_SERVICE_ID = 'service_bu9fdjj';
var EMAILJS_SURVEY_TEMPLATE_ID = 'template_m4mregh';
var EMAILJS_CONTACT_TEMPLATE_ID = 'template_2uxdp4k';

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// Contact form (index.html)
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  var contactStatus = document.getElementById('contactStatus');
  var contactSubmit = document.getElementById('contactSubmit');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: real visitors never see or fill this field, so if it has
    // a value, this submission is from a bot — pretend it succeeded and
    // quietly drop it instead of sending.
    var honeypot = contactForm.elements['company'];
    if (honeypot && honeypot.value) {
      contactForm.reset();
      contactStatus.textContent = "Thanks! Your message has been sent — we'll get back to you soon.";
      return;
    }

    contactSubmit.disabled = true;
    contactStatus.textContent = 'Sending...';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, contactForm)
      .then(function () {
        contactForm.reset();
        contactStatus.textContent = "Thanks! Your message has been sent — we'll get back to you soon.";
        contactSubmit.disabled = false;
      })
      .catch(function () {
        contactStatus.textContent = 'Something went wrong sending your message. Please try again, or reach out to us directly.';
        contactSubmit.disabled = false;
      });
  });
}

// Survey page (survey/index.html): conditional reveals + EmailJS submission
var surveyForm = document.getElementById('surveyForm');
if (surveyForm) {
  document.querySelectorAll('[data-reveals]').forEach(function (input) {
    input.addEventListener('change', function () {
      var target = document.getElementById(input.dataset.reveals);
      if (!target) return;
      target.hidden = !(input.value === 'yes' && input.checked);
    });
  });

  var surveyStatus = document.getElementById('surveyStatus');
  var surveySubmit = document.getElementById('surveySubmit');
  var surveyThanks = document.getElementById('surveyThanks');

  surveyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    surveySubmit.disabled = true;
    surveyStatus.textContent = 'Sending...';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_SURVEY_TEMPLATE_ID, surveyForm)
      .then(function () {
        surveyForm.hidden = true;
        surveyStatus.textContent = '';
        surveyThanks.hidden = false;
      })
      .catch(function () {
        surveyStatus.textContent = 'Something went wrong sending your response. Please try again, or let us know at the church.';
        surveySubmit.disabled = false;
      });
  });
}

// Gallery lightbox
var strip = document.getElementById('galleryStrip');
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxClose = document.getElementById('lightboxClose');

if (strip && lightbox && lightboxImg && lightboxClose) {
  strip.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}
