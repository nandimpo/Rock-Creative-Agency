// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

console.log('SVG & GSAP Animations with Timelines loaded');

// ===================================================
// HERO SVG ANIMATIONS WITH TIMELINE
// ===================================================

function createHeroSVG() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1920 1080');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '2';
    svg.style.pointerEvents = 'none';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Create timeline for hero SVG animations
    const heroTimeline = gsap.timeline({ repeat: -1, yoyo: true });

    // Mountain layers with SVG stroke animation
    const mountains = [
        { points: '0,900 400,400 800,700 1200,350 1600,600 1920,400 1920,1080 0,1080', opacity: 0.08, duration: 8 },
        { points: '0,950 300,500 700,800 1100,450 1500,650 1920,500 1920,1080 0,1080', opacity: 0.06, duration: 10 },
        { points: '0,800 250,600 600,850 950,550 1350,700 1700,400 1920,600 1920,1080 0,1080', opacity: 0.04, duration: 12 }
    ];

    mountains.forEach((mountain, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${mountain.points}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#111A18');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);

        // SVG Stroke animation - Draw effect
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        // Timeline for mountain stroke animation
        const mountainTl = gsap.timeline();
        mountainTl.to(path, {
            strokeDashoffset: 0,
            duration: 3 + index * 0.6,
            delay: 0.3 + index * 0.4,
            ease: 'power2.inOut'
        });

        // Continuous breathing animation
        mountainTl.to(path, {
            opacity: mountain.opacity + 0.5,
            duration: mountain.duration,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        }, 2.5 + index * 0.3);
    });

    // Animated trees with SVG
    for (let i = 0; i < 6; i++) {
        const x = Math.random() * 1920;
        const y = 600 + Math.random() * 300;
        const scale = 0.5 + Math.random() * 0.8;
        
        const tree = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        tree.setAttribute('points', `${x},${y-40*scale} ${x-20*scale},${y+30*scale} ${x+20*scale},${y+30*scale}`);
        tree.setAttribute('fill', 'rgba(77, 121, 148, 0.1)');
        tree.setAttribute('opacity', '0.3');
        svg.appendChild(tree);

        heroTimeline.to(tree, {
            opacity: 0.6,
            duration: 3 + Math.random() * 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        }, i * 0.3);
    }

    // Animated mist/clouds
    for (let i = 0; i < 4; i++) {
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        const cx = Math.random() * 1920;
        const cy = 200 + Math.random() * 300;
        ellipse.setAttribute('cx', cx);
        ellipse.setAttribute('cy', cy);
        ellipse.setAttribute('rx', '200');
        ellipse.setAttribute('ry', '80');
        ellipse.setAttribute('fill', 'rgba(242, 217, 117, 0.05)');
        svg.appendChild(ellipse);

        heroTimeline.to(ellipse, {
            attr: { cx: cx + 200 },
            opacity: 0,
            duration: 8 + Math.random() * 4,
            repeat: -1,
            ease: 'sine.inOut'
        }, i * 2);
    }

    // Animated water ripples with SVG
    for (let i = 0; i < 3; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const cx = 200 + i * 600;
        const cy = 850;
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', '30');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(77, 121, 148, 0.3)');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        heroTimeline.to(circle, {
            attr: { r: 150 },
            'stroke-width': 0,
            opacity: 0,
            duration: 3,
            repeat: -1,
            ease: 'power1.out'
        }, i * 1);
    }

    hero.appendChild(svg);
}

window.addEventListener('load', createHeroSVG);

// ===================================================
// HERO H1 WAVE TEXT ANIMATION WITH TIMELINE
// ===================================================

function createWaveTextAnimation() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    const text = h1.textContent;
    h1.textContent = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 1600 200');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    const charWidth = 50;
    let totalWidth = 0;
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
            totalWidth += charWidth;
        } else {
            totalWidth += charWidth * 0.5;
        }
    }
    
    let xPosition = (1600 - totalWidth) / 2;

    // Timeline for wave text animation
    const waveTimeline = gsap.timeline();

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === ' ') {
            xPosition += charWidth * 0.5;
            continue;
        }

        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tspan.setAttribute('x', xPosition);
        tspan.setAttribute('y', '120');
        tspan.setAttribute('font-size', '80');
        tspan.setAttribute('font-weight', '300');
        tspan.setAttribute('letter-spacing', '3');
        tspan.setAttribute('font-family', 'Conso, serif');
        tspan.setAttribute('fill', '#E2DCCC');
        tspan.setAttribute('text-anchor', 'middle');
        tspan.textContent = char;

        const delay = i * 0.08;

        // Add to timeline
        waveTimeline.fromTo(tspan, 
            {
                attr: { y: 140 },
                opacity: 0
            },
            {
                attr: { y: 120 },
                opacity: 1,
                duration: 0.6,
                ease: 'back.out'
            },
            delay
        );

        // Continuous wave after initial animation
        waveTimeline.to(tspan, {
            attr: { y: 100 },
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        }, delay + 0.6);

        svg.appendChild(tspan);
        xPosition += charWidth;
    }

    h1.appendChild(svg);
}

window.addEventListener('load', () => {
    setTimeout(createWaveTextAnimation, 300);
});

// ===================================================
// ANIMATED SVG SERVICE ICONS WITH TIMELINE
// ===================================================

function createServiceSVGs() {
    const serviceTags = document.querySelectorAll('.service-tag');
    
    serviceTags.forEach((tag, index) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('style', 'display: inline-block; margin-right: 10px; vertical-align: middle;');

        const designs = [
            () => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,3 L20,18 L4,18 Z M12,8 L16,15 L8,15 Z');
                path.setAttribute('fill', 'currentColor');
                path.setAttribute('opacity', '0.8');
                svg.appendChild(path);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('fill', 'currentColor');
                g.setAttribute('opacity', '0.7');
                
                const m1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                m1.setAttribute('points', '3,18 8,8 12,15 18,18');
                
                const m2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                m2.setAttribute('points', '12,18 18,10 22,14 24,18');
                
                g.appendChild(m1);
                g.appendChild(m2);
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('stroke', 'currentColor');
                g.setAttribute('stroke-width', '1.5');
                g.setAttribute('fill', 'none');
                
                const mountain = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                mountain.setAttribute('d', 'M2,16 L8,8 L14,13 L22,6');
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '18');
                circle.setAttribute('cy', '10');
                circle.setAttribute('r', '3');
                
                g.appendChild(mountain);
                g.appendChild(circle);
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('fill', 'currentColor');
                
                const sun = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                sun.setAttribute('cx', '12');
                sun.setAttribute('cy', '6');
                sun.setAttribute('r', '3');
                
                const mountain = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                mountain.setAttribute('points', '2,15 8,8 14,13 22,10 22,20 2,20');
                mountain.setAttribute('opacity', '0.7');
                
                g.appendChild(sun);
                g.appendChild(mountain);
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('fill', 'currentColor');
                
                for (let i = 0; i < 5; i++) {
                    const tree = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    const x = 3 + i * 4;
                    tree.setAttribute('points', `${x},20 ${x-2},15 ${x+2},15`);
                    tree.setAttribute('opacity', 0.5 + (i * 0.1));
                    g.appendChild(tree);
                }
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('fill', 'currentColor');
                g.setAttribute('opacity', '0.8');
                
                const rock = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                rock.setAttribute('cx', '12');
                rock.setAttribute('cy', '12');
                rock.setAttribute('rx', '7');
                rock.setAttribute('ry', '9');
                
                g.appendChild(rock);
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('stroke', 'currentColor');
                g.setAttribute('stroke-width', '1.5');
                g.setAttribute('fill', 'none');
                g.setAttribute('stroke-linecap', 'round');
                
                for (let i = 0; i < 3; i++) {
                    const wave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    wave.setAttribute('d', `M2,${10 + i * 3} Q6,${8 + i * 3} 10,${10 + i * 3} T18,${10 + i * 3}`);
                    g.appendChild(wave);
                }
                svg.appendChild(g);
            },
            () => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('fill', 'currentColor');
                
                const sky = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                sky.setAttribute('x', '2');
                sky.setAttribute('y', '3');
                sky.setAttribute('width', '20');
                sky.setAttribute('height', '8');
                sky.setAttribute('opacity', '0.3');
                
                const land = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                land.setAttribute('d', 'M2,11 L8,6 L14,10 L22,5 L22,20 L2,20 Z');
                land.setAttribute('opacity', '0.7');
                
                g.appendChild(sky);
                g.appendChild(land);
                svg.appendChild(g);
            }
        ];

        designs[index % designs.length]();
        tag.insertBefore(svg, tag.firstChild);

        // Hover animation with timeline
        tag.addEventListener('mouseenter', () => {
            gsap.to(svg, {
                scale: 1.3,
                rotation: 15,
                duration: 0.6,
                ease: 'back.out'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(svg, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'back.out'
            });
        });
    });
}

window.addEventListener('load', () => {
    setTimeout(createServiceSVGs, 500);
});

// ===================================================
// HERO SECTION ANIMATIONS WITH TIMELINE & SCROLLTRIGGER
// ===================================================

// Hero parallax on scroll with ScrollTrigger
gsap.to('.hero', {
    backgroundPosition: '50% 100%',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
    }
});

// Hero elements timeline
const heroElementsTimeline = gsap.timeline();
heroElementsTimeline.from('.hero h2', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.4,
    immediateRender: false
})
.from('.hero .btn', {
    opacity: 0,
    y: 30,
    duration: 1.5,
    immediateRender: false
}, '-=0.5');

// ===================================================
// SCROLL-TRIGGERED SECTION ANIMATIONS WITH TIMELINES
// ===================================================

function createSectionTimeline(sectionSelector, headingSelector, paragraphSelector, cardSelector) {
    const sectionTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: sectionSelector,
            start: 'top center',
            once: true
        }
    });

    const words = document.querySelectorAll(`${sectionSelector} ${headingSelector} .heading-word`);
    
    // Add heading animation
    if (words.length > 0) {
        sectionTimeline.from(words, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            stagger: 0.1,
            ease: 'back.out'
        }, 0);
    }

    // Add paragraph animation
    if (paragraphSelector) {
        sectionTimeline.from(`${sectionSelector} ${paragraphSelector}`, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.3);
    }

    // Add card/item animations
    if (cardSelector) {
        const cards = document.querySelectorAll(`${sectionSelector} ${cardSelector}`);
        if (cards.length > 0) {
            sectionTimeline.from(cards, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            }, 0.6);
        }
    }

    return sectionTimeline;
}

// Who We Are Section Timeline
createSectionTimeline('.who-we-are', 'h2', 'p', '.who-we-are-card');

// What We Do Section Timeline
createSectionTimeline('.what-we-do', '.text-content h2', '.text-content p', null);

// Our Work Section Timeline
createSectionTimeline('.our-work', '.work-content h2', null, '.work-list li');

// Our Services Section Timeline - FIXED: DON'T animate service tags, only heading
const servicesTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.our-services',
        start: 'top center',
        once: true
    }
});

const servicesHeadingWords = document.querySelectorAll('.our-services .services-content h2 .heading-word');
if (servicesHeadingWords.length > 0) {
    servicesTimeline.from(servicesHeadingWords, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.1,
        ease: 'back.out'
    }, 0);
}

// Contact Section Timeline - FIXED: DON'T animate form inputs
const contactTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.contact',
        start: 'top center',
        once: true
    }
});

const contactWords = document.querySelectorAll('.contact h2 .heading-word');
contactTimeline.from(contactWords, {
    opacity: 0,
    rotationX: 90,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
}, 0)
.from('.contact > p', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out'
}, 0.3);

// ===================================================
// MOTIONPATH ANIMATION - PARTICLES FOLLOWING PATH
// ===================================================

function createMotionPathAnimation(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    // Create SVG with motion path
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1000 600');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '0';
    svg.style.pointerEvents = 'none';

    // Create curved path for particles to follow
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `motionPath-${sectionSelector}`);
    path.setAttribute('d', 'M0,300 Q250,100 500,300 T1000,300');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    svg.appendChild(path);

    section.style.position = 'relative';
    section.insertBefore(svg, section.firstChild);

    // Create circles that follow the motion path
    ScrollTrigger.create({
        trigger: sectionSelector,
        start: 'top 70%',
        onEnter: () => {
            for (let i = 0; i < 4; i++) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', '8');
                circle.setAttribute('fill', 'rgba(165, 116, 78, 0.4)');
                svg.appendChild(circle);

                // Timeline with MotionPath animation
                const mpTimeline = gsap.timeline({ repeat: -1 });
                mpTimeline.to(circle, {
                    motionPath: {
                        path: path,
                        align: path,
                        alignOrigin: [0.5, 0.5],
                        autoRotate: false
                    },
                    duration: 4 + i * 0.5,
                    ease: 'sine.inOut',
                    delay: i * 0.8
                });
            }
        },
        once: true
    });
}

createMotionPathAnimation('.who-we-are');
createMotionPathAnimation('.our-work');

// ===================================================
// CANVAS REVEAL ANIMATION WITH TIMELINE
// ===================================================

function createCanvasReveal(sectionSelector, fillColor, revealType = 'circle') {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    if (sectionSelector === '.hero') return;
    if (sectionSelector === '.what-we-do' || sectionSelector === '.our-services') return;

    let canvas = section.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '100';
        canvas.style.pointerEvents = 'none';
        section.style.position = 'relative';
        section.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    resizeCanvas();

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (revealType === 'circle') {
        // Circle reveal with ScrollTrigger
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'center center',
            scrub: 1,
            onUpdate: (self) => {
                const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
                const radius = maxRadius * self.progress;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        });
    } else if (revealType === 'wipe-right') {
        const revealTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'center center',
                scrub: 1
            }
        });

        revealTimeline.to({ x: 0 }, {
            x: canvas.width,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                const x = this.targets()[0].x;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, canvas.width - x, canvas.height);
            }
        });
    } else if (revealType === 'wipe-down') {
        const revealTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'center center',
                scrub: 1
            }
        });

        revealTimeline.to({ y: 0 }, {
            y: canvas.height,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                const y = this.targets()[0].y;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height - y);
            }
        });
    } else if (revealType === 'diagonal') {
        const revealTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'center center',
                scrub: 1
            }
        });

        revealTimeline.to({ progress: 0 }, {
            progress: 1,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                const progress = this.targets()[0].progress;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = fillColor;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width * progress, 0);
                ctx.lineTo(0, canvas.height * progress);
                ctx.closePath();
                ctx.fill();
            }
        });
    }
}

createCanvasReveal('.who-we-are', '#A5744E', 'circle');
createCanvasReveal('.what-we-do', '#4D7994', 'wipe-right');
createCanvasReveal('.our-work', '#A5744E', 'wipe-down');
createCanvasReveal('.our-services', '#4D7994', 'diagonal');
createCanvasReveal('.contact', '#A5744E', 'circle');

// ===================================================
// MOUNTAIN REVEAL ANIMATIONS WITH TIMELINE
// ===================================================

function createMountainReveal(sectionSelector, mountainColor, strokeMultiplier = 1) {
    ScrollTrigger.create({
        trigger: sectionSelector,
        start: 'top 80%',
        onEnter: () => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('viewBox', '0 0 1920 1080');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.zIndex = '1';
            svg.style.pointerEvents = 'none';

            // Mountain Timeline
            const mountainTimeline = gsap.timeline();

            const mountains = [
                { points: '0,900 400,400 800,700 1200,350 1600,600 1920,400 1920,1080 0,1080', opacity: 0.9, delay: 0, strokeWidth: 4 * strokeMultiplier },
                { points: '0,950 300,500 700,800 1100,450 1500,650 1920,500 1920,1080 0,1080', opacity: 0.7, delay: 0.2, strokeWidth: 3 * strokeMultiplier },
                { points: '0,800 250,600 600,850 950,550 1350,700 1700,400 1920,600 1920,1080 0,1080', opacity: 0.5, delay: 0.4, strokeWidth: 2 * strokeMultiplier }
            ];

            mountains.forEach((mountain, index) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${mountain.points}`);
                path.setAttribute('stroke', mountainColor);
                path.setAttribute('stroke-width', mountain.strokeWidth);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('stroke-linejoin', 'round');
                path.setAttribute('opacity', '0');
                svg.appendChild(path);

                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;

                // Add SVG stroke animation to timeline
                mountainTimeline.to(path, {
                    strokeDashoffset: 0,
                    opacity: mountain.opacity,
                    duration: 0.8,
                    ease: 'power2.out'
                }, mountain.delay);

                mountainTimeline.to(path, {
                    y: -200,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power2.in'
                }, mountain.delay + 1.2);
            });

            section.appendChild(svg);
        },
        once: true
    });
}

createMountainReveal('.what-we-do', '#111A18', 0.8);
createMountainReveal('.our-services', '#111A18', 0.6);

// ===================================================
// MOUSE BLUR EFFECT ON IMAGES
// ===================================================

document.querySelectorAll('.image-placeholder').forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        const blurAmount = (1 - distance / maxDistance) * 5;
        gsap.to(img, { 
            filter: `blur(${Math.max(0, blurAmount)}px)`, 
            duration: 0.2 
        });
    });

    img.addEventListener('mouseleave', () => {
        gsap.to(img, { 
            filter: 'blur(0px)', 
            duration: 0.3 
        });
    });
});

// ===================================================
// PARTICLE EFFECT ANIMATION WITH TIMELINE
// ===================================================

function createParticles(sectionSelector) {
    ScrollTrigger.create({
        trigger: sectionSelector,
        start: 'top 70%',
        onEnter: () => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

            // Particle Timeline
            const particleTimeline = gsap.timeline();

            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 50 + '%';
                particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
                particle.style.background = Math.random() > 0.5 
                    ? 'rgba(165, 116, 78, 0.3)' 
                    : 'rgba(77, 121, 148, 0.3)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1';

                section.style.position = 'relative';
                section.appendChild(particle);

                particleTimeline.to(particle, {
                    y: Math.random() * 100 + 50,
                    opacity: 0,
                    duration: 2 + Math.random(),
                    ease: 'power1.out',
                    onComplete: () => particle.remove()
                }, Math.random() * 0.5);
            }
        },
        once: true
    });
}

createParticles('.who-we-are');
createParticles('.what-we-do');
createParticles('.our-work');
createParticles('.our-services');
createParticles('.contact');

console.log('✓ All Timelines, ScrollTriggers, SVG, and MotionPath animations initialized');