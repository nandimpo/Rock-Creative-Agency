// home.js
// Rock Creative Agency - Cinematic Earthy Scroll Experience
// Includes: Canvas transitions, particles, ambient sounds, camera shake, dynamic dust haze, sunlight shimmer

gsap.registerPlugin(ScrollTrigger);

//// === CANVAS SETUP === ////
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
let width, height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 999;
canvas.style.pointerEvents = "none";
canvas.style.opacity = 0;

//// === SOUND SETUP === ////
const sounds = {
  wind: new Audio("../Assets/Sounds/wind.mp3"),
  rumble: new Audio("../Assets/Sounds/rumble.mp3"),
  dust: new Audio("../Assets/Sounds/dust.mp3")
};

sounds.wind.loop = true;
sounds.wind.volume = 0.2;

// Unlock audio after first user interaction
document.addEventListener("click", () => {
  Object.values(sounds).forEach(s => s.play().then(() => s.pause()));
}, { once: true });

function playTransitionSound() {
  try {
    sounds.rumble.currentTime = 0;
    sounds.rumble.volume = 0.45;
    sounds.rumble.play();

    sounds.dust.currentTime = 0;
    sounds.dust.volume = 0.3;
    sounds.dust.play();

    if (sounds.wind.paused) sounds.wind.play();
    gsap.to(sounds.wind, { volume: 0.25, duration: 1.5 });
  } catch (err) {
    console.warn("Autoplay blocked until user interacts.");
  }
}

function fadeOutWind() {
  gsap.to(sounds.wind, { volume: 0.05, duration: 1.5 });
}

//// === CAMERA SHAKE === ////
function cameraShake(duration = 0.6, intensity = 8) {
  const tl = gsap.timeline();
  tl.to(window, {
    duration,
    onUpdate: () => {
      const x = (Math.random() - 0.5) * intensity;
      const y = (Math.random() - 0.5) * intensity;
      gsap.set(canvas, { x, y });
      gsap.set(document.body, { x, y });
    },
    onComplete: () => {
      gsap.set(canvas, { x: 0, y: 0 });
      gsap.set(document.body, { x: 0, y: 0 });
    }
  });
  return tl;
}

//// === PARTICLES === ////
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 3;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.size = Math.random() * 3 + 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function spawnParticles(color) {
  particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height / 2, color));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  particles = particles.filter((p) => p.alpha > 0);
  if (particles.length > 0) requestAnimationFrame(animateParticles);
}

//// === CANVAS REVEAL === ////
function canvasReveal({ colors, duration = 1.2, pattern = "horizontal" }) {
  gsap.set(canvas, { opacity: 1 });
  playTransitionSound();
  cameraShake(0.7, 10);
  spawnParticles(colors[0]);
  animateParticles();

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(canvas, { opacity: 0, duration: 0.8 });
      fadeOutWind();
    }
  });

  tl.to({ progress: 0 }, {
    progress: 1,
    duration,
    ease: "power2.inOut",
    onUpdate: function () {
      const progress = this.targets()[0].progress;
      ctx.clearRect(0, 0, width, height);

      if (pattern === "horizontal") {
        const bandHeight = height / colors.length;
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          const y = i * bandHeight * progress;
          ctx.fillRect(0, y, width, bandHeight);
        });
      } else if (pattern === "vertical") {
        const bandWidth = width / colors.length;
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          const x = i * bandWidth * progress;
          ctx.fillRect(x, 0, bandWidth, height);
        });
      } else if (pattern === "wave") {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        const waveHeight = 80;
        ctx.moveTo(0, height);
        for (let x = 0; x < width; x++) {
          ctx.lineTo(x, height / 2 + Math.sin(x * 0.02 + progress * 6.28) * waveHeight);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      }
    }
  });

  return tl;
}

//// === PARALLAX HERO === ////
gsap.to(".hero", {
  backgroundPositionY: "40%",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

//// === SECTION REVEALS === ////
function sectionReveal(trigger, colors, pattern = "horizontal") {
  ScrollTrigger.create({
    trigger: trigger,
    start: "top bottom",
    onEnter: () => canvasReveal({ colors, pattern })
  });
}

// Earthy transitions
sectionReveal(".who-we-are", ["#5a3c1a", "#4a7c8f", "#e8dcc8"], "horizontal");
sectionReveal(".what-we-do", ["#8db1bf", "#e8dcc8"], "wave");
sectionReveal(".our-work", ["#5a3c1a", "#c9b69d", "#e8dcc8"], "vertical");
sectionReveal(".our-services", ["#3a3a3a", "#4a7c8f", "#cbbda3"], "horizontal");
sectionReveal(".contact", ["#e8dcc8", "#d4c9b6"], "wave");

//// === TEXT + CTA REVEALS === ////
gsap.utils.toArray("section").forEach((section) => {
  const heading = section.querySelector("h2");
  const content = section.querySelectorAll("p, .btn, li, .service-tag");

  gsap.from([heading, ...content], {
    opacity: 0,
    y: 50,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

//// === CONTACT FORM === ////
gsap.from(".contact-form input, .contact-form textarea, .contact-form button", {
  opacity: 0,
  y: 40,
  duration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".contact",
    start: "top 80%"
  }
});

//// === DUST HAZE MOVEMENT === ////
const dustHaze = document.getElementById("dust-haze");

gsap.to(dustHaze, {
  backgroundPosition: "300px 600px",
  duration: 40,
  ease: "none",
  repeat: -1,
  yoyo: true
});

gsap.to(dustHaze, {
  opacity: 0.12,
  duration: 10,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

//// === DYNAMIC HAZE COLOR === ////
function setHazeColor(color) {
  gsap.to(dustHaze, { backgroundColor: color, duration: 2, ease: "power2.inOut" });
}

const hazeColors = {
  hero: "rgba(90, 60, 26, 0.15)",
  who: "rgba(74, 124, 143, 0.12)",
  what: "rgba(141, 177, 191, 0.12)",
  work: "rgba(201, 182, 157, 0.12)",
  services: "rgba(58, 58, 58, 0.12)",
  contact: "rgba(232, 220, 200, 0.1)"
};

ScrollTrigger.create({ trigger: ".hero", start: "top top", onEnter: () => setHazeColor(hazeColors.hero) });
ScrollTrigger.create({ trigger: ".who-we-are", start: "top center", onEnter: () => setHazeColor(hazeColors.who) });
ScrollTrigger.create({ trigger: ".what-we-do", start: "top center", onEnter: () => setHazeColor(hazeColors.what) });
ScrollTrigger.create({ trigger: ".our-work", start: "top center", onEnter: () => setHazeColor(hazeColors.work) });
ScrollTrigger.create({ trigger: ".our-services", start: "top center", onEnter: () => setHazeColor(hazeColors.services) });
ScrollTrigger.create({ trigger: ".contact", start: "top center", onEnter: () => setHazeColor(hazeColors.contact) });

//// === SUNLIGHT SHIMMER PASS === ////
const shimmer = document.createElement("div");
shimmer.id = "sunlight-shimmer";
document.body.appendChild(shimmer);

Object.assign(shimmer.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 60,
  background: "linear-gradient(60deg, rgba(255, 230, 180, 0.05), rgba(255,255,255,0) 70%)",
  mixBlendMode: "overlay"
});

// Animate sunlight slowly moving diagonally
gsap.to(shimmer, {
  backgroundPosition: "1000px 1000px",
  duration: 60,
  ease: "none",
  repeat: -1
});
