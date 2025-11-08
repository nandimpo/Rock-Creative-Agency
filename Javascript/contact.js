document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const hero = document.querySelector(".mountain-section");
  const contact = document.querySelector(".contact-section");
  const footer = document.querySelector("footer");
  if (!hero || !contact) return;

  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.classList.add("dark-smoke-layer");
  hero.appendChild(smokeCanvas);

  const ctx = smokeCanvas.getContext("2d");
  let w, h, smokes = [];
  let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    w = smokeCanvas.width = hero.offsetWidth;
    h = smokeCanvas.height = hero.offsetHeight;
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  for (let i = 0; i < 60; i++) {
    smokes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 150 + 80,
      growth: Math.random() * 0.2 + 0.1,
      alpha: Math.random() * 0.3 + 0.2,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.8) * 0.3
    });
  }

  function drawSmoke() {
    ctx.fillStyle = "rgba(17,26,24,0.05)";
    ctx.fillRect(0, 0, w, h);

    for (let s of smokes) {
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

      if (s.r > 350 || s.alpha < 0.05) {
        s.x = Math.random() * w;
        s.y = h + 80;
        s.r = Math.random() * 100 + 60;
        s.alpha = Math.random() * 0.3 + 0.3;
      }
    }

    requestAnimationFrame(drawSmoke);
  }

  if (!prefersReducedMotion) drawSmoke();

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=100%",
      scrub: 1.2,
      pin: true,
      anticipatePin: 1
    }
  });

  heroTimeline
    .fromTo(hero, { filter: "brightness(0.5) blur(8px)" }, { filter: "brightness(1) blur(0px)", duration: 2 })
    .fromTo(smokeCanvas, { opacity: 1 }, { opacity: 0, y: -150, duration: 2.5, ease: "power2.inOut" }, "<")
    .to(".mountain-svg", { opacity: 1, duration: 1.8, ease: "power2.out" }, "-=1");

  gsap.delayedCall(3, () => {
    smokeCanvas.remove();
    hero.classList.add("animate-in");

    gsap.to(contact, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power2.out"
    });

    gsap.delayedCall(0.7, () => {
      window.scrollTo({ top: hero.offsetHeight - 80, behavior: "smooth" });
    });

    const tl = gsap.timeline({ delay: 0.6, defaults: { ease: "power2.out" } });
    tl.from(".contact-label", { opacity: 0, y: 20, duration: 0.6 })
      .from(".title-group h2", { opacity: 0, y: 25, duration: 0.7 }, "-=0.3")
      .from(".decorative-elements", { opacity: 0, scale: 0.9, duration: 0.9, ease: "elastic.out(1, 0.6)" }, "-=0.3")
      .from(".contact-info p", { opacity: 0, y: 15, stagger: 0.15, duration: 0.6 }, "-=0.4")
      .from(".contact-form", { opacity: 0, y: 30, duration: 1 }, "-=0.2");
  });

  if (!prefersReducedMotion) {
    gsap.to(".logo-image", {
      y: 8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".circle", {
      x: 4,
      y: -4,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  gsap.from(footer, {
    scrollTrigger: {
      trigger: footer,
      start: "top 95%",
      toggleActions: "play none none none",
      once: true
    },
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.to(".contact-form", {
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2
    },
    y: -30,
    ease: "none"
  });
});

