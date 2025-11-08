// =====================================================
// CONTACT.JS – Cinematic Fog + Contact Reveal (Hero Pin Version)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const hero = document.querySelector(".mountain-section");
  const contact = document.querySelector(".contact-section");
  const footer = document.querySelector("footer");
  if (!hero || !contact) return;

  // ======================
  // 1️⃣ DARK FOG LIFT REVEAL
  // ======================

  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.classList.add("dark-smoke-layer");
  hero.appendChild(smokeCanvas);

  const ctx = smokeCanvas.getContext("2d");
  let w, h, smokes = [];

  function resize() {
    w = smokeCanvas.width = hero.offsetWidth;
    h = smokeCanvas.height = hero.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Generate fog particles
  for (let i = 0; i < 80; i++) {
    smokes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 200 + 100,
      growth: Math.random() * 0.3 + 0.2,
      alpha: Math.random() * 0.4 + 0.2,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.8) * 0.5
    });
  }

  function drawSmoke() {
    ctx.fillStyle = "rgba(17,26,24,0.06)";
    ctx.fillRect(0, 0, w, h);

    smokes.forEach(s => {
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, `rgba(17,26,24,${s.alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      s.x += s.driftX;
      s.y += s.driftY;
      s.r += s.growth;
      s.alpha *= 0.995;

      // Reset fog particle when faded or too large
      if (s.r > 400 || s.alpha < 0.05) {
        s.x = Math.random() * w;
        s.y = h + 100;
        s.r = Math.random() * 120 + 60;
        s.alpha = Math.random() * 0.4 + 0.3;
      }
    });

    requestAnimationFrame(drawSmoke);
  }

  drawSmoke();

  // ======================
  // 2️⃣ HERO PIN + FOG LIFT SEQUENCE
  // ======================
  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=120%",
      scrub: 1.5,
      pin: true,
      anticipatePin: 1
    }
  });

  heroTimeline
    .fromTo(hero, { filter: "brightness(0.5) blur(10px)" }, { filter: "brightness(1) blur(0px)", duration: 2 })
    .fromTo(smokeCanvas, { opacity: 1 }, { opacity: 0, y: -200, duration: 3, ease: "power2.inOut" }, "<")
    .to(".mountain-svg", { opacity: 1, duration: 2, ease: "power2.out" }, "-=1");

  // ======================
  // 3️⃣ POST-PIN REVEAL (After fog clears)
  // ======================
  gsap.delayedCall(3.8, () => {
    smokeCanvas.remove();
    hero.classList.add("animate-in");

    // Reveal contact section smoothly
    gsap.to(contact, {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: "power2.out"
    });

    // Auto-scroll to contact section
    gsap.delayedCall(0.8, () => {
      window.scrollTo({ top: hero.offsetHeight - 80, behavior: "smooth" });
    });

    // TIMELINE: Breeze-style reveal of text + form
    const tl = gsap.timeline({ delay: 0.8, defaults: { ease: "power2.out" } });
    tl.from(".contact-label", { opacity: 0, y: 30, duration: 0.8 })
      .from(".title-group h2", { opacity: 0, y: 30, duration: 0.8 }, "-=0.4")
      .from(".decorative-elements", { opacity: 0, scale: 0.8, duration: 1, ease: "elastic.out(1, 0.6)" }, "-=0.4")
      .from(".contact-info p", { opacity: 0, y: 20, stagger: 0.2, duration: 0.8 }, "-=0.5")
      .from(".contact-form", { opacity: 0, y: 40, duration: 1.2 }, "-=0.3");
  });

  // ======================
  // 4️⃣ FLOATING ELEMENTS (infinite subtle motion)
  // ======================
  gsap.to(".logo-image", {
    y: 10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".circle", {
    x: 5,
    y: -5,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // ======================
  // 5️⃣ SCROLLTRIGGER ANIMATIONS
  // ======================

  // Footer reveal once (no pop)
  gsap.from(footer, {
    scrollTrigger: {
      trigger: footer,
      start: "top 90%",
      toggleActions: "play none none none",
      once: true
    },
    opacity: 0,
    y: 80,
    duration: 1.5,
    ease: "power3.out"
  });

  // Contact form parallax drift (smooth scrub effect)
  gsap.to(".contact-form", {
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5
    },
    y: -40,
    ease: "none"
  });
});
