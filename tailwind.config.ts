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
        // SignalOS committed palette (Spec-012). Existing token NAMES are kept
        // and remapped onto the committed values so the whole app adopts the
        // palette at the token step; new semantic aliases are added below.
        signal: {
          // Backwards-compatible names (remapped to committed palette)
          bg: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#F3F6FA",
          heading: "#1B2436",
          body: "#3F4A5A",
          secondary: "#647084",
          faint: "#8A94A6",
          border: "#D9DEE8",
          borderSubtle: "#E6EAF1",
          borderStrong: "#C4CAD6",
          accent: "#4B53C9",
          accentHover: "#3F46B5",
          accentSubtle: "#EEF0FF",
          accentBorder: "#C8CCF7",

          // Committed semantic aliases
          ink: "#1B2436",
          slate: "#647084",
          meta: "#8A94A6",
          faintSlate: "#B6BECA",

          surface: "#FFFFFF",
          surfaceSubtle: "#F3F6FA",
          surfaceSoft: "#EEF2F7",

          indigo: "#4B53C9",
          indigoHover: "#3F46B5",
          indigoActive: "#353C9E",
          indigoSubtle: "#EEF0FF",
          indigoBorder: "#C8CCF7",

          amber: "#D98A3D",
          amberHover: "#C8792D",
          amberSubtle: "#FFF4E8",
          amberBorder: "#F3D2AF",
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
        // Ourox palette — used by Arbiter section only; does not replace SignalOS tokens.
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
