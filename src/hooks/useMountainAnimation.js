import { useEffect } from 'react';
import gsap from 'gsap';

// Ports Javascript/mountain.js's MountainAnimation class into a hook scoped to one
// .mountain-section via a ref, with proper listener/observer cleanup on unmount.
export function useMountainAnimation(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const h1 = section.querySelector('h1');
    const h2 = section.querySelector('h2');
    const fogs = section.querySelectorAll('.fog-layer');

    if (!h1 && !h2 && !section.querySelector('.mountain-svg')) return;

    let hasAnimated = false;

    const playFog = () => {
      fogs.forEach((fog) => {
        fog.style.animationPlayState = 'running';
        fog.style.opacity = '1';
        fog.style.transition = 'opacity 2s ease, filter 3s ease, transform 3s ease';
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            section.classList.add('animate-in');
            playFog();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    observer.observe(section);

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY && window.scrollY < window.innerHeight / 2) {
        fogs.forEach((fog) => {
          fog.style.opacity = '0.6';
          fog.style.filter = 'blur(100px)';
        });
      } else if (currentY > lastScrollY) {
        fogs.forEach((fog) => {
          fog.style.opacity = '0.3';
          fog.style.filter = 'blur(70px)';
        });
      }
      if (window.scrollY <= 10) {
        fogs.forEach((fog) => {
          fog.style.opacity = '1';
          fog.style.filter = 'blur(120px)';
          fog.style.transition = 'opacity 2.5s ease, filter 2.5s ease';
        });
      }
      lastScrollY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      fogs.forEach((fog, i) => {
        const intensity = (i + 1) * 10;
        gsap.to(fog, { duration: 3, x: x * intensity, y: y * intensity, ease: 'power2.out' });
      });
    };
    const onMouseLeaveFog = () => {
      fogs.forEach((fog) => gsap.to(fog, { duration: 3, x: 0, y: 0, ease: 'power2.out' }));
    };
    if (fogs.length) {
      section.addEventListener('mousemove', onMouseMove);
      section.addEventListener('mouseleave', onMouseLeaveFog);
    }

    const onEnter = () => {
      if (h1 && hasAnimated) {
        h1.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        h1.style.transform = 'scale(1.05)';
      }
      if (h2 && hasAnimated) {
        h2.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        h2.style.transform = 'scale(1.05)';
      }
    };
    const onLeave = () => {
      if (h1) h1.style.transform = 'scale(1)';
      if (h2) h2.style.transform = 'scale(1)';
    };
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeaveFog);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(fogs);
    };
  }, [sectionRef]);
}
