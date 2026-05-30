import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SignalOS — Analyst-Curated Fraud Intelligence",
  description:
    "Synthetic fraud-operations demo for analyst-curated pattern intelligence. All data illustrative.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="font-sans bg-signal-bg text-signal-body antialiased">
        {children}
      </body>
    </html>
  );
}
