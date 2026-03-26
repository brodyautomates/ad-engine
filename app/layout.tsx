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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
