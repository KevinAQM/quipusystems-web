import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#030305",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quipusystems.dev"),
  title: "Quipu Systems | Coming Soon",
  description: "Digitalización · Software · Data · Automatización · IA",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Quipu Systems | Coming Soon",
    description: "Digitalización · Software · Data · Automatización · IA",
    url: "https://www.quipusystems.dev",
    siteName: "Quipu Systems",
    images: [
      {
        url: "/og-image.jpg",
        width: 835,
        height: 823,
        alt: "Quipu Systems Logo",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Quipu Systems | Coming Soon",
    description: "Digitalización · Software · Data · Automatización · IA",
    images: ["/og-image.jpg"],
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
