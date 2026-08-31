import { useEffect } from 'react';

// Ports the wheel-to-horizontal-scroll + click-drag-to-scroll behavior from
// Javascript/work card.js, scoped to a ref instead of a hardcoded #portfolioContainer id.
export function useDragScroll(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    const onMouseDown = (e) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };
    const onMouseUp = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2.5;
      container.scrollLeft = scrollLeft - walk;
    };

    // Drives the parallax background band in work.css (--work-progress),
    // fired for both wheel and drag scrolling since both mutate scrollLeft.
    const wrapper = container.closest('.portfolio-wrapper');
    const onScroll = () => {
      const max = container.scrollWidth - container.clientWidth;
      const progress = max > 0 ? container.scrollLeft / max : 0;
      wrapper?.style.setProperty('--work-progress', progress);
    };

    container.addEventListener('wheel', onWheel);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('scroll', onScroll);
    };
  }, [containerRef]);
}
