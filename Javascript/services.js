gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) gsap.globalTimeline.timeScale(0.6);


function responsiveDuration(base) {
  return window.innerWidth < 600 ? base * 0.8 : base;
}


document.querySelectorAll(".service-item").forEach((item, i) => {
  gsap.from(item, {
    opacity: 0,
    y: 60,
    duration: responsiveDuration(1),
    delay: i * 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
      toggleActions: "play none none reverse",
      once: false,
    },
  });
});


document.querySelectorAll(".service-item").forEach((item) => {
  const image = item.querySelector(".service-image");
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    image,
    { opacity: 0, scale: 1.1 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
  );

  const triggerAnim = () => tl.play();
  const reverseAnim = () => tl.reverse();

  item.addEventListener("mouseenter", triggerAnim);
  item.addEventListener("mouseleave", reverseAnim);
  item.addEventListener("focusin", triggerAnim);
  item.addEventListener("focusout", reverseAnim);

  item.setAttribute("tabindex", "0"); 
  item.setAttribute("role", "group");
  item.setAttribute("aria-label", item.querySelector(".service-title")?.textContent || "Service item");
});

const aside = document.createElement("aside");
aside.classList.add("service-aside");
aside.setAttribute("role", "dialog");
aside.setAttribute("aria-modal", "true");
aside.setAttribute("aria-hidden", "true");
aside.setAttribute("tabindex", "-1");
aside.innerHTML = `
  <div class="aside-content" role="document">
    <button class="close-aside" aria-label="Close service details">×</button>
    <h2 class="aside-title"></h2>
    <p class="aside-text"></p>
  </div>
`;
document.body.appendChild(aside);

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


document.querySelectorAll(".service-item").forEach((item) => {
  const discoverBtn = document.createElement("button");
  discoverBtn.classList.add("discover-btn");
  discoverBtn.textContent = "DISCOVER MORE";
  discoverBtn.setAttribute("aria-haspopup", "dialog");
  discoverBtn.setAttribute("aria-controls", "service-aside");
  discoverBtn.setAttribute("aria-expanded", "false");
  discoverBtn.classList.add("focus-outline");
  item.querySelector(".service-content").appendChild(discoverBtn);

  discoverBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = item.getAttribute("data-filter-services");
    const title = item.querySelector(".service-title").textContent;
    aside.querySelector(".aside-title").textContent = title;
    aside.querySelector(".aside-text").textContent =
      serviceInfo[key] || "More information coming soon.";
    openAside(discoverBtn);
  });
});


let lastFocusedElement = null;

const openAside = (triggerBtn) => {
  lastFocusedElement = triggerBtn;
  gsap.to(".service-aside", { x: 0, duration: 0.8, ease: "power4.out" });
  gsap.fromTo(".aside-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
  aside.setAttribute("aria-hidden", "false");
  document.body.classList.add("aside-open");
  aside.focus();
  triggerBtn.setAttribute("aria-expanded", "true");
};

const closeAside = () => {
  gsap.to(".service-aside", { x: "100%", duration: 0.6, ease: "power4.inOut" });
  aside.setAttribute("aria-hidden", "true");
  document.body.classList.remove("aside-open");
  if (lastFocusedElement) lastFocusedElement.focus();
  lastFocusedElement?.setAttribute("aria-expanded", "false");
};


document.addEventListener("click", (e) => {
  if (document.body.classList.contains("aside-open") && !e.target.closest(".aside-content")) {
    closeAside();
  }
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("aside-open")) {
    closeAside();
  }
});


aside.querySelector(".close-aside").addEventListener("click", closeAside);


gsap.set(".service-aside", { x: "100%" });


window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
