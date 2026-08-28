import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useFormValidation } from '../hooks/useFormValidation';
import ParticleHeading from '../components/ParticleHeading';
import LineMotif from '../components/LineMotif';
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
// The hero is a static intro video with no entrance animation.
export default function Contact() {
  const rootRef = useRef(null);
  const form = useFormValidation(contactFields);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    return () => ctx.revert();
  }, []);

  return (
    <div className="contact-page" ref={rootRef}>
      <section className="mountain-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/Images/Intro Video - Contact.mp4" type="video/mp4" />
        </video>
        <div className="mountain-container">
          <div className="mountain-content">
            <ParticleHeading text="Contact" variant="ring" />
            <h2>Why not say Hi to us? We'd love to hear from you.</h2>
          </div>
        </div>
      </section>

      <main>
        <section className="contact-section">
          <LineMotif variant="grid" />

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
                <svg className="form-corner-mark" viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <polyline points="20,10 20,20 10,20" />
                </svg>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
