import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GRAILED - Buy & Sell Designer, Streetwear & Vintage Fashion",
  description: "Grailed is the peer-to-peer marketplace for luxury and streetwear fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} font-sans bg-[#F7F7F7] text-[#1A1A1A] antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
