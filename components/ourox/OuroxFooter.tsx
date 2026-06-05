// OuroxFooter — shared platform footer for all Ourox surfaces.
// Spec-019: appears on /, /verity, /arbiter, /arbiter/tuning.
// Light variant for Verity (white bg); dark variant for Ourox/Arbiter (obsidian bg).
// Keeps synthetic-data honesty visible on every surface.

interface OuroxFooterProps {
  variant?: 'dark' | 'light';
}

export function OuroxFooter({ variant = 'dark' }: OuroxFooterProps) {
  const borderClass =
    variant === 'light' ? 'border-signal-borderSubtle' : 'border-ourox-obsidianMid';
  const textClass =
    variant === 'light' ? 'text-signal-meta' : 'text-ourox-ink/30';

  return (
    <footer className={`border-t ${borderClass} flex-shrink-0`}>
      <div className="mx-auto max-w-[1280px] px-6 py-3">
        <p
          className={`text-[11px] tracking-wide ${textClass}`}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Fraud-tech learning and portfolio
          platform&nbsp;&nbsp;·&nbsp;&nbsp;No real customer data
        </p>
      </div>
    </footer>
  );
}
