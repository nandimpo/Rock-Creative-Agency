import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ParticleHeading from '../components/ParticleHeading';
import LineMotif from '../components/LineMotif';
import { journeyStages, journeySupport } from '../data/journey';
import '../styles/mountain.css';
import '../styles/expertise.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Ports Javascript/expertise.js ("The Method" page). The original's hand-rolled,
// unthrottled `scroll` listener for `.fade-in`/`.fade-in-up` reveal is replaced with
// ScrollTrigger (used everywhere else on the site) per the migration plan, since it
// gets cleanup for free via gsap.context and avoids an extra listener leak on route change.
// The hero is a static intro video with no entrance animation.
export default function Expertise() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fade-in, .fade-in-up').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => el.classList.add('visible'),
          onEnterBack: () => el.classList.add('visible'),
        });
      });

      gsap.to('.earth-layer', { opacity: 0.6, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      gsap.utils.toArray('.stage-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            delay: i * 0.2,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });

      gsap.from('.section-heading h2', {
        duration: 1.6,
        y: 60,
        opacity: 0,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.section-heading', start: 'top 90%' },
      });
      gsap.from('.section-heading p', {
        duration: 1.5,
        y: 40,
        opacity: 0,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.section-heading', start: 'top 90%' },
      });

      gsap
        .timeline({ scrollTrigger: { trigger: '.journey-stages', start: 'top center', end: 'bottom top', scrub: true } })
        .to('.earth-layer', { scale: 1.1, opacity: 0.5, ease: 'sine.inOut' })
        .to('.earth-layer', { scale: 1, opacity: 0.8, ease: 'sine.inOut' });

      gsap
        .timeline({ scrollTrigger: { trigger: '.journey-stages', start: 'top 80%', end: 'bottom top', scrub: 1 } })
        .to('.root-path', { strokeDashoffset: 0, duration: 3, ease: 'power2.inOut' });

      gsap.to('.root-path', {
        filter: 'drop-shadow(0 0 12px rgba(242,210,117,0.8))',
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: 'sine.inOut',
      });
      gsap.to('.earth-roots', { y: 10, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      gsap
        .timeline({ scrollTrigger: { trigger: '.journey-support', start: 'top 90%', end: 'bottom top', scrub: 1 } })
        .to('.vine-path', { strokeDashoffset: 0, duration: 3, ease: 'power2.inOut' });

      gsap.to('.vine-path', {
        filter: 'drop-shadow(0 0 12px rgba(242,210,117,0.6))',
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      });
      gsap.to('.vine-growth', { rotate: 1, y: 5, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="expertise-page" ref={rootRef}>
      <section className="mountain-section">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/Images/Intro video - expertise.mp4" type="video/mp4" />
        </video>
        <ParticleHeading text="The Method." variant="rise" />
        <h2>This is where you truly see our process</h2>
      </section>

      <main className="journey-main">
        <section className="journey-intro fade-in">
          <LineMotif variant="compass" />
          <h2>Fashion Face-Off</h2>
        </section>

        <section className="journey-stages" id="production">
          <div className="section-heading">
            <h2>1. Production Phases</h2>
            <p>From raw ideas to full realization — our process is grounded, bold, and alive with motion.</p>
          </div>

          <div className="earth-layer" />

          <div className="stages-grid fade-in-up">
            {journeyStages.map((stage) => (
              <article className="stage-card" key={stage.title}>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </article>
            ))}
          </div>

          <svg className="earth-roots" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
            <path
              className="root-path"
              d="M100,250
                 C150,200 200,230 250,180
                 S350,120 400,160
                 S500,230 550,180
                 S650,100 700,140"
            />
          </svg>
        </section>

        <section className="journey-support fade-in-up">
          <div className="support-heading">
            <h2>2. Supporting the Vision</h2>
            <p>From the earth to expression — every element grows from our foundation of creativity.</p>
          </div>

          <svg className="vine-growth" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
            <path
              className="vine-path"
              d="M100,280
                 C200,220 300,200 400,160
                 S600,100 700,120
                 S750,180 780,80"
            />
          </svg>

          <div className="support-grid fade-in-up">
            {journeySupport.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
