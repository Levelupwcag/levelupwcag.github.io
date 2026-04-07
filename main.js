// LevelUp WCAG — main.js

// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Scroll to form
function scrollToForm() {
  document.getElementById('audit-form').scrollIntoView({ behavior: 'smooth' });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', function () {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.hidden = isOpen;
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  });
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answerId = btn.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);

    // Close all
    document.querySelectorAll('.faq-q').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      const id = b.getAttribute('aria-controls');
      document.getElementById(id).hidden = true;
    });

    // Open clicked if it was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

// Form validation + submit
const form = document.getElementById('auditForm');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + 'Err');
  input.setAttribute('aria-invalid', 'true');
  err.textContent = message;
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + 'Err');
  input.removeAttribute('aria-invalid');
  err.textContent = '';
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const url = document.getElementById('siteUrl').value.trim();

  clearError('fullName');
  clearError('email');
  clearError('phone');
  clearError('siteUrl');

  if (!name) { showError('fullName', 'Please enter your full name.'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
  if (!phone) { showError('phone', 'Please enter your WhatsApp number.'); valid = false; }
  if (!url) { showError('siteUrl', 'Please enter your website URL.'); valid = false; }

  return valid;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const url = document.getElementById('siteUrl').value.trim();

  // Save to localStorage
  const leads = JSON.parse(localStorage.getItem('levelup_leads') || '[]');
  leads.push({ name, email, phone, url, date: new Date().toISOString() });
  localStorage.setItem('levelup_leads', JSON.stringify(leads));

  // WhatsApp redirect with pre-filled message
  const msg = encodeURIComponent(
    'New Free Audit Request:\n\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Phone: ' + phone + '\n' +
    'Website: ' + url
  );
  const waUrl = 'https://wa.me/923086324003?text=' + msg;

  // Show success message
  form.hidden = true;
  formSuccess.hidden = false;
  formSuccess.focus();

  // Open WhatsApp after short delay
  setTimeout(function () {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }, 800);
});

// Sticky header shadow on scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });
