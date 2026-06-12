import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

// Grailed uses a system/Helvetica-like sans-serif for body text.
// Inter is the closest Google Font match.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GRAILED - Buy & Sell Designer, Streetwear & Vintage Fashion",
  description: "Grailed is the peer-to-peer marketplace for luxury and streetwear fashion.",
  icons: {
    icon: [
      { url: "/grailed-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/grailed-favicon.svg",
    apple: "/grailed-favicon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-[#F7F7F7] text-[#1A1A1A] antialiased`}
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
