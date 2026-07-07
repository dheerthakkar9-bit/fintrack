import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ServiceWorker from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "FinTrack - Personal Finance Tracker",
  description: "A premium financial tracker for managing your money with clarity.",
  applicationName: "FinTrack",
  authors: [{ name: "FinTrack" }],
  creator: "FinTrack",
  publisher: "FinTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FinTrack",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "FinTrack",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="48x48" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen antialiased`}>
        <Providers>{children}</Providers>
        <ServiceWorker />
      </body>
    </html>
  );
}
