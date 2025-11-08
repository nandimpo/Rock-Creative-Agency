

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

 
  if (isTouchDevice || prefersReducedMotion) {
    document.body.style.cursor = "auto";
    return;
  }

  const cursor = document.createElement("div");
  const ring = document.createElement("div");
  cursor.classList.add("rock-cursor");
  ring.classList.add("rock-cursor-ring");
  document.body.append(cursor, ring);

  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

 
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();


  document.addEventListener("mousedown", () => {
    ring.style.animation = "rockPulse 0.4s ease-out";
  });
  document.addEventListener("mouseup", () => {
  
    ring.style.animation = "auraFlow 5s ease-in-out infinite";
  });


  const interactiveSelectors = "a, button, input[type='button'], input[type='submit']";
  const interactiveElements = document.querySelectorAll(interactiveSelectors);

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      ring.classList.add("ring-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      ring.classList.remove("ring-hover");
    });
  });

  let usingKeyboard = false;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !usingKeyboard) {
      usingKeyboard = true;
      cursor.style.display = "none";
      ring.style.display = "none";
    }
  });

  window.addEventListener("mousedown", () => {
    if (usingKeyboard) {
      usingKeyboard = false;
      cursor.style.display = "block";
      ring.style.display = "block";
    }
  });

  const updateSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      ring.style.width = "60px";
      ring.style.height = "60px";
    } else {
      ring.style.width = "90px";
      ring.style.height = "90px";
    }
  };
  window.addEventListener("resize", updateSize);
  updateSize();
});
