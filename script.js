/**
 * ============================================================
 * Cool Breeze AC Solutions — script.js
 * Author: Cool Breeze Dev Team
 * Features:
 *   1. Navbar color change on scroll
 *   2. Scroll-to-top button visibility + click
 *   3. Active nav-link highlighting on scroll
 *   4. Contact form validation
 *   5. IntersectionObserver scroll-in animations
 *   6. "Buy Now" cart toast notification
 *   7. Smooth scroll for anchor links (progressive enhancement)
 * ============================================================
 */

/* ============================================================
   1. DOM READY — entry point
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollTopBtn();
  initActiveNavLink();
  initContactForm();
  initScrollAnimations();
  initSmoothScroll();
});


/* ============================================================
   2. NAVBAR — change background on scroll
   ============================================================ */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  // Run once on load (in case user refreshes mid-page)
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}


/* ============================================================
   3. SCROLL-TO-TOP BUTTON
   ============================================================ */
function initScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  // Click handler — smooth scroll to top
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   4. ACTIVE NAV LINK — highlight based on scroll position
   ============================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px', // trigger when section is in the middle
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ============================================================
   5. CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);

  // Real-time validation: clear error when user starts typing
  ['f-name', 'f-email', 'f-phone', 'f-message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => clearFieldError(field, `err-${id.replace('f-', '')}`));
    }
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('f-name');
  const email   = document.getElementById('f-email');
  const phone   = document.getElementById('f-phone');
  const message = document.getElementById('f-message');

  // Clear all errors first
  clearAllErrors();

  let isValid = true;

  // --- Name validation ---
  if (!name.value.trim()) {
    showError(name, 'err-name', 'Please enter your full name.');
    isValid = false;
  } else if (name.value.trim().length < 3) {
    showError(name, 'err-name', 'Name must be at least 3 characters.');
    isValid = false;
  }

  // --- Email validation ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, 'err-email', 'Please enter your email address.');
    isValid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError(email, 'err-email', 'Please enter a valid email address.');
    isValid = false;
  }

  // --- Phone validation ---
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number
  const phoneClean = phone.value.replace(/[\s\-+]/g, '').replace(/^91/, ''); // strip +91 or 91 prefix
  if (!phone.value.trim()) {
    showError(phone, 'err-phone', 'Please enter your phone number.');
    isValid = false;
  } else if (!phoneRegex.test(phoneClean)) {
    showError(phone, 'err-phone', 'Enter a valid 10-digit Indian mobile number.');
    isValid = false;
  }

  // --- Message validation ---
  if (!message.value.trim()) {
    showError(message, 'err-message', 'Please describe your issue or requirement.');
    isValid = false;
  } else if (message.value.trim().length < 10) {
    showError(message, 'err-message', 'Message must be at least 10 characters.');
    isValid = false;
  }

  // --- If valid, show success ---
  if (isValid) {
    simulateFormSubmit(e.target);
  }
}

/**
 * Simulate form submission (replace with real API call if needed)
 * @param {HTMLFormElement} form
 */
function simulateFormSubmit(form) {
  const submitBtn = form.querySelector('.btn-submit');
  const successDiv = document.getElementById('formSuccess');

  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

  // Simulate async request (1.5s delay)
  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Submit Request';

    // Show success message
    if (successDiv) {
      successDiv.classList.remove('d-none');
      // Auto-hide after 5 seconds
      setTimeout(() => successDiv.classList.add('d-none'), 5000);
    }

    // Scroll to success message smoothly
    successDiv && successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
}

/** Show an error on a field */
function showError(field, errId, message) {
  field.classList.add('error');
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = message;
}

/** Clear error from a single field */
function clearFieldError(field, errId) {
  field.classList.remove('error');
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = '';
}

/** Clear all form errors */
function clearAllErrors() {
  document.querySelectorAll('.cb-input').forEach(f => f.classList.remove('error'));
  document.querySelectorAll('.form-err').forEach(e => e.textContent = '');
}


/* ============================================================
   6. SCROLL-IN ANIMATIONS (IntersectionObserver)
      Adds .visible class to elements with .service-animate
      and .product-animate classes.
   ============================================================ */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.service-animate, .product-animate');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once visible so animation only plays once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
}


/* ============================================================
   7. SMOOTH SCROLL — for all nav anchor links
      (CSS scroll-behavior covers modern browsers, but this
       adds support for older ones and collapses mobile menu)
   ============================================================ */
function initSmoothScroll() {
  const navbarCollapse = document.getElementById('navMenu');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // skip empty links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Collapse mobile navbar if open
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      // Offset for fixed navbar height (~70px)
      const navbarHeight = document.getElementById('mainNav')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}


/* ============================================================
   8. PRODUCT "BUY NOW" — Cart Toast Notification
      Called from onclick="addToCart(this)" in HTML
   ============================================================ */
function addToCart(btn) {
  const toast = document.getElementById('cartToast');
  if (!toast) return;

  // Animate button briefly
  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-check2 me-1"></i>Added!';

  // Show toast
  toast.classList.remove('d-none');

  // Reset everything after delay
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalText;
    toast.classList.add('d-none');
  }, 2800);
}
