"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function OpsSearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  id = "ops-search",
}: Props) {
  return (
    <div className="min-w-[10rem] flex-1 sm:max-w-xs">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-ourox-obsidianMid bg-ourox-obsidian/50 px-2.5 py-1.5 text-xs text-ourox-ink placeholder:text-ourox-ink/35 focus:border-ourox-orange/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange/60"
      />
    </div>
  );
}
