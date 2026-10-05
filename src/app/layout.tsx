import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#080c0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quipusystems.dev"),
  title: "Quipu Systems | Software, datos e inteligencia artificial",
  description: "Software a medida, datos e inteligencia artificial para conectar y mejorar los procesos de tu empresa. Conversemos sobre tu proyecto. Primera reunión gratuita.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Quipu Systems | El futuro se construye conectando",
    description: "Software a medida, datos e inteligencia artificial para tu empresa. Nuestra nueva web está en camino. Las buenas conexiones empiezan hoy.",
    url: "https://www.quipusystems.dev",
    siteName: "Quipu Systems",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Quipu Systems",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quipu Systems | El futuro se construye conectando",
    description: "Software a medida, datos e inteligencia artificial para tu empresa. Nuestra nueva web está en camino. Las buenas conexiones empiezan hoy.",
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
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
