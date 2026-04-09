const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = reducedMotionQuery.matches;

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupMobileMenu();
  setupSmoothScroll();
  setupRevealAnimations();
  setupProblemCounters();
  setupResultsCounters();
  setupCaseProgressBars();
  setupFaqAccordion();
  setupLeadForm();
});

function setCurrentYear() {
  const yearNode = document.getElementById("current-year");
  if (yearNode) {
    yearNode.textContent = `© ${new Date().getFullYear()}`;
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.classList.toggle("is-open", !isOpen);

    if (isOpen) {
      menu.hidden = true;
    } else {
      menu.hidden = false;
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-open");
      menu.hidden = true;
    });
  });
}

function setupSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"], [data-scroll-target]');

  scrollLinks.forEach((element) => {
    element.addEventListener("click", (event) => {
      let targetSelector = "";

      if (element.hasAttribute("data-scroll-target")) {
        targetSelector = element.getAttribute("data-scroll-target");
      } else {
        targetSelector = element.getAttribute("href");
      }

      if (!targetSelector || targetSelector === "#" || targetSelector === "#!") return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector(".site-header");
      const headerOffset = header ? header.offsetHeight + 16 : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) return;

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupProblemCounters() {
  const counters = document.querySelectorAll(".problem-stats .stat-value");
  if (!counters.length) return;

  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      setCounterFinalValue(counter);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, counterObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupResultsCounters() {
  const summary = document.querySelector("[data-results-summary]");
  const counters = document.querySelectorAll(".results-counter");
  if (!summary || !counters.length) return;

  let countersStarted = false;

  if (prefersReducedMotion) {
    counters.forEach((counter) => setCounterFinalValue(counter));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, summaryObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || countersStarted) return;
        countersStarted = true;
        counters.forEach((counter) => animateCounter(counter));
        summaryObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(summary);
}

function setupCaseProgressBars() {
  const caseCards = document.querySelectorAll(".progress-trigger");
  if (!caseCards.length) return;

  if (prefersReducedMotion) {
    caseCards.forEach((card) => card.classList.add("is-filled"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, cardObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-filled");
        cardObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  caseCards.forEach((card) => observer.observe(card));
}

function animateCounter(element) {
  if (!element || element.dataset.started === "true") return;

  element.dataset.started = "true";

  const type = element.dataset.counterType || "integer";
  const targetValue = Number(element.dataset.target || 0);
  const denominator = Number(element.dataset.denominator || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1200;
  const intervalTime = 16;
  const totalSteps = Math.max(1, Math.round(duration / intervalTime));
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep += 1;
    const progress = Math.min(currentStep / totalSteps, 1);
    const currentValue = targetValue *
