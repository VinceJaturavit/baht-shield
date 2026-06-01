interface LogoProps {
  compact?: boolean;
  className?: string;
}

export function Logo({ compact = false, className }: LogoProps) {
  if (compact) {
    // Mark-only — signal-field mark, 48×48 source scaled to display size
    return (
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SignalOS"
        height="28"
        width="28"
        className={`shrink-0 ${className ?? ""}`}
      >
        <g stroke="#C4CAD6" strokeWidth="1.6" opacity="0.9">
          <line x1="24" y1="6" x2="24" y2="42" />
          <line x1="6" y1="33" x2="42" y2="33" />
        </g>
        <polyline
          fill="none"
          stroke="#4B53C9"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="7,33 18,33 24,29 30,11 36,33 41,33"
        />
        <circle cx="30" cy="11" r="5" fill="#D98A3D" />
      </svg>
    );
  }

  // Lockup — signal-field-lockup-light, 232×56 viewBox
  return (
    <svg
      viewBox="0 0 232 56"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SignalOS"
      height="32"
      className={`shrink-0 ${className ?? ""}`}
      style={{ width: "auto" }}
    >
      <g transform="translate(4,4)">
        <rect
          x="5"
          y="5"
          width="38"
          height="38"
          rx="7"
          fill="none"
          stroke="#C4CAD6"
          strokeWidth="1.4"
        />
        <g stroke="#C4CAD6" strokeWidth="1" opacity="0.85">
          <line x1="17.7" y1="6.5" x2="17.7" y2="41.5" />
          <line x1="30.3" y1="6.5" x2="30.3" y2="41.5" />
          <line x1="6.5" y1="24" x2="41.5" y2="24" />
        </g>
        <polyline
          fill="none"
          stroke="#4B53C9"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="9,30 16.5,30 20,27 24,30 30,13 36,30 39,30"
        />
        <circle cx="30" cy="13" r="3.2" fill="#D98A3D" />
      </g>
      <text
        x="64"
        y="37"
        fontFamily="inherit"
        fontSize="26"
        fontWeight="600"
        letterSpacing="-0.3"
      >
        <tspan fill="#1B2436">Signal</tspan>
        <tspan fill="#4B53C9">OS</tspan>
      </text>
    </svg>
  );
}
