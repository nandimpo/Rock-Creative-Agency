import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clients } from '../data/clients';

gsap.registerPlugin(ScrollTrigger);

// A tall section with a CSS-sticky viewport, same pattern as ServicesShowcase:
// scroll progress through the tall section drives the UI, but here it's a
// direct transform on the card track (not React state) so the horizontal
// motion stays smooth at scroll speed instead of re-rendering every frame.
export default function WorkCarousel() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const maxTranslate = Math.max(0, track.scrollWidth - viewport.offsetWidth);
        track.style.transform = `translateX(-${maxTranslate * self.progress}px)`;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="work-carousel" ref={sectionRef} style={{ height: '300vh' }}>
      <div className="work-carousel-sticky">
        <div className="work-carousel-viewport" ref={viewportRef}>
          <div className="work-carousel-track" ref={trackRef}>
            {clients.map((client) => (
              <div className="work-carousel-card" key={client.name}>
                <img src={client.image} alt={client.name} />
              </div>
            ))}
          </div>
        </div>
        <div className="work-carousel-footer">
          <h2>Our Work</h2>
          <Link to="/work">
            <button className="btn">Explore</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
