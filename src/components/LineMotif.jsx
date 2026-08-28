// Decorative blueprint-style background: thin grid lines, a diagonal or two,
// and a circle-with-crossing-lines accent — the same family of motif used on
// Contact, varied per page so it isn't identical everywhere.
const VARIANTS = {
  grid: {
    lines: [
      [0, 0, 0, 800],
      [200, 0, 200, 800],
      [400, 0, 400, 800],
      [600, 0, 600, 800],
      [800, 0, 800, 800],
      [1000, 0, 1000, 800],
      [1200, 0, 1200, 800],
      [0, 0, 1200, 0],
      [0, 400, 1200, 400],
      [0, 800, 1200, 800],
      [0, 0, 600, 800],
    ],
    circles: [{ cx: 960, cy: 400, r: 220 }],
    crosses: [
      [740, 180, 1180, 620],
      [1180, 180, 740, 620],
    ],
  },
  corner: {
    lines: [
      [0, 0, 0, 600],
      [300, 0, 300, 600],
      [600, 0, 600, 600],
      [0, 0, 900, 0],
      [0, 300, 900, 300],
      [0, 600, 600, 0],
    ],
    circles: [{ cx: 150, cy: 450, r: 150 }],
    crosses: [],
  },
  diagonal: {
    lines: [
      [0, 0, 1200, 0],
      [0, 300, 1200, 300],
      [0, 600, 1200, 600],
      [0, 600, 600, 0],
      [600, 600, 1200, 0],
      [0, 0, 1200, 600],
    ],
    circles: [{ cx: 300, cy: 300, r: 160 }],
    crosses: [],
  },
  compass: {
    lines: [
      [600, 0, 600, 800],
      [0, 400, 1200, 400],
    ],
    circles: [
      { cx: 600, cy: 400, r: 260 },
      { cx: 600, cy: 400, r: 160 },
    ],
    crosses: [
      [340, 140, 860, 660],
      [860, 140, 340, 660],
    ],
  },
  columns: {
    lines: [
      [150, 0, 150, 800],
      [350, 0, 350, 800],
      [550, 0, 550, 800],
      [750, 0, 750, 800],
      [950, 0, 950, 800],
      [0, 0, 1200, 0],
      [0, 800, 1200, 800],
    ],
    circles: [{ cx: 1050, cy: 650, r: 140 }],
    crosses: [],
  },
  sparse: {
    lines: [
      [0, 800, 1200, 0],
      [0, 0, 1200, 0],
      [0, 800, 1200, 800],
    ],
    circles: [{ cx: 200, cy: 200, r: 130 }],
    crosses: [],
  },
};

export default function LineMotif({ variant = 'grid', className = '' }) {
  const config = VARIANTS[variant] || VARIANTS.grid;

  return (
    <svg
      className={`line-motif ${className}`.trim()}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {config.lines.map(([x1, y1, x2, y2], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      {config.circles.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
      {config.crosses.map(([x1, y1, x2, y2], i) => (
        <line key={`x${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </svg>
  );
}
