import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMountainAnimation } from '../hooks/useMountainAnimation';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';
import '../styles/mountain.css';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

// Ports Javascript/services.js. The "DISCOVER MORE" aside drawer (originally a single
// DOM node appended to document.body and populated per click) is now React state
// (`openIndex`) driving one ServiceCard-agnostic <aside>, with GSAP still handling the
// slide transform so the reveal motion matches the original exactly.
export default function Services() {
  const rootRef = useRef(null);
  const mountainRef = useRef(null);
  const asideRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  useMountainAnimation(mountainRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.service-item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 60,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });

      const itemListeners = [];
      gsap.utils.toArray('.service-item').forEach((item) => {
        const image = item.querySelector('.service-image');
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(image, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
        const onEnter = () => tl.play();
        const onLeave = () => tl.reverse();
        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
        itemListeners.push({ item, onEnter, onLeave });
      });

      return () => {
        itemListeners.forEach(({ item, onEnter, onLeave }) => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        });
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    if (openIndex !== null) {
      gsap.to(aside, { x: 0, duration: 0.8, ease: 'power4.out' });
      gsap.fromTo(aside.querySelector('.aside-content'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
      document.body.classList.add('aside-open');
    } else {
      gsap.to(aside, { x: '100%', duration: 0.8, ease: 'power4.inOut' });
      document.body.classList.remove('aside-open');
    }
  }, [openIndex]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (openIndex === null) return;
      if (!e.target.closest('.aside-content')) setOpenIndex(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openIndex]);

  useEffect(() => () => document.body.classList.remove('aside-open'), []);

  const activeService = openIndex !== null ? services[openIndex] : null;

  return (
    <div ref={rootRef}>
      <section
        className="mountain-section"
        ref={mountainRef}
        style={{ backgroundImage: "url('/Images/Home/rock.jpg')" }}
      >
        <div className="mountain-container natural-mask">
          <div className="fog-reveal">
            <div className="fog-layer fog1" />
            <div className="fog-layer fog2" />
          </div>

          <div className="mountain-content">
            <h1>Our Services.</h1>
            <h2>We blend real and digital worlds.</h2>
          </div>

          <svg className="mountain-svg" viewBox="0 0 1000 400">
            <path className="mountain-peak mountain-peak-1" d="M50 350 L250 150 L450 350" />
            <path className="mountain-peak mountain-peak-2" d="M400 350 L600 100 L800 350" />
            <path className="mountain-peak mountain-peak-3" d="M700 350 L900 200 L1050 350" />
          </svg>
        </div>
      </section>

      <div className="section-transition">
        <div className="fog-bridge" />
      </div>

      <main>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard service={service} index={index} onDiscover={setOpenIndex} key={service.title} />
          ))}
        </div>
      </main>

      <aside className="service-aside" ref={asideRef}>
        <div className="aside-content">
          <button type="button" className="close-aside" onClick={() => setOpenIndex(null)}>
            ×
          </button>
          <h2 className="aside-title">{activeService?.title ?? ''}</h2>
          <p className="aside-text">{activeService?.info ?? ''}</p>
        </div>
      </aside>
    </div>
  );
}
