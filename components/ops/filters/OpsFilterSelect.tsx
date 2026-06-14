"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export function OpsFilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <div className="min-w-[7.5rem]">
      <label htmlFor={id} className="mb-0.5 block text-[10px] font-medium text-ourox-ink/45">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded border border-ourox-obsidianMid bg-ourox-obsidian/50 px-2 py-1.5 text-xs text-ourox-ink focus:border-ourox-orange/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
