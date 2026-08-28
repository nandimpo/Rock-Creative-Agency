import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../data/services';
import LineMotif from './LineMotif';

gsap.registerPlugin(ScrollTrigger);

// A tall (services.length * 100vh) section with a CSS-sticky inner panel.
// One GSAP ScrollTrigger tracks scroll progress through that height and maps
// it to an active service index — no pinning needed since the sticky panel
// handles that natively, ScrollTrigger just drives which item is highlighted
// and which image/description shows.
export default function ServicesShowcase() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const index = Math.min(services.length - 1, Math.floor(self.progress * services.length));
        setActiveIndex(index);
      },
    });

    return () => trigger.kill();
  }, []);

  const active = services[activeIndex];

  return (
    <section
      className="services-showcase"
      ref={sectionRef}
      style={{ height: `${services.length * 100}vh` }}
    >
      <div className="services-showcase-sticky">
        <LineMotif variant="diagonal" />
        <span className="services-showcase-dot" />
        <div className="services-showcase-grid">
          <ul className="services-showcase-list">
            {services.map((service, index) => (
              <li key={service.title} className={index === activeIndex ? 'active' : undefined}>
                <Link to="/services">{service.title}</Link>
              </li>
            ))}
          </ul>

          <div className="services-showcase-detail">
            <div
              className="services-showcase-image"
              style={{ backgroundImage: `url('${active.image}')` }}
            />
            <p>{active.info}</p>
          </div>
        </div>

        <div className="services-showcase-progress">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="services-showcase-bar">
            <span style={{ width: `${((activeIndex + 1) / services.length) * 100}%` }} />
          </span>
          <span>{String(services.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
