interface TraceLogoProps {
  size?: number;
  className?: string;
}

export function TraceLogo({ size = 40, className = "" }: TraceLogoProps) {
  return (
    <img
      src="/logos/ourox-trace-icon.svg"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
}
