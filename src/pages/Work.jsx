import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMountainAnimation } from '../hooks/useMountainAnimation';
import { useDragScroll } from '../hooks/useDragScroll';
import WorkCard from '../components/WorkCard';
import { workProjects } from '../data/workProjects';
import '../styles/mountain.css';
import '../styles/work.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Ports Javascript/work.js and Javascript/work card.js. The energy-orb and
// ambient-light spotlight are appended to document.body in the original; here
// they're portaled there instead so React owns their lifecycle and removes them
// automatically on unmount rather than leaking across route changes.
export default function Work() {
  const rootRef = useRef(null);
  const mountainRef = useRef(null);
  const containerRef = useRef(null);
  const orbRef = useRef(null);
  const spotlightRef = useRef(null);
  const [openCards, setOpenCards] = useState(() => new Set());

  useMountainAnimation(mountainRef);
  useDragScroll(containerRef);

  const toggleCard = (slug) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };
  const closeCard = (slug) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.portfolio-card')) setOpenCards(new Set());
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const overlay = document.querySelector('.rock-overlay');
      const shards = document.querySelectorAll('.rock-shard');
      const title = document.querySelector('.mountain-container h1');
      const subtitle = document.querySelector('.mountain-container h2');
      const svgPaths = document.querySelectorAll('.mountain-svg path');

      if (overlay && shards.length) {
        const glow = document.createElement('div');
        glow.classList.add('crack-glow');
        overlay.appendChild(glow);

        const tl = gsap.timeline({ delay: 0.6 });
        tl.to(glow, { opacity: 1, scale: 1.2, duration: 0.25, ease: 'power2.inOut' }).to(
          glow,
          { opacity: 0, duration: 0.8, ease: 'power2.out' },
          '+=0.1'
        );

        shards.forEach((shard, i) => {
          const randomX = gsap.utils.random(-window.innerWidth * 0.3, window.innerWidth * 0.3);
          const randomY = gsap.utils.random(window.innerHeight * 0.3, window.innerHeight * 0.8);
          const randomRot = gsap.utils.random(-90, 90);
          tl.to(
            shard,
            { x: randomX, y: randomY, rotation: randomRot, opacity: 0, duration: 1.6, ease: 'power3.inOut' },
            0.2 + i * 0.08
          );
        });

        tl.to(
          overlay,
          { x: gsap.utils.random(-8, 8), y: gsap.utils.random(-8, 8), duration: 0.08, yoyo: true, repeat: 5, ease: 'power1.inOut' },
          0.2
        );
        tl.to(overlay, { opacity: 0, duration: 1.2, ease: 'power2.out', onComplete: () => overlay.remove() }, '-=0.8');
        tl.fromTo(
          [title, subtitle],
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', stagger: 0.2 },
          '-=0.5'
        );

        gsap.to(title, { y: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }

      if (svgPaths.length) {
        svgPaths.forEach((path, i) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, stroke: '#F2D275', strokeWidth: 2, fill: 'none' });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3 + i,
            ease: 'power2.out',
            delay: 1.5,
            scrollTrigger: { trigger: '.mountain-svg', start: 'top 85%', toggleActions: 'play none none reverse' },
          });
        });
      }

      document.querySelectorAll('.portfolio-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          opacity: 0,
          y: 80,
          scale: 0.9,
          duration: 1,
          ease: 'power3.out',
          delay: i * 0.05,
        });
      });

      const energyOrb = orbRef.current;
      if (energyOrb) {
        gsap.to(energyOrb, {
          motionPath: {
            path: [
              { x: 0, y: window.innerHeight * 0.2 },
              { x: window.innerWidth / 2, y: window.innerHeight * 0.4 },
              { x: window.innerWidth, y: window.innerHeight * 0.3 },
            ],
            curviness: 1.25,
          },
          ease: 'power1.inOut',
          duration: 6,
          repeat: -1,
          yoyo: true,
        });
      }

      gsap
        .timeline({ scrollTrigger: { trigger: '.intro-text', start: 'top 80%', end: 'bottom 60%', scrub: true } })
        .from('.intro-text', { opacity: 0, y: 40, duration: 1.5, ease: 'power2.out' })
        .to('.intro-text', { textShadow: '0 0 20px rgba(242,210,117,0.6)', duration: 1.5, ease: 'sine.inOut' })
        .to('.intro-text', { textShadow: '0 0 0px rgba(242,210,117,0.0)', duration: 1.2, ease: 'sine.inOut' });

      const spotlight = spotlightRef.current;
      let onMouseMove;
      let onClick;
      if (spotlight) {
        gsap.set(spotlight, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const moveX = gsap.quickTo(spotlight, 'x', { duration: 0.6, ease: 'power3.out' });
        const moveY = gsap.quickTo(spotlight, 'y', { duration: 0.6, ease: 'power3.out' });

        onMouseMove = (e) => {
          moveX(e.clientX - 150);
          moveY(e.clientY - 150);
        };
        window.addEventListener('mousemove', onMouseMove);

        gsap.to(spotlight, { scale: 1.1, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to(spotlight, {
          scrollTrigger: { trigger: '.portfolio-wrapper', start: 'top 90%', end: 'bottom 10%', scrub: true },
          opacity: 1,
          scale: 1.5,
          ease: 'sine.inOut',
        });

        gsap
          .timeline({ repeat: -1, repeatDelay: 3 })
          .to(spotlight, { opacity: 1, duration: 0.05 })
          .to(spotlight, { opacity: 0.4, duration: 0.1 })
          .to(spotlight, { opacity: 0.9, duration: 0.07 })
          .to(spotlight, { opacity: 0.5, duration: 0.09 })
          .to(spotlight, { opacity: 0.85, duration: 0.1 });

        onClick = () => {
          gsap.fromTo(
            spotlight,
            { opacity: 1, scale: 1 },
            { opacity: 1.3, scale: 1.6, duration: 0.3, ease: 'power2.inOut', yoyo: true, repeat: 1 }
          );
        };
        window.addEventListener('click', onClick);
      }

      return () => {
        if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
        if (onClick) window.removeEventListener('click', onClick);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section
        className="mountain-section"
        ref={mountainRef}
        style={{ backgroundImage: "url('/Images/Home/rock.jpg')" }}
      >
        <div className="rock-overlay">
          <div className="rock-shard shard-1" />
          <div className="rock-shard shard-2" />
          <div className="rock-shard shard-3" />
          <div className="rock-shard shard-4" />
          <div className="rock-shard shard-5" />
        </div>

        <div className="mountain-container">
          <h1>The Work.</h1>
          <h2>We work hard for everyone, and we&rsquo;ll work hard for you!</h2>

          <svg className="mountain-svg" viewBox="0 0 800 400">
            <path className="mountain-peak mountain-peak-1" d="M0 350 L150 200 L300 350" />
            <path className="mountain-peak mountain-peak-2" d="M250 350 L400 180 L550 350" />
            <path className="mountain-peak mountain-peak-3" d="M500 350 L650 210 L800 350" />
          </svg>
        </div>
      </section>

      <main>
        <p className="intro-text">One great thing about creative is that the work speaks for itself</p>

        <div className="portfolio-wrapper">
          <div className="portfolio-container" ref={containerRef}>
            {workProjects.map((project) => (
              <WorkCard
                project={project}
                isOpen={openCards.has(project.slug)}
                onToggle={() => toggleCard(project.slug)}
                onClose={() => closeCard(project.slug)}
                key={project.slug}
              />
            ))}
          </div>
        </div>
        <p className="scroll-hint">← Scroll to explore →</p>
      </main>

      {createPortal(<div className="energy-orb" ref={orbRef} />, document.body)}
      {createPortal(<div className="ambient-light" ref={spotlightRef} />, document.body)}
    </div>
  );
}
