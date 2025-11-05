// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

console.log('SVG & GSAP Animations loaded');

// ===================================================
// HERO SVG ANIMATIONS
// ===================================================

// Create animated SVG background for hero
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

    // Create defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Animated mountain layers - with sunrise animation
    const mountains = [
        { points: '0,900 400,400 800,700 1200,350 1600,600 1920,400 1920,1080 0,1080', opacity: 0.08, delay: 0, duration: 8 },
        { points: '0,950 300,500 700,800 1100,450 1500,650 1920,500 1920,1080 0,1080', opacity: 0.06, delay: 1, duration: 10 },
        { points: '0,800 250,600 600,850 950,550 1350,700 1700,400 1920,600 1920,1080 0,1080', opacity: 0.04, delay: 2, duration: 12 }
    ];

    mountains.forEach((mountain, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${mountain.points}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', `#111A18`);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);

        // Get the total path length for stroke animation
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        // Animate the stroke drawing
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3 + index * 0.6,
            delay: 0.3 + index * 0.4,
            ease: 'power2.inOut'
        });

        // Continuous breathing animation after sunrise
        gsap.to(path, {
            attr: {
                d: `M${mountain.points.replace(/(\d+)/g, (match) => parseInt(match) + Math.sin(Math.random() * Math.PI) * 30)}`
            },
            opacity: mountain.opacity + 0.5,
            duration: mountain.duration,
            delay: 2.5 + index * 0.3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    });

    // Animated trees/pine shapes
    for (let i = 0; i < 6; i++) {
        const x = Math.random() * 1920;
        const y = 600 + Math.random() * 300;
        const scale = 0.5 + Math.random() * 0.8;
        
        const tree = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        tree.setAttribute('points', `${x},${y-40*scale} ${x-20*scale},${y+30*scale} ${x+20*scale},${y+30*scale}`);
        tree.setAttribute('fill', 'rgba(77, 121, 148, 0.1)');
        tree.setAttribute('opacity', '0.3');
        svg.appendChild(tree);

        gsap.to(tree, {
            opacity: 0.6,
            duration: 3 + Math.random() * 2,
            delay: i * 0.3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    // Animated mist/clouds
    for (let i = 0; i < 4; i++) {
        const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        const cx = Math.random() * 1920;
        const cy = 200 + Math.random() * 300;
        ellipse.setAttribute('cx', cx);
        ellipse.setAttribute('cy', cy);
        ellipse.setAttribute('rx', '200 + Math.random() * 150');
        ellipse.setAttribute('ry', '80 + Math.random() * 50');
        ellipse.setAttribute('fill', 'rgba(242, 217, 117, 0.05)');
        svg.appendChild(ellipse);

        gsap.to(ellipse, {
            attr: { cx: cx + 200 },
            opacity: 0,
            duration: 8 + Math.random() * 4,
            delay: i * 2,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    // Animated water ripples
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

        gsap.to(circle, {
            attr: { r: 150 },
            'stroke-width': 0,
            opacity: 0,
            duration: 3,
            delay: i * 1,
            repeat: -1,
            ease: 'power1.out'
        });
    }

    hero.appendChild(svg);
}

// Create hero SVG on page load
window.addEventListener('load', createHeroSVG);

// ===================================================
// HERO H1 WAVE TEXT ANIMATION
// ===================================================

function createWaveTextAnimation() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    const text = h1.textContent;
    h1.textContent = '';

    // Create SVG for wave effect
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 1600 200');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    const charWidth = 50;

    // Calculate total width needed
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
            totalWidth += charWidth;
        } else {
            totalWidth += charWidth * 0.5;
        }
    }
    
    // Start position centered
    let xPosition = (1600 - totalWidth) / 2;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Skip spaces but add width
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

        // Add wave animation to each character
        const duration = 0.6;
        const delay = i * 0.08;

        gsap.fromTo(tspan, 
            {
                attr: { y: 140 },
                opacity: 0
            },
            {
                attr: { y: 120 },
                opacity: 1,
                duration: duration,
                delay: delay,
                ease: 'back.out',
                onComplete: () => {
                    // Continuous wave animation after initial animation
                    gsap.to(tspan, {
                        attr: { y: 100 },
                        duration: 2,
                        delay: 0.2,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1
                    });
                }
            }
        );

        svg.appendChild(tspan);
        xPosition += charWidth;
    }

    h1.appendChild(svg);
}

// Initialize wave animation on page load
window.addEventListener('load', () => {
    setTimeout(createWaveTextAnimation, 300);
});

// ===================================================
// ANIMATED SVG SERVICE ICONS - NATURE THEMED
// ===================================================

function createServiceSVGs() {
    const serviceTags = document.querySelectorAll('.service-tag');
    
    serviceTags.forEach((tag, index) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('style', 'display: inline-block; margin-right: 10px; vertical-align: middle;');

        // Nature and mountain themed designs
        const designs = [
            // Branding - Mountain peak
            () => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,3 L20,18 L4,18 Z M12,8 L16,15 L8,15 Z');
                path.setAttribute('fill', 'currentColor');
                path.setAttribute('opacity', '0.8');
                svg.appendChild(path);
            },
            // Social Media - Connected mountains
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
            // Production - Camera on mountain
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
            // Post Production - Sun over mountain
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
            // Public Relations - Forest/trees
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
            // Creative Direction - Stone/rock
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
            // Pre Production - Water/wave
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
            // Audio/Visual - Landscape
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

        // Execute design function
        designs[index % designs.length]();

        tag.insertBefore(svg, tag.firstChild);

        // Animate on hover
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

// Create service SVGs after page load
window.addEventListener('load', () => {
    setTimeout(createServiceSVGs, 500);
});

// ===================================================
// HERO SECTION ANIMATIONS
// ===================================================

// Hero parallax on scroll
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

// Fade in hero h2
gsap.from('.hero h2', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.4,
    immediateRender: false
});

// Fade in button on hero
gsap.from('.hero .btn', {
    opacity: 0,
    y: 30,
    duration: 1.5,
    delay: 0.6,
    immediateRender: false
});

// ===================================================
// SCROLL-TRIGGERED HEADING ANIMATIONS
// ===================================================

// Animation 1: Who We Are - Bounce In Up
function animateWhoWeAreHeading() {
    const words = document.querySelectorAll('.who-we-are-box h2 .heading-word');
    
    gsap.from(words, {
        scrollTrigger: {
            trigger: '.who-we-are',
            start: 'top center',
            once: true
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: 1.5, // Reduced from 2.2
        stagger: 0.1,
        ease: 'back.out'
    });
}

// Animation 1b: Who We Are - Paragraph
function animateWhoWeAreParagraph() {
    gsap.from('.who-we-are-box p', {
        scrollTrigger: {
            trigger: '.who-we-are',
            start: 'top center',
            once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.8, // Reduced from 2.5
        ease: 'power2.out'
    });
}

// Animation 2: What We Do - Slide & Rotate
function animateWhatWeDoHeading() {
    const words = document.querySelectorAll('.text-content h2 .heading-word');
    
    gsap.from(words, {
        scrollTrigger: {
            trigger: '.what-we-do',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        x: -50,
        rotationY: 90,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
}

// Animation 2b: What We Do - Paragraph
function animateWhatWeDoP() {
    gsap.from('.text-content p', {
        scrollTrigger: {
            trigger: '.what-we-do',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out'
    });
}

// Animation 3: Our Work - Elastic Scale
function animateOurWorkHeading() {
    const words = document.querySelectorAll('.work-content h2 .heading-word');
    
    gsap.from(words, {
        scrollTrigger: {
            trigger: '.our-work',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        scale: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'back.out'
    });
}

// Animation 4: Our Services - Wave Effect
function animateOurServicesHeading() {
    const words = document.querySelectorAll('.services-content h2 .heading-word');
    
    gsap.from(words, {
        scrollTrigger: {
            trigger: '.our-services',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        y: 30,
        skewX: -10,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out'
    });
}

// Animation 5: Contact - Flip & Fade
function animateContactHeading() {
    const words = document.querySelectorAll('.contact h2 .heading-word');
    
    gsap.from(words, {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            once: true
        },
        opacity: 0,
        rotationX: 90,
        duration: 0.8,
        delay: 1.5, // Reduced from 2.2
        stagger: 0.1,
        ease: 'power2.out'
    });
}

// Animation 5b: Contact - Paragraph
function animateContactParagraph() {
    gsap.from('.contact > p', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.8, // Reduced from 2.5
        ease: 'power2.out'
    });
}

// Call all heading animations when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        animateWhoWeAreHeading();
        animateWhoWeAreParagraph();
        animateWhatWeDoHeading();
        animateWhatWeDoP();
        animateOurWorkHeading();
        animateOurServicesHeading();
        animateContactHeading();
        animateContactParagraph();
    }, 500);
});

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
// CANVAS REVEAL ANIMATION - DYNAMIC REVEALS
// ===================================================

function createCanvasReveal(sectionSelector, fillColor, revealType = 'circle') {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    if (sectionSelector === '.hero') return;
    
    // Skip reveal for What We Do and Our Services - they'll use SVG mountains instead
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

    // Fill canvas completely with solid color on load
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (revealType === 'circle') {
        // Circle reveal that opens as user scrolls
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
        // Wipe from left to right
        gsap.to({ x: 0 }, {
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
        // Wipe from top to bottom
        gsap.to({ y: 0 }, {
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
        // Diagonal wipe from top-left to bottom-right
        gsap.to({ progress: 0 }, {
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
// MOUNTAIN REVEAL ANIMATIONS FOR WHAT WE DO & OUR SERVICES
// ===================================================

function createMountainReveal(sectionSelector, mountainColor, strokeMultiplier = 1) {
    ScrollTrigger.create({
        trigger: sectionSelector,
        start: 'top 80%',
        onEnter: () => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

            // Create SVG for mountains
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

            // Create animated mountain layers
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

                // Get the total path length for stroke animation
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;

                // Animate the stroke drawing
                gsap.to(path, {
                    strokeDashoffset: 0,
                    opacity: mountain.opacity,
                    duration: 0.8,
                    delay: mountain.delay,
                    ease: 'power2.out'
                });

                // Animate upward and fade out
                gsap.to(path, {
                    y: -200,
                    opacity: 0,
                    duration: 1.2,
                    delay: 1.2 + mountain.delay,
                    ease: 'power2.in'
                });
            });

            section.appendChild(svg);
        },
        once: true
    });
}

createMountainReveal('.what-we-do', '#111A18', 0.8);
createMountainReveal('.our-services', '#111A18', 0.6);

// ===================================================
// SECTION-SPECIFIC ANIMATIONS
// ===================================================

gsap.utils.toArray('.who-we-are-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: '.who-we-are',
            start: 'top center',
            once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 2.1 + index * 0.2 // Reduced from 2.5
    });
});

gsap.from('.what-we-do .image-placeholder', {
    scrollTrigger: {
        trigger: '.what-we-do',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: 30,
    duration: 1
});

gsap.from('.text-content', {
    scrollTrigger: {
        trigger: '.what-we-do',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: -30,
    duration: 1
});

gsap.utils.toArray('.work-list li').forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: '.our-work',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        x: -20,
        duration: 0.8,
        delay: index * 0.1
    });
});

gsap.from('.our-work .image-placeholder', {
    scrollTrigger: {
        trigger: '.our-work',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: -30,
    duration: 1
});

gsap.utils.toArray('.service-tag').forEach((tag, index) => {
    gsap.from(tag, {
        scrollTrigger: {
            trigger: '.our-services',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: index * 0.05
    });
});

gsap.from('.our-services .image-placeholder', {
    scrollTrigger: {
        trigger: '.our-services',
        start: 'top 70%',
        once: true
    },
    opacity: 0,
    x: 30,
    duration: 1
});

gsap.utils.toArray('.contact-form input, .contact-form textarea').forEach((el, index) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 2.1 + index * 0.1 // Reduced from 2.5
    });
});

gsap.from('.contact .btn', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top center',
        once: true
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 2.8 // Reduced from 3.5
});

// ===================================================
// PARTICLE EFFECT ANIMATION
// ===================================================

function createParticles(sectionSelector) {
    ScrollTrigger.create({
        trigger: sectionSelector,
        start: 'top 70%',
        onEnter: () => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

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

                gsap.to(particle, {
                    y: Math.random() * 100 + 50,
                    opacity: 0,
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                    onComplete: () => particle.remove()
                });
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