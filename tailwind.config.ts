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
        signal: {
          bg: "#FAFAFA",
          card: "#FFFFFF",
          muted: "#F5F5F5",
          heading: "#0A0A0A",
          body: "#404040",
          secondary: "#737373",
          faint: "#A3A3A3",
          border: "#E5E5E5",
          borderSubtle: "#F0F0F0",
          borderStrong: "#D4D4D4",
          accent: "#4F46E5",
          accentHover: "#4338CA",
          accentSubtle: "#EEF2FF",
          accentBorder: "#C7D2FE",
        },
        severity: {
          critical: "#DC2626",
          high: "#EA580C",
          medium: "#CA8A04",
          low: "#6B7280",
          unknown: "#737373",
        },
      },
      borderRadius: {
        signal: "12px",
        signalSm: "8px",
      },
      boxShadow: {
        signal: "0 1px 2px rgba(10, 10, 10, 0.04)",
      },
      maxWidth: {
        signal: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
