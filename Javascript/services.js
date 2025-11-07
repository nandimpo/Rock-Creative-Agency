// ============================
// ROCK CREATIVE AGENCY SERVICES INTERACTIONS
// ============================

// Ensure GSAP and ScrollTrigger are available
gsap.registerPlugin(ScrollTrigger);

// ---------- SCROLL REVEAL ANIMATION ----------
document.querySelectorAll(".service-item").forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 60,
    duration: 1,
    delay: i * 0.2,
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
});

// ---------- HOVER REVEAL ANIMATION ----------
document.querySelectorAll(".service-item").forEach((item) => {
  const image = item.querySelector(".service-image");
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    image,
    { opacity: 0, scale: 1.1 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
  );

  item.addEventListener("mouseenter", () => tl.play());
  item.addEventListener("mouseleave", () => tl.reverse());
});

// ---------- DISCOVER MORE ASIDE PANEL ----------
const aside = document.createElement("aside");
aside.classList.add("service-aside");
aside.innerHTML = `
  <div class="aside-content">
    <button class="close-aside">×</button>
    <h2 class="aside-title"></h2>
    <p class="aside-text"></p>
  </div>
`;
document.body.appendChild(aside);

// Content for each service
const serviceInfo = {
  branding: `Our branding services are designed to create authentic identities that speak volumes. We focus on connecting visuals with brand strategy, ensuring consistency across all platforms. Our approach blends creativity and insight to make your brand unforgettable. We guide your visual tone, typography, and brand storytelling. Every brand we build becomes an emotional experience.`,
  "public-relations": `Our PR team builds trust between you and your audience through honest storytelling. We specialize in campaigns that engage, inform, and inspire. Whether it’s media relations, brand events, or influencer outreach, we ensure your voice is heard. We craft strategies that highlight your brand’s true character. Every project is handled with precision and purpose.`,
  "social-media": `We manage and grow your digital presence with creativity and strategy. Our social media solutions involve targeted campaigns and consistent engagement. We help brands create content that sparks conversation. From reels to visual storytelling, our process is audience-focused. We track, adapt, and evolve your online identity for maximum impact.`,
  "creative-direction": `Our creative direction process ensures every project starts with a strong idea. We shape visuals, tone, and atmosphere that align with your brand. From photoshoots to campaigns, every frame reflects purpose. We collaborate closely with your team to capture the right energy. It’s not just design — it’s vision brought to life.`,
  "pre-production": `Before any camera rolls, we handle every detail that ensures smooth production. From concept planning to set design, we make creativity practical. Our pre-production team maps out the vision, logistics, and talent. We ensure all visual and technical needs are aligned. Your project starts structured, clear, and ready to move forward.`,
  production: `Our production team captures the essence of your brand through high-quality visuals. We combine cinematic techniques with modern storytelling. Every project — from adverts to documentaries — is handled with precision. We collaborate across departments to ensure artistic and technical perfection. Expect nothing less than production excellence.`,
  "post-production": `Post-production is where the story comes alive. We handle editing, color grading, motion design, and sound design in-house. Our editors shape moments into cohesive narratives. Every frame is treated with care to deliver emotional impact. We transform raw footage into meaningful, finished work that resonates.`,
  "audio-visual": `We specialize in immersive audio-visual experiences that engage the senses. Our team crafts sound, visuals, and motion to connect emotion and brand. From installations to music videos, we fuse rhythm and vision. Our AV projects create unforgettable brand memories. Every project is a sensory journey into your story.`,
};

// ---------- DISCOVER BUTTONS ----------
document.querySelectorAll(".service-item").forEach((item) => {
  const discoverBtn = document.createElement("button");
  discoverBtn.classList.add("discover-btn");
  discoverBtn.textContent = "DISCOVER MORE";
  item.querySelector(".service-content").appendChild(discoverBtn);

  discoverBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = item.getAttribute("data-filter-services");
    const title = item.querySelector(".service-title").textContent;

    aside.querySelector(".aside-title").textContent = title;
    aside.querySelector(".aside-text").textContent =
      serviceInfo[key] || "More information coming soon.";

    openAside();
  });
});

// ---------- ASIDE OPEN/CLOSE WITH GSAP ----------
const openAside = () => {
  gsap.to(".service-aside", {
    x: 0,
    duration: 0.8,
    ease: "power4.out",
  });
  gsap.fromTo(
    ".aside-content",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
  );
  document.body.classList.add("aside-open");
};

const closeAside = () => {
  gsap.to(".service-aside", {
    x: "100%",
    duration: 0.8,
    ease: "power4.inOut",
  });
  document.body.classList.remove("aside-open");
};

// ---------- CLICK OUTSIDE CLOSE ----------
document.addEventListener("click", (e) => {
  if (
    document.body.classList.contains("aside-open") &&
    !e.target.closest(".aside-content")
  ) {
    closeAside();
  }
});

// ---------- CLOSE BUTTON ----------
document.querySelector(".close-aside").addEventListener("click", closeAside);

// ---------- INITIAL HIDE ----------
gsap.set(".service-aside", { x: "100%" });
