// =====================================================
// CONTACT-ANIMATIONS.JS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // HERO TIMELINE ANIMATION ============================
  const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 1.2 } });

  heroTimeline
    .from(".mountain-section h1", { y: 100, opacity: 0 })
    .from(".mountain-section h2", { y: 50, opacity: 0 }, "-=0.8")
    .from(".mountain-svg", { opacity: 0, scale: 0.95 }, "-=0.6");

  // MOTION PATH (Floating rock symbol) ==================
  const floatingRock = document.createElement("div");
  floatingRock.classList.add("floating-rock");
  document.body.appendChild(floatingRock);

  gsap.set(floatingRock, {
    width: 25,
    height: 25,
    background: "#A5744E",
    borderRadius: "50%",
    position: "absolute",
    top: "60%",
    left: "20%",
    opacity: 0.8,
    boxShadow: "0 0 10px rgba(165,116,78,0.5)"
  });

  gsap.to(floatingRock, {
    motionPath: {
      path: [
        { x: 100, y: -80 },
        { x: 300, y: 0 },
        { x: 500, y: -60 },
        { x: 700, y: 20 },
      ],
      curviness: 1.5,
      autoRotate: false
    },
    ease: "sine.inOut",
    duration: 10,
    repeat: -1,
    yoyo: true
  });

  // SCROLLTRIGGER ANIMATIONS ============================
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".contact-section", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 1
  });

  gsap.to(".contact-left", {
    scrollTrigger: {
      trigger: ".contact-left",
      start: "top 85%"
    },
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.to(".contact-right", {
    scrollTrigger: {
      trigger: ".contact-right",
      start: "top 85%"
    },
    x: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.to("footer", {
    scrollTrigger: {
      trigger: "footer",
      start: "top 90%"
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  });

  // CANVAS BACKGROUND ==================================
  const canvas = document.createElement("canvas");
  canvas.classList.add("hero-canvas");
  document.querySelector(".mountain-section").appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let particles = [];
  let w, h;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(165,116,78,0.35)";
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
});
