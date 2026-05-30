interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  if (compact) {
    return (
      <svg
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SignalOS"
        height="28"
        width="28"
        className="shrink-0"
      >
        <rect x="0" y="0" width="44" height="44" rx="11" fill="#4F46E5" />
        <polyline
          points="8,22 14,22 17,16 20,22 23,22 26,7 29,37 32,22 36,22"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 208 44"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SignalOS"
      height="28"
      className="shrink-0"
      style={{ width: "auto" }}
    >
      <rect x="0" y="0" width="44" height="44" rx="11" fill="#4F46E5" />
      <polyline
        points="8,22 14,22 17,16 20,22 23,22 26,7 29,37 32,22 36,22"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="58"
        y="33"
        fontFamily="inherit"
        fontSize="31"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        <tspan fill="#0A0A0A">Signal</tspan>
        <tspan fill="#4F46E5">OS</tspan>
      </text>
    </svg>
  );
}
