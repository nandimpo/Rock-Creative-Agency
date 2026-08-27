import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useFormValidation } from '../hooks/useFormValidation';
import { whoWeAreCards, workList, serviceTags } from '../data/homeContent';
import '../styles/home.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const contactFields = [
  { name: 'firstName', type: 'text', required: true },
  { name: 'lastName', type: 'text', required: true },
  { name: 'email', type: 'email', required: true },
  { name: 'message', type: 'textarea', required: true },
];

// Ports Javascript/home.js. All of the imperative SVG/canvas/particle generation is
// kept close to the original and scoped to `rootRef` via gsap.context() so every
// tween, timeline and ScrollTrigger it creates gets torn down automatically on
// unmount (ctx.revert()) instead of leaking into the next page navigated to.
export default function Home() {
  const rootRef = useRef(null);
  const form = useFormValidation(contactFields);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cleanupFns = [];

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

        const mountains = [
          { points: '0,900 400,400 800,700 1200,350 1600,600 1920,400 1920,1080 0,1080', opacity: 0.08, duration: 8 },
          { points: '0,950 300,500 700,800 1100,450 1500,650 1920,500 1920,1080 0,1080', opacity: 0.06, duration: 10 },
          { points: '0,800 250,600 600,850 950,550 1350,700 1700,400 1920,600 1920,1080 0,1080', opacity: 0.04, duration: 12 },
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

          const pathLength = path.getTotalLength();
          path.style.strokeDasharray = pathLength;
          path.style.strokeDashoffset = pathLength;

          const mountainTl = gsap.timeline();
          mountainTl.to(path, {
            strokeDashoffset: 0,
            duration: 3 + index * 0.6,
            delay: 0.3 + index * 0.4,
            ease: 'power2.inOut',
          });
          mountainTl.to(
            path,
            {
              opacity: mountain.opacity + 0.5,
              duration: mountain.duration,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            },
            2.5 + index * 0.3
          );
        });

        for (let i = 0; i < 6; i++) {
          const x = Math.random() * 1920;
          const y = 600 + Math.random() * 300;
          const scale = 0.5 + Math.random() * 0.8;

          const tree = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          tree.setAttribute('points', `${x},${y - 40 * scale} ${x - 20 * scale},${y + 30 * scale} ${x + 20 * scale},${y + 30 * scale}`);
          tree.setAttribute('fill', 'rgba(77, 121, 148, 0.1)');
          tree.setAttribute('opacity', '0.3');
          svg.appendChild(tree);

          gsap.to(tree, { opacity: 0.6, duration: 3 + Math.random() * 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }

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

          gsap.to(circle, { attr: { r: 150 }, 'stroke-width': 0, opacity: 0, duration: 3, repeat: -1, ease: 'power1.out' });
        }

        hero.appendChild(svg);
      }
      createHeroSVG();

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
          totalWidth += text[i] !== ' ' ? charWidth : charWidth * 0.5;
        }
        let xPosition = (1600 - totalWidth) / 2;

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

          waveTimeline.fromTo(
            tspan,
            { attr: { y: 140 }, opacity: 0 },
            { attr: { y: 120 }, opacity: 1, duration: 0.6, ease: 'back.out' },
            delay
          );
          waveTimeline.to(tspan, { attr: { y: 100 }, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }, delay + 0.6);

          svg.appendChild(tspan);
          xPosition += charWidth;
        }

        h1.appendChild(svg);
      }
      gsap.delayedCall(0.3, createWaveTextAnimation);

      function createServiceSVGs() {
        const serviceTagEls = document.querySelectorAll('.service-tag');

        const designs = [
          () => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M12,3 L20,18 L4,18 Z M12,8 L16,15 L8,15 Z');
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('opacity', '0.8');
            return path;
          },
          () => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('fill', 'currentColor');
            g.setAttribute('opacity', '0.7');
            const m1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            m1.setAttribute('points', '3,18 8,8 12,15 18,18');
            const m2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            m2.setAttribute('points', '12,18 18,10 22,14 24,18');
            g.append(m1, m2);
            return g;
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
            g.append(mountain, circle);
            return g;
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
            g.append(sun, mountain);
            return g;
          },
          () => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('fill', 'currentColor');
            for (let i = 0; i < 5; i++) {
              const tree = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
              const x = 3 + i * 4;
              tree.setAttribute('points', `${x},20 ${x - 2},15 ${x + 2},15`);
              tree.setAttribute('opacity', String(0.5 + i * 0.1));
              g.appendChild(tree);
            }
            return g;
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
            return g;
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
            return g;
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
            g.append(sky, land);
            return g;
          },
        ];

        serviceTagEls.forEach((tag, index) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '24');
          svg.setAttribute('height', '24');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('style', 'display: inline-block; margin-right: 10px; vertical-align: middle;');
          svg.appendChild(designs[index % designs.length]());
          tag.insertBefore(svg, tag.firstChild);

          const onEnter = () => gsap.to(svg, { scale: 1.3, rotation: 15, duration: 0.6, ease: 'back.out' });
          const onLeave = () => gsap.to(svg, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out' });
          tag.addEventListener('mouseenter', onEnter);
          tag.addEventListener('mouseleave', onLeave);
          cleanupFns.push(() => {
            tag.removeEventListener('mouseenter', onEnter);
            tag.removeEventListener('mouseleave', onLeave);
          });
        });
      }
      gsap.delayedCall(0.5, createServiceSVGs);

      gsap.to('.hero', {
        backgroundPosition: '50% 100%',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });

      gsap
        .timeline()
        .from('.hero h2', { opacity: 0, y: 30, duration: 1, delay: 0.4, immediateRender: false })
        .from('.hero .btn', { opacity: 0, y: 30, duration: 1.5, immediateRender: false }, '-=0.5');

      function createSectionTimeline(sectionSelector, headingSelector, paragraphSelector, cardSelector) {
        const sectionTimeline = gsap.timeline({
          scrollTrigger: { trigger: sectionSelector, start: 'top center', once: true },
        });

        const words = document.querySelectorAll(`${sectionSelector} ${headingSelector} .heading-word`);
        if (words.length > 0) {
          sectionTimeline.from(words, { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'back.out' }, 0);
        }
        if (paragraphSelector) {
          sectionTimeline.from(`${sectionSelector} ${paragraphSelector}`, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, 0.3);
        }
        if (cardSelector) {
          const cards = document.querySelectorAll(`${sectionSelector} ${cardSelector}`);
          if (cards.length > 0) {
            sectionTimeline.from(cards, { opacity: 0, y: 20, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, 0.6);
          }
        }
        return sectionTimeline;
      }
      createSectionTimeline('.who-we-are', 'h2', 'p', '.who-we-are-card');
      createSectionTimeline('.what-we-do', '.text-content h2', '.text-content p', null);
      createSectionTimeline('.our-work', '.work-content h2', null, '.work-list li');

      const servicesTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.our-services', start: 'top center', once: true },
      });
      const servicesHeadingWords = document.querySelectorAll('.our-services .services-content h2 .heading-word');
      if (servicesHeadingWords.length > 0) {
        servicesTimeline.from(servicesHeadingWords, { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'back.out' }, 0);
      }

      const contactTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.contact', start: 'top center', once: true },
      });
      const contactWords = document.querySelectorAll('.contact h2 .heading-word');
      contactTimeline
        .from(contactWords, { opacity: 0, rotationX: 90, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0)
        .from('.contact > p', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, 0.3);

      function createMotionPathAnimation(sectionSelector) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

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

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `motionPath-${sectionSelector.replace(/[^\w-]/g, '')}`);
        path.setAttribute('d', 'M0,300 Q250,100 500,300 T1000,300');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');
        svg.appendChild(path);

        section.style.position = 'relative';
        section.insertBefore(svg, section.firstChild);

        ScrollTrigger.create({
          trigger: sectionSelector,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            for (let i = 0; i < 4; i++) {
              const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              circle.setAttribute('r', '8');
              circle.setAttribute('fill', 'rgba(165, 116, 78, 0.4)');
              svg.appendChild(circle);

              gsap.timeline({ repeat: -1 }).to(circle, {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false },
                duration: 4 + i * 0.5,
                ease: 'sine.inOut',
                delay: i * 0.8,
              });
            }
          },
        });
      }
      createMotionPathAnimation('.who-we-are');
      createMotionPathAnimation('.our-work');

      function createCanvasReveal(sectionSelector, fillColor, revealType = 'circle') {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        if (sectionSelector === '.hero') return;
        if (sectionSelector === '.what-we-do' || sectionSelector === '.our-services') return;

        let canvas = section.querySelector('canvas');
        if (!canvas) {
          canvas = document.createElement('canvas');
          Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '100',
            pointerEvents: 'none',
          });
          section.style.position = 'relative';
          section.appendChild(canvas);
        }

        const ctx2d = canvas.getContext('2d');
        const resizeCanvas = () => {
          canvas.width = section.offsetWidth;
          canvas.height = section.offsetHeight;
        };
        resizeCanvas();
        ctx2d.fillStyle = fillColor;
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);

        if (revealType === 'circle') {
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'center center',
            scrub: 1,
            onUpdate: (self) => {
              const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
              const radius = maxRadius * self.progress;
              ctx2d.clearRect(0, 0, canvas.width, canvas.height);
              ctx2d.fillStyle = fillColor;
              ctx2d.fillRect(0, 0, canvas.width, canvas.height);
              ctx2d.globalCompositeOperation = 'destination-out';
              ctx2d.beginPath();
              ctx2d.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
              ctx2d.fill();
              ctx2d.globalCompositeOperation = 'source-over';
            },
          });
        } else if (revealType === 'wipe-right') {
          gsap.timeline({ scrollTrigger: { trigger: section, start: 'top center', end: 'center center', scrub: 1 } }).to(
            { x: 0 },
            {
              x: canvas.width,
              duration: 2,
              ease: 'power2.inOut',
              onUpdate: function () {
                const x = this.targets()[0].x;
                ctx2d.clearRect(0, 0, canvas.width, canvas.height);
                ctx2d.fillStyle = fillColor;
                ctx2d.fillRect(0, 0, canvas.width - x, canvas.height);
              },
            }
          );
        } else if (revealType === 'wipe-down') {
          gsap.timeline({ scrollTrigger: { trigger: section, start: 'top center', end: 'center center', scrub: 1 } }).to(
            { y: 0 },
            {
              y: canvas.height,
              duration: 2,
              ease: 'power2.inOut',
              onUpdate: function () {
                const y = this.targets()[0].y;
                ctx2d.clearRect(0, 0, canvas.width, canvas.height);
                ctx2d.fillStyle = fillColor;
                ctx2d.fillRect(0, 0, canvas.width, canvas.height - y);
              },
            }
          );
        } else if (revealType === 'diagonal') {
          gsap.timeline({ scrollTrigger: { trigger: section, start: 'top center', end: 'center center', scrub: 1 } }).to(
            { progress: 0 },
            {
              progress: 1,
              duration: 2,
              ease: 'power2.inOut',
              onUpdate: function () {
                const progress = this.targets()[0].progress;
                ctx2d.clearRect(0, 0, canvas.width, canvas.height);
                ctx2d.fillStyle = fillColor;
                ctx2d.beginPath();
                ctx2d.moveTo(0, 0);
                ctx2d.lineTo(canvas.width * progress, 0);
                ctx2d.lineTo(0, canvas.height * progress);
                ctx2d.closePath();
                ctx2d.fill();
              },
            }
          );
        }
      }
      createCanvasReveal('.who-we-are', '#A5744E', 'circle');
      createCanvasReveal('.what-we-do', '#4D7994', 'wipe-right');
      createCanvasReveal('.our-work', '#A5744E', 'wipe-down');
      createCanvasReveal('.our-services', '#4D7994', 'diagonal');
      createCanvasReveal('.contact', '#A5744E', 'circle');

      document.querySelectorAll('.image-placeholder').forEach((img) => {
        const onMove = (e) => {
          const rect = img.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const distance = Math.sqrt(x * x + y * y);
          const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
          const blurAmount = (1 - distance / maxDistance) * 5;
          gsap.to(img, { filter: `blur(${Math.max(0, blurAmount)}px)`, duration: 0.2 });
        };
        const onLeave = () => gsap.to(img, { filter: 'blur(0px)', duration: 0.3 });
        img.addEventListener('mousemove', onMove);
        img.addEventListener('mouseleave', onLeave);
        cleanupFns.push(() => {
          img.removeEventListener('mousemove', onMove);
          img.removeEventListener('mouseleave', onLeave);
        });
      });

      function createParticles(sectionSelector) {
        ScrollTrigger.create({
          trigger: sectionSelector,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;
            const particleTimeline = gsap.timeline();
            for (let i = 0; i < 20; i++) {
              const particle = document.createElement('div');
              Object.assign(particle.style, {
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: Math.random() * 50 + '%',
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: Math.random() > 0.5 ? 'rgba(165, 116, 78, 0.3)' : 'rgba(77, 121, 148, 0.3)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: '1',
              });
              section.style.position = 'relative';
              section.appendChild(particle);

              particleTimeline.to(
                particle,
                {
                  y: Math.random() * 100 + 50,
                  opacity: 0,
                  duration: 2 + Math.random(),
                  ease: 'power1.out',
                  onComplete: () => particle.remove(),
                },
                Math.random() * 0.5
              );
            }
          },
        });
      }
      createParticles('.who-we-are');
      createParticles('.what-we-do');
      createParticles('.our-work');
      createParticles('.our-services');
      createParticles('.contact');

      return () => cleanupFns.forEach((fn) => fn());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div id="dust-haze" />

      <section className="hero" style={{ backgroundImage: "url('/Images/Home/rock.jpg')" }}>
        <h1>Rock Creative Agency</h1>
        <h2>We are always solid.</h2>
        <a href="#contact">
          <button className="btn">Connect with us</button>
        </a>
      </section>

      <section className="who-we-are">
        <div className="who-we-are-box">
          <h2>
            <span className="heading-word">Who</span> <span className="heading-word">we</span>{' '}
            <span className="heading-word">are</span>
          </h2>
          <p>
            We're more than just a creative agency — we're your trusted partner in bringing bold visions to
            life. At Rock, we believe every client deserves a safe space where creativity flourishes and ideas
            transform into reality.
          </p>

          <div className="who-we-are-cards">
            {whoWeAreCards.map((card) => (
              <div className="who-we-are-card" key={card.label}>
                <div className="who-we-are-card-image" style={{ backgroundImage: `url('${card.image}')` }} />
                <p className="who-we-are-card-label">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="what-we-do">
        <div className="content-wrapper">
          <div className="text-content">
            <h2>
              <span className="heading-word">What</span> <span className="heading-word">we</span>{' '}
              <span className="heading-word">do</span>
            </h2>
            <p>
              If you want to truly see what we do. Our Fashion production is where to start. This showcases our
              all encompassing skills.
            </p>
            <Link to="/expertise">
              <button className="btn">Flagship Project</button>
            </Link>
          </div>
          <div className="image-placeholder" style={{ backgroundImage: "url('/Images/Home/Mannequins.jpg')" }} />
        </div>
      </section>

      <section className="our-work">
        <div className="content-wrapper">
          <div
            className="image-placeholder"
            style={{ backgroundImage: "url('/Images/Home/Togetherness (home).jpg')" }}
          />
          <div className="work-content">
            <h2>
              <span className="heading-word">Our</span> <span className="heading-word">Work</span>
            </h2>
            <ul className="work-list">
              {workList.map((item) => (
                <li key={item.title}>
                  <Link to={item.to}>{item.title}</Link>
                </li>
              ))}
            </ul>
            <Link to="/work">
              <button className="btn">Explore</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="our-services">
        <div className="content-wrapper">
          <div
            className="image-placeholder"
            style={{ backgroundImage: "url('/Images/Home/Production (Home).jpg')" }}
          />
          <div className="services-content">
            <h2>
              <span className="heading-word">Our</span> <span className="heading-word">Services</span>
            </h2>
            <div className="services-grid">
              {serviceTags.map((label) => (
                <span className="service-tag" key={label}>
                  <Link to="/services">{label}</Link>
                </span>
              ))}
            </div>
            <Link to="/services">
              <button className="btn">Explore</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <h2>
          <span className="heading-word">How</span> <span className="heading-word">can</span>{' '}
          <span className="heading-word">we</span> <span className="heading-word">help?</span>
        </h2>
        <p>We'd love to hear from you. Tell us a bit about your project — or just say hello!</p>
        <form className="contact-form" onSubmit={form.handleSubmit}>
          {form.success && <div className="success-message show">✓ Message sent successfully! We'll get back to you soon.</div>}
          <input
            type="text"
            placeholder="First Name*"
            required
            className={form.status.firstName}
            value={form.values.firstName}
            onChange={(e) => form.handleChange('firstName', e.target.value)}
            onBlur={() => form.handleBlur('firstName')}
          />
          <input
            type="text"
            placeholder="Last Name*"
            required
            className={form.status.lastName}
            value={form.values.lastName}
            onChange={(e) => form.handleChange('lastName', e.target.value)}
            onBlur={() => form.handleBlur('lastName')}
          />
          <input
            type="email"
            placeholder="Email*"
            required
            className={form.status.email}
            value={form.values.email}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
          />
          <textarea
            placeholder="How can we help?*"
            required
            className={form.status.message}
            value={form.values.message}
            onChange={(e) => form.handleChange('message', e.target.value)}
            onBlur={() => form.handleBlur('message')}
          />
          <button type="submit" className="btn">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
