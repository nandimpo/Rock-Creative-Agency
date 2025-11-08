gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function initHeroTimeline() {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('.mountain-section h1', {
        duration: 1,
        opacity: 1,
        y: 0,
        letterSpacing: '3px',
        ease: 'power2.out'
    }, 0)
    .to('.mountain-section h2', {
        duration: 0.9,
        opacity: 1,
        y: 0,
        ease: 'power2.out'
    }, 0.2)
    .to('.mountain-svg', {
        duration: 1.3,
        opacity: 1,
        scale: 1,
        ease: 'elastic.out(1, 0.5)'
    }, 0.1)
    .to('.mountain-peak', {
        duration: 0.6,
        strokeDashoffset: 0,
        stagger: 0.1,
        ease: 'power1.inOut'
    }, 0.6);
    return tl;
}

function initIntroScrollReveal() {
    gsap.to('.intro-content p', {
        scrollTrigger: {
            trigger: '.intro-section',
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
        },
        duration: 0.9,
        opacity: 1,
        y: 0,
        letterSpacing: '0.5px',
        ease: 'power2.out'
    });
}

function createCanvasReveal() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        pointerEvents: 'none'
    });
    document.body.appendChild(canvas);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = [];
    const particleCount = prefersReducedMotion ? 30 : 60;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.size = Math.random() * 3 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = Math.random() > 0.5 ? '#A5744E' : '#F2D275';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.vy += 0.12;
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
            start: 'top 55%',
            onEnter: () => {
                for (let i = 0; i < particleCount; i++) particles.push(new Particle());
                function animate() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for (let i = particles.length - 1; i >= 0; i--) {
                        particles[i].update();
                        particles[i].draw(ctx);
                        if (particles[i].life <= 0) particles.splice(i, 1);
                    }
                    if (particles.length > 0) animationId = requestAnimationFrame(animate);
                    else cancelAnimationFrame(animationId);
                }
                animate();
            },
        });
    }

    initCanvasAnimation('.team-section');
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, { passive: true });
}

function initTeamScrollTrigger() {
    gsap.to('.team-member', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top 65%',
            end: 'top 25%',
            scrub: 1.2,
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { amount: 0.4 },
        duration: 0.7,
        ease: 'power2.out'
    });

    gsap.utils.toArray('.team-member').forEach(member => {
        gsap.to(member, {
            scrollTrigger: {
                trigger: member,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.5,
            rotationX: 0,
            opacity: 1,
            ease: 'power2.out'
        });

        member.addEventListener('mouseenter', () => {
            gsap.to(member, {
                duration: 0.25,
                scale: 1.06,
                boxShadow: '0 16px 30px rgba(165, 116, 78, 0.25)',
                ease: 'power2.out'
            });
        });
        member.addEventListener('mouseleave', () => {
            gsap.to(member, {
                duration: 0.25,
                scale: 1,
                boxShadow: '0 0px 0px rgba(165, 116, 78, 0)',
                ease: 'power2.out'
            });
        });
    });
}

function initTeamCardSVGAnimation() {
    const teamCards = gsap.utils.toArray('.team-card');
    teamCards.forEach(card => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('width', '260');
        svg.setAttribute('height', '260');
        Object.assign(svg.style, { position: 'absolute', top: '0', left: '0', pointerEvents: 'none', opacity: '0.6' });
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

        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(circle, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' });
            },
        });
    });
}

function initBackgroundBreathing() {
    const mountainSection = document.querySelector('.mountain-section');
    gsap.to(mountainSection, {
        backgroundPosition: '50% 0%, 50% 100%',
        backgroundSize: '100% 100%, 100% 200%',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function initParallaxEffect() {
    gsap.to('.mountain-svg', {
        scrollTrigger: {
            trigger: '.mountain-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: 80,
        opacity: 0.7,
        ease: 'none'
    });
}

function initTextRevealAnimation() {
    const heading = document.querySelector('.team-section h2');
    if (!heading) return;
    const text = heading.textContent.trim();
    heading.textContent = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        heading.appendChild(span);
        gsap.to(span, {
            scrollTrigger: {
                trigger: '.team-section',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.04,
            delay: index * 0.015,
            ease: 'power1.out'
        });
    });
}

function initSectionTransitions() {
    gsap.utils.toArray('section').forEach((section, index) => {
        if (index === 0) return;
        gsap.fromTo(section,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'top 55%',
                    scrub: 1,
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
    });
}

function initFloatingAnimation() {
    gsap.utils.toArray('.team-card').forEach((card, index) => {
        gsap.to(card, {
            y: 10,
            duration: 2.5 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

function initColorPulseAnimation() {
    gsap.to('.intro-content p', {
        color: '#A5744E',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

document.addEventListener('DOMContentLoaded', () => {
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
    ScrollTrigger.refresh();
});

window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });

const isMobile = window.innerWidth <= 768;
if (isMobile) gsap.globalTimeline.timeScale(0.85);
