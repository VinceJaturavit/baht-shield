// OuroxLogo — ported from 07 Reference/LOGO/Ourox LOGO/Ourox Logo/icons.jsx
// Source of truth: icons.jsx (D2-C "Heavy" mark variant)
// Geometry and tokens are exact; adapted to TypeScript/TSX with theme-safe color refs.

const OX = {
  obsidian: '#101820',
  orange: '#FF8200',
  yellow: '#FFC72C',
  ink: '#ECEFF3',
} as const;

const RAD = Math.PI / 180;

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.cos(deg * RAD), cy + r * Math.sin(deg * RAD)];
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  const large = (a2 - a1) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

interface Segment { a1: number; a2: number }

function segs(n: number, gapAtTop: number, innerGap: number): Segment[] {
  const span = 360 - gapAtTop;
  const segSpan = span / n;
  const start = -90 + gapAtTop / 2;
  return Array.from({ length: n }, (_, i) => ({
    a1: start + i * segSpan + innerGap / 2,
    a2: start + (i + 1) * segSpan - innerGap / 2,
  }));
}

function junctionAngles(segments: Segment[]): number[] {
  return segments.slice(0, -1).map((seg, i) => (seg.a2 + segments[i + 1].a1) / 2);
}

// D2-C Heavy: 6 segments, 3 nodes, 1 yellow node, no chords — nav mark
interface OuroxMarkProps {
  s?: number;
  className?: string;
}

export function OuroxMark({ s = 200, className }: OuroxMarkProps) {
  const c = s / 2;
  const r = s * 0.37;
  const segments = segs(6, 56, 6);
  const juncts = junctionAngles(segments);
  const nodeAt = [0, 2, 4];
  const yellowAt = new Set([1]);
  const nodePts = nodeAt.map((ji) => pt(c, c, r, juncts[ji]));
  const segSW = 0.078;
  const nodeR = 0.042;
  const nodeSW = 0.020;

  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {segments.map(({ a1, a2 }, i) => (
        <path
          key={i}
          d={arcPath(c, c, r, a1, a2)}
          fill="none"
          stroke={OX.orange}
          strokeWidth={s * segSW}
          strokeLinecap="round"
        />
      ))}
      {nodePts.map((p, i) => {
        const yellow = yellowAt.has(i);
        return (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={s * (yellow ? nodeR * 1.25 : nodeR)}
            fill={yellow ? OX.yellow : OX.obsidian}
            stroke={yellow ? 'none' : OX.orange}
            strokeWidth={s * nodeSW}
          />
        );
      })}
    </svg>
  );
}

// GeoX — the geometric X in the wordmark
interface GeoXProps {
  h?: number;
  stroke?: string;
  accent?: string;
}

export function GeoX({ h = 48, stroke = OX.ink, accent = OX.yellow }: GeoXProps) {
  const w = h * 0.82;
  const sw = h * 0.17;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block' }}
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1={sw / 2} y1={sw / 2}
        x2={w - sw / 2} y2={h - sw / 2}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="square"
      />
      <line
        x1={w - sw / 2} y1={sw / 2}
        x2={sw / 2} y2={h - sw / 2}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="square"
      />
      <circle cx={w / 2} cy={h / 2} r={sw * 0.62} fill={accent} />
    </svg>
  );
}

// OuroxWordmark — "OURO" + geometric X, Montserrat Bold
interface OuroxWordmarkProps {
  size?: number;
  color?: string;
  accent?: string;
  track?: number;
  className?: string;
}

export function OuroxWordmark({
  size = 48,
  color = OX.ink,
  accent = OX.yellow,
  track = 0.2,
  className,
}: OuroxWordmarkProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: size,
        color,
        letterSpacing: `${track}em`,
      }}
      className={className}
    >
      <span style={{ paddingLeft: `${track}em` }}>OURO</span>
      <span style={{ display: 'inline-flex', marginLeft: `${track * 0.02}em` }}>
        <GeoX h={size * 0.72} stroke={color} accent={accent} />
      </span>
    </div>
  );
}

// OuroxLogo — composite component with variant + size props
export type OuroxLogoVariant = 'mark' | 'wordmark' | 'full';
export type OuroxLogoSize = 'sm' | 'md' | 'lg';

interface OuroxLogoProps {
  variant?: OuroxLogoVariant;
  size?: OuroxLogoSize;
  className?: string;
}

const MARK_PX: Record<OuroxLogoSize, number> = { sm: 28, md: 36, lg: 48 };
const WORD_PX: Record<OuroxLogoSize, number> = { sm: 18, md: 24, lg: 32 };

export function OuroxLogo({ variant = 'full', size = 'md', className }: OuroxLogoProps) {
  const markPx = MARK_PX[size];
  const wordPx = WORD_PX[size];

  if (variant === 'mark') {
    return (
      <span
        role="img"
        aria-label="Ourox"
        className={className}
        style={{ display: 'inline-flex', width: markPx, height: markPx, flexShrink: 0 }}
      >
        <OuroxMark s={markPx} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        role="img"
        aria-label="Ourox"
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <OuroxWordmark size={wordPx} />
      </span>
    );
  }

  // full = mark + wordmark side by side
  return (
    <span
      role="img"
      aria-label="Ourox"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: markPx * 0.35 }}
    >
      <span style={{ display: 'inline-flex', width: markPx, height: markPx, flexShrink: 0 }}>
        <OuroxMark s={markPx} />
      </span>
      <OuroxWordmark size={wordPx} />
    </span>
  );
}
