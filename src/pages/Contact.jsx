import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMountainAnimation } from '../hooks/useMountainAnimation';
import { useFormValidation } from '../hooks/useFormValidation';
import '../styles/mountain.css';
import '../styles/contact.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const contactFields = [
  { name: 'name', type: 'text', required: true },
  { name: 'email', type: 'email', required: true },
  { name: 'phone', type: 'text', required: false },
  { name: 'hearAbout', type: 'text', required: false },
  { name: 'message', type: 'textarea', required: true },
];

// Ports Javascript/contact.js. The footer entrance animation from the original is
// dropped here: the footer is now a single component mounted once at the app root
// (App.jsx) rather than remounting per page, so re-triggering an "enter" reveal every
// time this page mounts would look wrong once it has already been visible elsewhere.
export default function Contact() {
  const rootRef = useRef(null);
  const mountainRef = useRef(null);
  const contactSectionRef = useRef(null);
  const form = useFormValidation(contactFields);
  useMountainAnimation(mountainRef);

  useEffect(() => {
    let animationId;
    let onResize;

    const ctx = gsap.context(() => {
      const hero = mountainRef.current;
      const contact = contactSectionRef.current;
      if (!hero || !contact) return;

      const smokeCanvas = document.createElement('canvas');
      smokeCanvas.classList.add('dark-smoke-layer');
      hero.appendChild(smokeCanvas);

      const smokeCtx = smokeCanvas.getContext('2d');
      let w, h;
      const smokes = [];
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const resize = () => {
        w = smokeCanvas.width = hero.offsetWidth;
        h = smokeCanvas.height = hero.offsetHeight;
      };
      onResize = resize;
      window.addEventListener('resize', resize, { passive: true });
      resize();

      for (let i = 0; i < 60; i++) {
        smokes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 150 + 80,
          growth: Math.random() * 0.2 + 0.1,
          alpha: Math.random() * 0.3 + 0.2,
          driftX: (Math.random() - 0.5) * 0.2,
          driftY: (Math.random() - 0.8) * 0.3,
        });
      }

      function drawSmoke() {
        smokeCtx.fillStyle = 'rgba(17,26,24,0.05)';
        smokeCtx.fillRect(0, 0, w, h);

        for (const s of smokes) {
          const g = smokeCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
          g.addColorStop(0, `rgba(17,26,24,${s.alpha})`);
          g.addColorStop(1, 'transparent');
          smokeCtx.fillStyle = g;
          smokeCtx.beginPath();
          smokeCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          smokeCtx.fill();

          s.x += s.driftX;
          s.y += s.driftY;
          s.r += s.growth;
          s.alpha *= 0.995;

          if (s.r > 350 || s.alpha < 0.05) {
            s.x = Math.random() * w;
            s.y = h + 80;
            s.r = Math.random() * 100 + 60;
            s.alpha = Math.random() * 0.3 + 0.3;
          }
        }
        animationId = requestAnimationFrame(drawSmoke);
      }
      if (!prefersReducedMotion) drawSmoke();

      gsap
        .timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: '+=100%', scrub: 1.2, pin: true, anticipatePin: 1 },
        })
        .fromTo(hero, { filter: 'brightness(0.5) blur(8px)' }, { filter: 'brightness(1) blur(0px)', duration: 2 })
        .fromTo(smokeCanvas, { opacity: 1 }, { opacity: 0, y: -150, duration: 2.5, ease: 'power2.inOut' }, '<')
        .to('.mountain-svg', { opacity: 1, duration: 1.8, ease: 'power2.out' }, '-=1');

      gsap.delayedCall(3, () => {
        smokeCanvas.remove();
        hero.classList.add('animate-in');

        gsap.to(contact, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' });

        gsap.delayedCall(0.7, () => {
          window.scrollTo({ top: hero.offsetHeight - 80, behavior: 'smooth' });
        });

        gsap
          .timeline({ delay: 0.6, defaults: { ease: 'power2.out' } })
          .from('.contact-label', { opacity: 0, y: 20, duration: 0.6 })
          .from('.title-group h2', { opacity: 0, y: 25, duration: 0.7 }, '-=0.3')
          .from('.decorative-elements', { opacity: 0, scale: 0.9, duration: 0.9, ease: 'elastic.out(1, 0.6)' }, '-=0.3')
          .from('.contact-info p', { opacity: 0, y: 15, stagger: 0.15, duration: 0.6 }, '-=0.4')
          .from('.contact-form', { opacity: 0, y: 30, duration: 1 }, '-=0.2');
      });

      if (!prefersReducedMotion) {
        gsap.to('.logo-image', { y: 8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.circle', { x: 4, y: -4, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }

      gsap.to('.contact-form', {
        scrollTrigger: { trigger: '.contact-form', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        y: -30,
        ease: 'none',
      });
    }, rootRef);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (onResize) window.removeEventListener('resize', onResize);
      ctx.revert();
    };
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
            <h1>Contact</h1>
            <h2>Why not say Hi to us? We'd love to hear from you.</h2>
          </div>

          <svg className="mountain-svg" viewBox="0 0 1000 400">
            <path className="mountain-peak mountain-peak-1" d="M100 350 L250 150 L400 350" />
            <path className="mountain-peak mountain-peak-2" d="M300 350 L500 100 L700 350" />
            <path className="mountain-peak mountain-peak-3" d="M600 350 L800 180 L950 350" />
          </svg>
        </div>
      </section>

      <main>
        <section className="contact-section" ref={contactSectionRef}>
          <div className="contact-wrapper">
            <div className="contact-left">
              <p className="contact-label">● contact</p>
              <div className="title-group">
                <h2>
                  It's nice to
                  <br />
                  meet ya
                </h2>
                <div className="decorative-elements">
                  <div className="circle" />
                  <img src="/Images/Contact/hello.gif" alt="Hello Logo" className="logo-image" />
                </div>
              </div>
              <div className="contact-info">
                <p>
                  <strong>
                    For general enquiries,
                    <br />
                    please fill out the form
                    <br />
                    or get in touch:
                  </strong>
                </p>
                <p>
                  Hate contact forms?
                  <br />
                  <a href="mailto:hello@rockcreativeagency.co.za">rockcreativeagency.co.za</a>
                </p>
              </div>
            </div>

            <div className="contact-right">
              <form className="contact-form" onSubmit={form.handleSubmit}>
                {form.success && (
                  <div className="success-message show">✓ Message sent successfully! We'll get back to you soon.</div>
                )}
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className={form.status.name}
                  value={form.values.name}
                  onChange={(e) => form.handleChange('name', e.target.value)}
                  onBlur={() => form.handleBlur('name')}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className={form.status.email}
                  value={form.values.email}
                  onChange={(e) => form.handleChange('email', e.target.value)}
                  onBlur={() => form.handleBlur('email')}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.values.phone}
                  onChange={(e) => form.handleChange('phone', e.target.value)}
                  onBlur={() => form.handleBlur('phone')}
                />
                <input
                  type="text"
                  placeholder="How did you hear about us?"
                  value={form.values.hearAbout}
                  onChange={(e) => form.handleChange('hearAbout', e.target.value)}
                  onBlur={() => form.handleBlur('hearAbout')}
                />
                <textarea
                  placeholder="Tell us about your project"
                  rows="5"
                  className={form.status.message}
                  value={form.values.message}
                  onChange={(e) => form.handleChange('message', e.target.value)}
                  onBlur={() => form.handleBlur('message')}
                />
                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
