// =====================================================
// ROCK CREATIVE AGENCY - Custom Cursor Animation
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // Create cursor elements dynamically if not in HTML
  const cursor = document.createElement("div");
  const ring = document.createElement("div");
  cursor.classList.add("rock-cursor");
  ring.classList.add("rock-cursor-ring");
  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Follow mouse position instantly for the dot
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth trailing for ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Click pulse animation
  document.addEventListener("mousedown", () => {
    ring.style.animation = "rockPulse 0.4s ease-out";
  });

  document.addEventListener("mouseup", () => {
    ring.style.animation = "none";
  });

  // Optional hover state highlight for interactive elements
  const interactiveElements = document.querySelectorAll("a, button");
  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform += " scale(1.5)";
      cursor.style.background = "radial-gradient(circle, #F2D275 0%, #A5744E 90%)";
      ring.style.borderColor = "rgba(242, 210, 117, 0.6)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
      cursor.style.background = "radial-gradient(circle, #A5744E 0%, #4D3A2A 90%)";
      ring.style.borderColor = "rgba(165, 116, 78, 0.3)";
    });
  });
});
