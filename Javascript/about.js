/* =====================================================
   ABOUT-ANIMATIONS.JS - GSAP Timeline, ScrollTrigger & Canvas Reveal
   Rock Creative Agency - Nature Theme & Alive Animations
   ===================================================== */

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ============================================================
// 1. HERO SECTION - TIMELINE ANIMATION (Intro Sequence)
// ============================================================
function initHeroTimeline() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl
        .to('.mountain-section h1', {
            duration: 1.2,
            opacity: 1,
            y: 0,
            letterSpacing: '4px',
            ease: 'power2.out',
        }, 0)
        .to('.mountain-section h2', {
            duration: 1,
            opacity: 1,
            y: 0,
            ease: 'power2.out',
        }, 0.3)
        .to('.mountain-svg', {
            duration: 1.5,
            opacity: 1,
            scale: 1,
            ease: 'elastic.out(1, 0.5)',
        }, 0.2)
        .to('.mountain-peak', {
            duration: 0.8,
            strokeDashoffset: 0,
            stagger: 0.15,
            ease: 'power1.inOut',
        }, 0.8);

    return tl;
}

// ============================================================
// 2. SCROLL TRIGGER - INTRO SECTION REVEAL
// ============================================================
function initIntroScrollReveal() {
    gsap.to('.intro-content p', {
        scrollTrigger: {
            trigger: '.intro-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
            markers: false,
        },
        duration: 1,
        opacity: 1,
        y: 0,
        letterSpacing: '0.5px',
        ease: 'power2.out',
    });

    // Animated underline reveal
    gsap.fromTo(
        '.intro-section::after',
        {
            width: '0%',
        },
        {
            scrollTrigger: {
                trigger: '.intro-section',
                start: 'top 70%',
                end: 'top 40%',
                scrub: 2,
            },
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
        }
    );
}

// ============================================================
// 3. CANVAS REVEAL ANIMATION - Section Transition Effect
// ============================================================
function createCanvasReveal() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);

    // Particle system for nature-themed reveal
    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.size = Math.random() * 4 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = Math.random() > 0.5 ? '#A5744E' : '#F2D275';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.vy += 0.15; // gravity
        }

        draw(ctx) {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initCanvasAnimation(trigger) {
        let animationId;

        ScrollTrigger.create({
            trigger: trigger,
            start: 'top 50%',
            onEnter: () => {
                // Initialize particles
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }

                function animate() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    for (let i = particles.length - 1; i >= 0; i--) {
                        particles[i].update();
                        particles[i].draw(ctx);

                        if (particles[i].life <= 0) {
                            particles.splice(i, 1);
                        }
                    }

                    if (particles.length > 0) {
                        animationId = requestAnimationFrame(animate);
                    } else {
                        cancelAnimationFrame(animationId);
                    }
                }

                animate();
            },
        });
    }

    // Trigger canvas reveal at team section
    initCanvasAnimation('.team-section');

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================================
// 4. TEAM SECTION - SCROLL TRIGGER STAGGER ANIMATION
// ============================================================
function initTeamScrollTrigger() {
    gsap.to('.team-member', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top 60%',
            end: 'top 20%',
            scrub: 1.5,
            markers: false,
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: {
            amount: 0.5,
            grid: [2, 3],
            from: 'start',
        },
        duration: 0.8,
        ease: 'power2.out',
    });

    // Individual card animations
    gsap.utils.toArray('.team-member').forEach((member, index) => {
        gsap.to(member, {
            scrollTrigger: {
                trigger: member,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            duration: 0.6,
            rotationX: 0,
            opacity: 1,
            ease: 'power2.out',
        });

        // Hover effect timeline
        member.addEventListener('mouseenter', () => {
            gsap.to(member, {
                duration: 0.3,
                scale: 1.08,
                boxShadow: '0 20px 40px rgba(165, 116, 78, 0.3)',
                ease: 'power2.out',
            });
        });

        member.addEventListener('mouseleave', () => {
            gsap.to(member, {
                duration: 0.3,
                scale: 1,
                boxShadow: '0 0px 0px rgba(165, 116, 78, 0)',
                ease: 'power2.out',
            });
        });
    });
}

// ============================================================
// 5. TEAM CARDS - SVG CIRCLE ANIMATION (MotionPath)
// ============================================================
function initTeamCardSVGAnimation() {
    const teamCards = gsap.utils.toArray('.team-card');

    teamCards.forEach((card, index) => {
        // Create SVG overlay for each card
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('width', '260');
        svg.setAttribute('height', '260');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.opacity = '0.6';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '150');
        circle.setAttribute('cy', '150');
        circle.setAttribute('r', '140');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#A5744E');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('stroke-dasharray', '880');
        circle.setAttribute('stroke-dashoffset', '880');

        svg.appendChild(circle);
        card.style.position = 'relative';
        card.appendChild(svg);

        // Animate on scroll
        ScrollTrigger.create({
            trigger: card,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(circle, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                });
            },
        });
    });
}

// ============================================================
// 6. BACKGROUND BREATHING ANIMATION - Continuous
// ============================================================
function initBackgroundBreathing() {
    const mountainSection = document.querySelector('.mountain-section');

    gsap.to(mountainSection, {
        backgroundPosition: '50% 0%, 50% 100%',
        backgroundSize: '100% 100%, 100% 200%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

// ============================================================
// 7. PARALLAX SCROLL EFFECT
// ============================================================
function initParallaxEffect() {
    gsap.to('.mountain-svg', {
        scrollTrigger: {
            trigger: '.mountain-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            markers: false,
        },
        y: 100,
        opacity: 0.7,
        ease: 'none',
    });
}

// ============================================================
// 8. TEXT ANIMATION - Staggered Character Reveal
// ============================================================
function initTextRevealAnimation() {
    const heading = document.querySelector('.team-section h2');

    if (heading) {
        const text = heading.textContent;
        heading.textContent = '';

        gsap.utils.toArray(text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            heading.appendChild(span);

            gsap.to(span, {
                scrollTrigger: {
                    trigger: '.team-section',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 1,
                duration: 0.05,
                delay: index * 0.02,
                ease: 'power1.out',
            });
        }));
    }
}

// ============================================================
// 9. SECTION TRANSITION - Dissolve Effect
// ============================================================
function initSectionTransitions() {
    const sections = gsap.utils.toArray('section');

    sections.forEach((section, index) => {
        if (index === 0) return; // Skip first section

        gsap.fromTo(
            section,
            {
                opacity: 0,
                y: 50,
            },
            {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                    toggleActions: 'play none none reverse',
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
            }
        );
    });
}

// ============================================================
// 10. FLOATING ANIMATION - Team Members
// ============================================================
function initFloatingAnimation() {
    gsap.utils.toArray('.team-card').forEach((card, index) => {
        gsap.to(card, {
            y: 15,
            duration: 3 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    });
}

// ============================================================
// 11. COLOR PULSE ANIMATION - Dynamic Theme
// ============================================================
function initColorPulseAnimation() {
    gsap.to('.intro-content p', {
        color: '#A5744E',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

// ============================================================
// INITIALIZATION - Run all animations on page load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations
    initHeroTimeline();
    initIntroScrollReveal();
    initTeamScrollTrigger();
    initTeamCardSVGAnimation();
    initBackgroundBreathing();
    initParallaxEffect();
    initTextRevealAnimation();
    initSectionTransitions();
    initFloatingAnimation();
    initColorPulseAnimation();
    createCanvasReveal();

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();
});

// ============================================================
// WINDOW RESIZE - Refresh ScrollTrigger
// ============================================================
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// ============================================================
// PERFORMANCE OPTIMIZATION - Reduce animations on mobile
// ============================================================
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    // Simplify animations for mobile
    gsap.globalTimeline.timeScale(0.8);
}