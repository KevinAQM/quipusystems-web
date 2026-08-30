import type { Metadata } from "next";
import { VT323, Space_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech",
});

export const metadata: Metadata = {
  title: "Quipu Systems | Coming Soon",
  description: "Quipu Systems S.A.C.S. · Software Engineering, Automation & Intelligent Systems.",
  openGraph: {
    title: "Quipu Systems | Coming Soon",
    description: "Quipu Systems is cooking something fabulous.",
    url: "https://www.quantumsystems.dev",
    siteName: "Quipu Systems",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${vt323.variable} ${spaceMono.variable} ${shareTechMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030305] text-[#00ffcc] selection:bg-[#00ffcc]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
