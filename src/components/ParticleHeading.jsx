import { useEffect, useRef } from 'react';

const DEFAULT_PALETTE = ['#E2DCCC'];

// Where a particle starts before converging on its target point (tx, ty),
// per `variant`. Each variant gives a page its own distinct "coming together"
// motion instead of every heading assembling the same way.
function getStart(variant, tx, ty, width, height) {
  switch (variant) {
    case 'fall':
      return { sx: tx + (Math.random() - 0.5) * width * 0.25, sy: -Math.random() * height * 0.8 - 20 };
    case 'rise':
      return { sx: tx + (Math.random() - 0.5) * width * 0.25, sy: height + Math.random() * height * 0.8 + 20 };
    case 'burst': {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * width * 0.12;
      return { sx: width / 2 + Math.cos(angle) * dist, sy: height / 2 + Math.sin(angle) * dist };
    }
    case 'sides': {
      const fromLeft = Math.random() > 0.5;
      return {
        sx: fromLeft ? -Math.random() * width * 0.5 - 10 : width + Math.random() * width * 0.5 + 10,
        sy: ty,
      };
    }
    case 'ring': {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(width, height) * (0.55 + Math.random() * 0.35);
      return { sx: width / 2 + Math.cos(angle) * radius, sy: height / 2 + Math.sin(angle) * radius };
    }
    case 'scatter':
    default:
      return { sx: Math.random() * width, sy: Math.random() * height };
  }
}

// Renders `text` as particles that converge into the letterforms over
// `duration` ms via a `variant`-specific motion (see getStart above), then
// settles into the real solid heading — debris forming solid rock, but it's
// a heading. Once assembled it draws an actual filled fillText pass (not
// dots) so the resting state is crisp, fully solid type identical to a
// normal heading. The real text stays in the DOM (visually hidden) for
// a11y/SEO; the canvas is purely decorative. Falls back straight to the
// solid frame under prefers-reduced-motion.
export default function ParticleHeading({
  text,
  tag = 'h1',
  className = '',
  duration = 1800,
  variant = 'scatter',
  palette = DEFAULT_PALETTE,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const Tag = tag;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles = [];
    let frameId;
    let startTime;
    let fontString = '';
    let textX = 0;
    let textY = 0;

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#fff';

      let size = height * 0.82;
      octx.font = `300 ${size}px 'Conso', serif`;
      while (octx.measureText(text).width > width * 0.94 && size > 6) {
        size -= 2;
        octx.font = `300 ${size}px 'Conso', serif`;
      }
      fontString = `300 ${size}px 'Conso', serif`;
      textX = width / 2;
      textY = height / 2;
      octx.fillText(text, textX, textY);

      const data = octx.getImageData(0, 0, width, height).data;
      const gap = Math.max(2, Math.round(dpr * 2));
      const points = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (data[(y * width + x) * 4 + 3] > 130) points.push({ x, y });
        }
      }

      // Radius set relative to the sampling gap so neighbouring particles
      // overlap and read as a filled shape rather than a dotted outline.
      particles = points.map((p) => {
        const s = getStart(variant, p.x, p.y, width, height);
        return {
          tx: p.x,
          ty: p.y,
          sx: s.sx,
          sy: s.sy,
          r: gap * 0.7,
          color: palette[Math.floor(Math.random() * palette.length)],
        };
      });

      startTime = undefined;
    };

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const drawSolid = (alpha = 1) => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = fontString;
      ctx.fillStyle = '#E2DCCC';
      ctx.globalAlpha = alpha;
      ctx.fillText(text, textX, textY);
      ctx.globalAlpha = 1;
    };

    const render = (time) => {
      if (startTime === undefined) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = easeOutCubic(progress);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const solidAlpha = Math.max(0, (progress - 0.72) / 0.28);
      if (solidAlpha < 1) {
        particles.forEach((p) => {
          const x = p.sx + (p.tx - p.sx) * eased;
          const y = p.sy + (p.ty - p.sy) * eased;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (0.5 + eased * 0.5) * (1 - solidAlpha);
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.globalAlpha = 1;
      drawSolid(solidAlpha);

      if (progress >= 1) {
        frameId = undefined;
        return;
      }

      frameId = requestAnimationFrame(render);
    };

    const start = () => {
      if (frameId) cancelAnimationFrame(frameId);
      build();
      if (prefersReducedMotion) {
        drawSolid();
      } else {
        frameId = requestAnimationFrame(render);
      }
    };

    start();
    window.addEventListener('resize', start, { passive: true });

    return () => {
      window.removeEventListener('resize', start);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [text, duration, variant, palette]);

  return (
    <Tag className={`particle-heading ${className}`.trim()} ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="visually-hidden">{text}</span>
    </Tag>
  );
}
