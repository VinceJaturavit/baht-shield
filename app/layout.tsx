import type { Metadata } from "next";
import { Inter, Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ourox — Synthetic Fraud-Tech Platform",
  description:
    "A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.",
  openGraph: {
    title: "Ourox — Synthetic Fraud-Tech Platform",
    description:
      "A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.",
    type: "website",
  },
  twitter: {
    title: "Ourox — Synthetic Fraud-Tech Platform",
    description:
      "A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${spaceMono.variable} font-sans`}
    >
      <body className="font-sans bg-signal-bg text-signal-body antialiased">
        {children}
      </body>
    </html>
  );
}
