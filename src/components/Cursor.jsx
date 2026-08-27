import { useEffect, useRef } from 'react';
import '../styles/cursor.css';

// Ports Javascript/cursor.js. Mounted once at the app root so the custom cursor
// persists across route changes instead of being recreated per page. The two
// tracking divs are always rendered (inert, opacity:0, pointer-events:none) so refs
// are available on the first effect run; touch/reduced-motion users simply never get
// the listeners wired up and CSS hides them as a fallback.
export default function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    const ring = ringRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    };
    rafId = requestAnimationFrame(animateRing);

    const onMouseDown = () => {
      ring.style.animation = 'rockPulse 0.4s ease-out';
    };
    const onMouseUp = () => {
      ring.style.animation = 'auraFlow 5s ease-in-out infinite';
    };

    const onOver = (e) => {
      if (e.target.closest("a, button, input[type='button'], input[type='submit']")) {
        cursor.classList.add('cursor-hover');
        ring.classList.add('ring-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest("a, button, input[type='button'], input[type='submit']")) {
        cursor.classList.remove('cursor-hover');
        ring.classList.remove('ring-hover');
      }
    };

    let usingKeyboard = false;
    const onKeyDown = (e) => {
      if (e.key === 'Tab' && !usingKeyboard) {
        usingKeyboard = true;
        cursor.style.display = 'none';
        ring.style.display = 'none';
        document.body.style.cursor = 'auto';
      }
    };
    const onKeyboardMouseDown = () => {
      if (usingKeyboard) {
        usingKeyboard = false;
        cursor.style.display = 'block';
        ring.style.display = 'block';
        document.body.style.cursor = 'none';
      }
    };

    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        ring.style.width = '55px';
        ring.style.height = '55px';
      } else {
        ring.style.width = '85px';
        ring.style.height = '85px';
      }
    };
    updateSize();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onKeyboardMouseDown);
    window.addEventListener('resize', updateSize);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onKeyboardMouseDown);
      window.removeEventListener('resize', updateSize);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="rock-cursor" style={{ opacity: 0 }} />
      <div ref={ringRef} className="rock-cursor-ring" style={{ opacity: 0 }} />
    </>
  );
}
