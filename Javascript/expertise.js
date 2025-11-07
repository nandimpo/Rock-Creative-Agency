// =====================================================
// ROCK CREATIVE AGENCY – "THE METHOD" PAGE
// Full GSAP Animation System (Volcano + Earth + Roots)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  // =====================================================
  // 1️⃣ HERO VOLCANIC REVEAL
  // =====================================================
  const hero = document.querySelector(".mountain-section");
  if (hero) {
    const h1 = hero.querySelector("h1");
    const h2 = hero.querySelector("h2");

    // Volcanic eruption reveal
    setTimeout(() => {
      hero.classList.add("revealed");
    }, 400); // slower and cinematic

    // Text rise-up animation
    gsap.timeline()
      .to(h1, {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: "power4.out",
        delay: 2.2,
      })
      .to(
        h2,
        { opacity: 1, y: 0, duration: 1.8, ease: "power4.out" },
        "-=1.0"
      );

    // Parallax fog layers
    gsap.utils.toArray(".fog-layer").forEach((fog, i) => {
      gsap.to(fog, {
        xPercent: i % 2 === 0 ? -15 : 15,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }

  // =====================================================
  // 2️⃣ SMOOTH FADE-IN ON SCROLL
  // =====================================================
  const fadeEls = document.querySelectorAll(".fade-in, .fade-in-up");
  const revealOnScroll = () => {
    fadeEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add("visible");
      }
    });
  };
  document.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // run once on load

  // =====================================================
  // 3️⃣ EARTH ANIMATIONS (BACKGROUND + CARDS)
  // =====================================================
  // Earth layer pulse (ambient)
  gsap.to(".earth-layer", {
    opacity: 0.6,
    duration: 6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Stage card reveal
  gsap.utils.toArray(".stage-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 100, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        delay: i * 0.2,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Section heading rise-up
  gsap.from(".section-heading h2", {
    duration: 1.6,
    y: 60,
    opacity: 0,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: ".section-heading",
      start: "top 90%",
    },
  });

  // Section heading paragraph fade
  gsap.from(".section-heading p", {
    duration: 1.5,
    y: 40,
    opacity: 0,
    delay: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section-heading",
      start: "top 90%",
    },
  });

  // Earth ripple breathing effect
  gsap.timeline({
    scrollTrigger: {
      trigger: ".journey-stages",
      start: "top center",
      end: "bottom top",
      scrub: true,
    },
  })
    .to(".earth-layer", {
      scale: 1.1,
      opacity: 0.5,
      ease: "sine.inOut",
    })
    .to(".earth-layer", {
      scale: 1,
      opacity: 0.8,
      ease: "sine.inOut",
    });

  // =====================================================
  // 4️⃣ EARTH ROOT GROWTH (SVG MOTIONPATH)
  // =====================================================
  const rootTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".journey-stages",
      start: "top 80%",
      end: "bottom top",
      scrub: 1,
    },
  });

  // Root path grows with scroll
  rootTimeline.to(".root-path", {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.inOut",
  });

  // Subtle glowing pulse
  gsap.to(".root-path", {
    filter: "drop-shadow(0 0 12px rgba(242,210,117,0.8))",
    repeat: -1,
    yoyo: true,
    duration: 2.5,
    ease: "sine.inOut",
  });

  // Gentle wave (earth pulse motion)
  gsap.to(".earth-roots", {
    y: 10,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  console.log("✅ GSAP animations initialized successfully on The Method page.");
});
// ====================== VINE GROWTH EXTENSION ======================
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const vineTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".journey-support",
      start: "top 90%",
      end: "bottom top",
      scrub: 1,
    },
  });

  // Vine growth upward
  vineTimeline.to(".vine-path", {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.inOut",
  });

  // Subtle shimmer along the vine
  gsap.to(".vine-path", {
    filter: "drop-shadow(0 0 12px rgba(242,210,117,0.6))",
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "sine.inOut",
  });

  // Slight organic sway of vine
  gsap.to(".vine-growth", {
    rotate: 1,
    y: 5,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
});
