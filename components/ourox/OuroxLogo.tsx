// OuroxLogo — corrected 10-segment mark (Spec-020)
// Source SVG: 400×400 viewBox, 10 arc segments, 5 nodes (2 yellow, 3 obsidian+ring),
// faint internal chord lines at 0.38 opacity.
// Scaled proportionally: at small sizes (≤32px) chord lines are hidden.

const OX = {
  obsidian: '#101820',
  orange: '#FF8200',
  yellow: '#FFC72C',
  ink: '#ECEFF3',
} as const;

interface OuroxMarkProps {
  s?: number;
  className?: string;
}

export function OuroxMark({ s = 200, className }: OuroxMarkProps) {
  const showChords = s > 32;

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Chord lines — hidden at very small sizes */}
      {showChords && (
        <>
          <line x1="323.84" y1="118.96" x2="69.81" y2="270.39" stroke={OX.orange} strokeWidth="3.64" opacity="0.38"/>
          <line x1="330.19" y1="270.39" x2="76.16" y2="118.96" stroke={OX.orange} strokeWidth="3.64" opacity="0.38"/>
          <line x1="200.00" y1="348.00" x2="76.16" y2="118.96" stroke={OX.orange} strokeWidth="3.64" opacity="0.38"/>
        </>
      )}

      {/* 10 arc segments */}
      <path d="M270.62,69.94 A148,148,0,0,1,320.19,113.64" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M327.26,124.44 A148,148,0,0,1,347.46,187.36" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M348.00,200.26 A148,148,0,0,1,333.13,264.65" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M326.99,276.00 A148,148,0,0,1,281.26,323.70" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M270.17,330.31 A148,148,0,0,1,206.46,347.86" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M193.54,347.86 A148,148,0,0,1,129.83,330.31" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M118.74,323.70 A148,148,0,0,1,73.01,276.00" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M66.87,264.65 A148,148,0,0,1,52.00,200.26" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M52.54,187.36 A148,148,0,0,1,72.74,124.44" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>
      <path d="M79.81,113.64 A148,148,0,0,1,129.38,69.94" fill="none" stroke={OX.orange} strokeWidth="22.40" strokeLinecap="round"/>

      {/* 5 nodes: 3 obsidian with orange ring, 2 yellow solid */}
      <circle cx="323.84" cy="118.96" r="11.20" fill={OX.obsidian} stroke={OX.orange} strokeWidth="5.60"/>
      <circle cx="330.19" cy="270.39" r="14.00" fill={OX.yellow}/>
      <circle cx="200.00" cy="348.00" r="11.20" fill={OX.obsidian} stroke={OX.orange} strokeWidth="5.60"/>
      <circle cx="69.81" cy="270.39" r="11.20" fill={OX.obsidian} stroke={OX.orange} strokeWidth="5.60"/>
      <circle cx="76.16" cy="118.96" r="14.00" fill={OX.yellow}/>
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
