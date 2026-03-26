import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Engine — AI Ad Concept Generator",
  description: "Generate Arcads-ready video concepts and matching landing pages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
