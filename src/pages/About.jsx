import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMountainAnimation } from '../hooks/useMountainAnimation';
import TeamCard from '../components/TeamCard';
import { team } from '../data/team';
import '../styles/mountain.css';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Ports Javascript/about.js. The fog/hover/reveal behavior shared by every mountain
// hero across the site lives in useMountainAnimation; everything else here (hero
// timeline, team scroll reveal, per-character heading split, canvas particle burst)
// is specific to the About page and scoped via gsap.context for cleanup on unmount.
export default function About() {
  const rootRef = useRef(null);
  const mountainRef = useRef(null);
  useMountainAnimation(mountainRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.2 })
        .to('.mountain-section h1', { duration: 1, opacity: 1, y: 0, letterSpacing: '3px', ease: 'power2.out' }, 0)
        .to('.mountain-section h2', { duration: 0.9, opacity: 1, y: 0, ease: 'power2.out' }, 0.2)
        .to('.mountain-svg', { duration: 1.3, opacity: 1, scale: 1, ease: 'elastic.out(1, 0.5)' }, 0.1)
        .to('.mountain-peak', { duration: 0.6, strokeDashoffset: 0, stagger: 0.1, ease: 'power1.inOut' }, 0.6);

      gsap.to('.intro-content p', {
        scrollTrigger: { trigger: '.intro-section', start: 'top 85%', end: 'top 35%', scrub: 1 },
        duration: 0.9,
        opacity: 1,
        y: 0,
        letterSpacing: '0.5px',
        ease: 'power2.out',
      });

      // Canvas particle burst on team section reveal — appended to document.body in
      // the original, kept there here too so it isn't clipped by any section overflow,
      // but tracked in `extraNodes` so it's removed manually since it lives outside `rootRef`.
      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', zIndex: '9999', pointerEvents: 'none' });
      document.body.appendChild(canvas);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const particles = [];
      const particleCount = prefersReducedMotion ? 30 : 60;
      let animationId;

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
        draw(c) {
          c.globalAlpha = this.life;
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          c.fill();
          c.globalAlpha = 1;
        }
      }

      function animate() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw(canvasCtx);
          if (particles[i].life <= 0) particles.splice(i, 1);
        }
        if (particles.length > 0) animationId = requestAnimationFrame(animate);
        else cancelAnimationFrame(animationId);
      }

      ScrollTrigger.create({
        trigger: '.team-section',
        start: 'top 55%',
        onEnter: () => {
          for (let i = 0; i < particleCount; i++) particles.push(new Particle());
          animate();
        },
      });

      const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', onResize, { passive: true });

      gsap.to('.team-member', {
        scrollTrigger: { trigger: '.team-section', start: 'top 65%', end: 'top 25%', scrub: 1.2 },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { amount: 0.4 },
        duration: 0.7,
        ease: 'power2.out',
      });

      const memberListeners = [];
      gsap.utils.toArray('.team-member').forEach((member) => {
        gsap.to(member, {
          scrollTrigger: { trigger: member, start: 'top 85%', toggleActions: 'play none none reverse' },
          duration: 0.5,
          rotationX: 0,
          opacity: 1,
          ease: 'power2.out',
        });
        const onEnter = () =>
          gsap.to(member, { duration: 0.25, scale: 1.06, boxShadow: '0 16px 30px rgba(165, 116, 78, 0.25)', ease: 'power2.out' });
        const onLeave = () =>
          gsap.to(member, { duration: 0.25, scale: 1, boxShadow: '0 0px 0px rgba(165, 116, 78, 0)', ease: 'power2.out' });
        member.addEventListener('mouseenter', onEnter);
        member.addEventListener('mouseleave', onLeave);
        memberListeners.push({ member, onEnter, onLeave });
      });

      gsap.utils.toArray('.team-card').forEach((card) => {
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
          onEnter: () => gsap.to(circle, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }),
        });
      });

      gsap.to('.mountain-svg', {
        scrollTrigger: { trigger: '.mountain-section', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 80,
        opacity: 0.7,
        ease: 'none',
      });

      const heading = document.querySelector('.team-section h2');
      if (heading) {
        const text = heading.textContent.trim();
        heading.textContent = '';
        text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? ' ' : char;
          span.style.opacity = '0';
          span.style.display = 'inline-block';
          heading.appendChild(span);
          gsap.to(span, {
            scrollTrigger: { trigger: '.team-section', start: 'top 75%', toggleActions: 'play none none reverse' },
            opacity: 1,
            y: 0,
            duration: 0.04,
            delay: index * 0.015,
            ease: 'power1.out',
          });
        });
      }

      gsap.utils.toArray('section').forEach((section, index) => {
        if (index === 0) return;
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 55%', scrub: 1 },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      });

      gsap.utils.toArray('.team-card').forEach((card, index) => {
        gsap.to(card, { y: 10, duration: 2.5 + index * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });

      gsap.to('.intro-content p', { color: '#A5744E', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      ScrollTrigger.refresh();
      const onWindowResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onWindowResize, { passive: true });

      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animationId);
        canvas.remove();
        memberListeners.forEach(({ member, onEnter, onLeave }) => {
          member.removeEventListener('mouseenter', onEnter);
          member.removeEventListener('mouseleave', onLeave);
        });
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
        <div className="mountain-container">
          <div className="mountain-content">
            <h1>About.</h1>
            <h2>Meet The Rock Creative Team</h2>
          </div>
          <svg className="mountain-svg" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
            <polyline className="mountain-peak mountain-peak-1" points="100,300 250,100 350,200" />
            <polyline className="mountain-peak mountain-peak-2" points="320,220 500,50 680,220" />
            <polyline className="mountain-peak mountain-peak-3" points="650,200 800,120 900,300" />
          </svg>
        </div>
      </section>

      <main>
        <section className="intro-section">
          <div className="intro-content">
            <p>
              We are creative agency that is obsessed with solving your business problem. We believe in bold,
              brave, and different thinking that sets your business apart.
            </p>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet our team.</h2>
          <div className="team-grid">
            {team.map((member) => (
              <TeamCard member={member} key={member.name} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
