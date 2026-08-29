import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFormValidation } from '../hooks/useFormValidation';
import ParticleHeading from '../components/ParticleHeading';
import ServicesShowcase from '../components/ServicesShowcase';
import WorkCarousel from '../components/WorkCarousel';
import LineMotif from '../components/LineMotif';
import { whoWeAreCards } from '../data/homeContent';
import '../styles/home.css';

gsap.registerPlugin(ScrollTrigger);

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

      const contactTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.contact', start: 'top center', once: true },
      });
      const contactWords = document.querySelectorAll('.contact h2 .heading-word');
      contactTimeline
        .from(contactWords, { opacity: 0, rotationX: 90, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0)
        .from('.contact > p', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, 0.3);

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

      return () => cleanupFns.forEach((fn) => fn());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div id="dust-haze" />

      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/Images/Home/Intro Video.mp4" type="video/mp4" />
        </video>
        <ParticleHeading text="Rock Creative Agency" />
        <h2>Are you ready to rock the world?</h2>
        <a href="#contact" className="hero-link">
          Connect with us
        </a>
      </section>

      <section className="who-we-are">
        <LineMotif variant="corner" />
        <div className="who-we-are-box">
          <h2 className="visually-hidden">Who we are</h2>
          <div className="rolling-tape" aria-hidden="true">
            <div className="rolling-tape-track">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>Who We Are</span>
              ))}
            </div>
          </div>
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
        <LineMotif variant="columns" />
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

      <WorkCarousel />

      <ServicesShowcase />

      <section className="contact" id="contact">
        <LineMotif variant="sparse" />
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
          <svg className="form-corner-mark" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="4" y1="4" x2="20" y2="20" />
            <polyline points="20,10 20,20 10,20" />
          </svg>
        </form>
      </section>
    </div>
  );
}
