import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustCenter | A clearer standard for trust",
  description: "Publish a polished AI trust and compliance center in minutes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
