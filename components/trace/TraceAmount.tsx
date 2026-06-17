interface TraceAmountProps {
  amount: number;
  asset?: string;
  className?: string;
}

export function TraceAmount({ amount, asset = "USDT", className = "" }: TraceAmountProps) {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {formatted} {asset}
    </span>
  );
}
