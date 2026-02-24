import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinion Insight Agent — Pay-per-AI Market Intelligence",
  description:
    "Autonomous AI agent delivering premium market insights via x402 micropayments on Base. Powered by PinionOS & Gemini Flash.",
  keywords: ["PinionOS", "x402", "AI agent", "micropayments", "Base", "USDC", "market intelligence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen bg-grid`}
      >
        {children}
      </body>
    </html>
  );
}
