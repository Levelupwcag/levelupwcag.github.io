(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    setupSmoothScroll();
    setupMobileMenu();
    setupSectionAnimations();
    setupCounters();
    setupProgressBars();
    setupFaq();
    setupForm();
  });

  function setCurrentYear() {
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
      yearElement.textContent = `© ${new Date().getFullYear()}`;
    }
  }

  function setupSmoothScroll() {
    const triggers = document.querySelectorAll('a[href^="#"], [data-scroll-target]');

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        const selector = trigger.hasAttribute("data-scroll-target")
          ? trigger.getAttribute("data-scroll-target")
          : trigger.getAttribute("href");

        if (!selector || selector === "#") return;

        const target = document.querySelector(selector);
        if (!target) return;

        event.preventDefault();
        scrollToTarget(target);
      });
    });
  }

  function scrollToTarget(target) {
    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 12 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }

  function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.classList.toggle("is-open", !isOpen);
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("is-open");
        mobileMenu.hidden = true;
      });
    });
  }

  function setupSectionAnimations() {
    const items = document.querySelectorAll(".section-animate");
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.remove("is-ready"));
      return;
    }

    items.forEach((item) => item.classList.add("is-ready"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupCounters() {
    const counters = document.querySelectorAll(".count-up");
    if (!counters.length) return;

    if (prefersReducedMotion) return;

    counters.forEach((counter) => {
      counter.dataset.finalText = counter.textContent.trim();
    });

    const resultsSummary = document.getElementById("results-summary");
    let resultsStarted = false;

    const generalCounters = Array.from(counters).filter((counter) => {
      return !resultsSummary || !resultsSummary.contains(counter);
    });

    if (generalCounters.length) {
      const generalObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            prepareCounter(entry.target);
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15 }
      );

      generalCounters.forEach((counter) => generalObserver.observe(counter));
    }

    if (resultsSummary) {
      const resultsObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || resultsStarted) return;
            resultsStarted = true;

            const resultCounters = resultsSummary.querySelectorAll(".count-up");
            resultCounters.forEach((counter) => {
              prepareCounter(counter);
              animateCounter(counter);
            });

            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15 }
      );

      resultsObserver.observe(resultsSummary);
    }
  }

  function prepareCounter(counter) {
    if (counter.dataset.prepared === "true") return;

    const format = counter.dataset.format || "integer";
    counter.dataset.prepared = "true";

    if (format === "percent") {
      counter.textContent = "0%";
      return;
    }

    if (format === "fraction") {
      const denominator = counter.dataset.denominator || "0";
      counter.textContent = `0/${denominator}`;
      return;
    }

    if (format === "decimal-suffix") {
      const suffix = counter.dataset.suffix || "";
      counter.textContent = `0${suffix}`;
      return;
    }

    counter.textContent = "0";
  }

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const format = counter.dataset.format || "integer";
    const target = Number(counter.dataset.target || 0);
    const denominator = counter.dataset.denominator || "";
    const suffix = counter.dataset.suffix || "";
    const duration = 1200;
    const interval = 16;
    const steps = Math.max(1, Math.round(duration / interval));
    let currentStep = 0;

    const timer = window.setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);
      const currentValue = target * progress;

      if (format === "percent") {
        counter.textContent = `${Math.round(currentValue)}%`;
      } else if (format === "fraction") {
        counter.textContent = `${Math.round(currentValue)}/${denominator}`;
      } else if (format === "decimal-suffix") {
        counter.textContent = `${currentValue.toFixed(1)}${suffix}`;
      } else {
        counter.textContent = `${Math.round(currentValue)}`;
      }

      if (progress >= 1) {
        window.clearInterval(timer);

        if (counter.dataset.finalText) {
          counter.textContent = counter.dataset.finalText;
        } else if (format === "percent") {
          counter.textContent = `${Math.round(target)}%`;
        } else if (format === "fraction") {
          counter.textContent = `${Math.round(target)}/${denominator}`;
        } else if (format === "decimal-suffix") {
          counter.textContent = `${target.toFixed(1)}${suffix}`;
        } else {
          counter.textContent = `${Math.round(target)}`;
        }
      }
    }, interval);
  }

  function setupProgressBars() {
    const cards = document.querySelectorAll(".progress-card");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      const fill = card.querySelector(".progress-fill");
      if (fill) {
        fill.style.width = "0%";
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fill = entry.target.querySelector(".progress-fill");
          if (fill) {
            fill.style.width = "100%";
          }
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  function setupFaq() {
    const questions = document.querySelectorAll(".faq-question");
    if (!questions.length) return;

    questions.forEach((button) => {
      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        questions.forEach((otherButton) => {
          const panelId = otherButton.getAttribute("aria-controls");
          const panel = panelId ? document.getElementById(panelId) : null;

          otherButton.setAttribute("aria-expanded", "false");
          if (panel) {
            panel.hidden = true;
            panel.classList.remove("is-open");
          }
        });

        if (!isExpanded) {
          const panelId = button.getAttribute("aria-controls");
          const panel = panelId ? document.getElementById(panelId) : null;

          button.setAttribute("aria-expanded", "true");
          if (panel) {
            panel.hidden = false;
            panel.classList.add("is-open");
          }
        }
      });
    });
  }

  function setupForm() {
    const form = document.getElementById("audit-request-form");
    const successBox = document.getElementById("form-success");
    if (!form || !successBox) return;

    const fields = {
      fullName: document.getElementById("full-name"),
      email: document.getElementById("email-address"),
      whatsapp: document.getElementById("whatsapp-number"),
      website: document.getElementById("website-url")
    };

    const errorElements = {
      fullName: document.getElementById("full-name-error"),
      email: document.getElementById("email-address-error"),
      whatsapp: document.getElementById("whatsapp-number-error"),
      website: document.getElementById("website-url-error")
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const values = {
        fullName: fields.fullName.value.trim(),
        email: fields.email.value.trim(),
        whatsapp: fields.whatsapp.value.trim(),
        website: fields.website.value.trim()
      };

      let hasErrors = false;

      clearErrors(fields, errorElements);

      if (!values.fullName) {
        setError(fields.fullName, errorElements.fullName, "Please enter your full name.");
        hasErrors = true;
      }

      if (!values.email) {
        setError(fields.email, errorElements.email, "Please enter your email address.");
        hasErrors = true;
      } else if (!isValidEmail(values.email)) {
        setError(fields.email, errorElements.email, "Please enter a valid email address.");
        hasErrors = true;
      }

      if (!values.whatsapp) {
        setError(fields.whatsapp, errorElements.whatsapp, "Please enter your WhatsApp number.");
        hasErrors = true;
      } else if (!isValidPhone(values.whatsapp)) {
        setError(fields.whatsapp, errorElements.whatsapp, "Please enter a valid WhatsApp number.");
        hasErrors = true;
      }

      if (!values.website) {
        setError(fields.website, errorElements.website, "Please enter your website URL.");
        hasErrors = true;
      } else if (!isValidUrl(values.website)) {
        setError(fields.website, errorElements.website, "Please enter a valid website URL.");
        hasErrors = true;
      }

      if (hasErrors) {
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const lead = {
        ...values,
        submittedAt: new Date().toISOString()
      };

      saveLead(lead);

      form.hidden = true;
      successBox.hidden = false;
      successBox.focus();

      const whatsappMessage = [
        "Assalam o Alaikum, I want a free website audit.",
        `Full Name: ${values.fullName}`,
        `Email Address: ${values.email}`,
        `WhatsApp Number: ${values.whatsapp}`,
        `Website URL: ${values.website}`
      ].join("\n");

      window.setTimeout(() => {
        const whatsappUrl = `https://wa.me/923086324003?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }, 800);
    });
  }

  function clearErrors(fields, errorElements) {
    Object.values(fields).forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    });

    Object.values(errorElements).forEach((error) => {
      error.textContent = "";
    });
  }

  function setError(field, errorElement, message) {
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[+0-9()\-\s]{7,20}$/.test(value);
  }

  function isValidUrl(value) {
    try {
      const normalized = /^(https?:)?\/\//i.test(value) ? value : `https://${value}`;
      const url = new URL(normalized);
      return Boolean(url.hostname);
    } catch (error) {
      return false;
    }
  }

  function saveLead(lead) {
    const storageKey = "levelup_leads";
    let existingLeads = [];

    try {
      const raw = window.localStorage.getItem(storageKey);
      existingLeads = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(existingLeads)) {
        existingLeads = [];
      }
    } catch (error) {
      existingLeads = [];
    }

    existingLeads.push(lead);
    window.localStorage.setItem(storageKey, JSON.stringify(existingLeads));
  }
})();
