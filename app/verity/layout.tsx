import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verity — Investigation & Pattern Intelligence",
  description:
    "Synthetic fraud investigation workspace for analyst-curated patterns, case evidence, and explainable fraud operations workflows.",
  openGraph: {
    title: "Verity — Investigation & Pattern Intelligence",
    description:
      "Synthetic fraud investigation workspace for analyst-curated patterns, case evidence, and explainable fraud operations workflows.",
    type: "website",
  },
  twitter: {
    title: "Verity — Investigation & Pattern Intelligence",
    description:
      "Synthetic fraud investigation workspace for analyst-curated patterns, case evidence, and explainable fraud operations workflows.",
  },
};

export default function VerityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
