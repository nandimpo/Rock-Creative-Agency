document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // Remove any existing custom cursors (in case of reloads)
  document.querySelectorAll(".rock-cursor, .rock-cursor-ring").forEach(el => el.remove());

  // Handle accessibility and mobile
  if (isTouchDevice || prefersReducedMotion) {
    document.body.style.cursor = "auto";
    return;
  }

  // Create cursor elements
  const cursor = document.createElement("div");
  const ring = document.createElement("div");
  cursor.className = "rock-cursor";
  ring.className = "rock-cursor-ring";
  cursor.style.opacity = "0";
  ring.style.opacity = "0";
  document.body.append(cursor, ring);

  // Ensure native cursor hidden only AFTER custom one added
  document.body.style.cursor = "none";

  // Track mouse position
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    cursor.style.opacity = "1";
    ring.style.opacity = "1";
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Pulse animation on click
  document.addEventListener("mousedown", () => {
    ring.style.animation = "rockPulse 0.4s ease-out";
  });
  document.addEventListener("mouseup", () => {
    ring.style.animation = "auraFlow 5s ease-in-out infinite";
  });

  // Hover interaction states
  const hoverTargets = document.querySelectorAll("a, button, input[type='button'], input[type='submit']");
  hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      ring.classList.add("ring-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      ring.classList.remove("ring-hover");
    });
  });

  // Hide custom cursor during keyboard navigation (accessibility)
  let usingKeyboard = false;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !usingKeyboard) {
      usingKeyboard = true;
      cursor.style.display = "none";
      ring.style.display = "none";
      document.body.style.cursor = "auto";
    }
  });

  window.addEventListener("mousedown", () => {
    if (usingKeyboard) {
      usingKeyboard = false;
      cursor.style.display = "block";
      ring.style.display = "block";
      document.body.style.cursor = "none";
    }
  });

  // Responsive sizing
  const updateSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      ring.style.width = "55px";
      ring.style.height = "55px";
    } else {
      ring.style.width = "85px";
      ring.style.height = "85px";
    }
  };
  window.addEventListener("resize", updateSize);
  updateSize();
});
