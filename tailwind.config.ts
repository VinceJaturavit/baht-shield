import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        // Verity dark palette (Spec-020 re-theme to Ourox dark system).
        // Token NAMES preserved for compatibility; values remapped to dark equivalents.
        // Indigo accent remapped to Ourox orange throughout Verity.
        signal: {
          // Background surfaces
          bg: "#0F1720",
          card: "#1A2530",
          muted: "#131C28",

          // Text
          heading: "#ECEFF3",
          body: "#B8C4D0",
          secondary: "#7D8FA3",
          faint: "#4A5568",

          // Borders
          border: "#243040",
          borderSubtle: "#1C2B38",
          borderStrong: "#2E3E52",

          // Accent (orange replaces indigo)
          accent: "#FF8200",
          accentHover: "#E07200",
          accentSubtle: "#1E1408",
          accentBorder: "#2E1E0A",

          // Committed semantic aliases
          ink: "#ECEFF3",
          slate: "#7D8FA3",
          meta: "#647084",
          faintSlate: "#4A5568",

          surface: "#1A2530",
          surfaceSubtle: "#131C28",
          surfaceSoft: "#1E2A38",

          // Indigo → orange (primary accent throughout Verity)
          indigo: "#FF8200",
          indigoHover: "#E07200",
          indigoActive: "#CC6600",
          indigoSubtle: "#1E1408",
          indigoBorder: "#2E1E0A",

          // Amber kept for synthetic/warning banners (warm hue appropriate)
          amber: "#FFC72C",
          amberHover: "#E6B020",
          amberSubtle: "#1E1C08",
          amberBorder: "#2E2A0A",
        },
        // Risk/severity scale — muted, paired with text, never color-alone.
        risk: {
          critical: "#DC2626",
          high: "#EA580C",
          medium: "#CA8A04",
          low: "#647084",
          unknown: "#8A94A6",
        },
        severity: {
          critical: "#DC2626",
          high: "#EA580C",
          medium: "#CA8A04",
          low: "#647084",
          unknown: "#8A94A6",
        },
        // Ourox palette — used by Arbiter and Ourox home; does not replace Verity tokens.
        ourox: {
          obsidian: "#101820",
          orange: "#FF8200",
          yellow: "#FFC72C",
          ink: "#ECEFF3",
          obsidianLight: "#1A2530",
          obsidianMid: "#243040",
          orangeHover: "#E07200",
          orangeSubtle: "#FFF3E8",
          yellowSubtle: "#FFFBE8",
        },
        // Trace light palette (Trace-Spec-002) — electric-blue identity; does not replace ourox/signal.
        trace: {
          primary: "#2F7BF0",
          cyan: "#5BE1F0",
          blue1: "#358AF0",
          blue2: "#3C98F0",
          blue3: "#42A7F0",
          blue4: "#4EC4F0",
          page: "#F7FAFD",
          card: "#FFFFFF",
          surface: "#F2F7FC",
          muted: "#EDF4FB",
          heading: "#0F1B2D",
          body: "#3A4A5E",
          secondary: "#6B7C90",
          border: "#DCE6F2",
          obsidian: "#101820",
        },
      },
      borderRadius: {
        signal: "12px",
        signalSm: "8px",
        signalLg: "16px",
      },
      boxShadow: {
        signal:
          "0 1px 2px rgba(27, 36, 54, 0.04), 0 8px 24px rgba(27, 36, 54, 0.04)",
        signalSubtle: "0 1px 2px rgba(27, 36, 54, 0.04)",
      },
      fontSize: {
        "signal-page": ["30px", { lineHeight: "38px", fontWeight: "600" }],
        "signal-section": ["18px", { lineHeight: "28px", fontWeight: "600" }],
        "signal-body": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "signal-meta": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "signal-figure": ["32px", { lineHeight: "40px", fontWeight: "600" }],
      },
      maxWidth: {
        signal: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
