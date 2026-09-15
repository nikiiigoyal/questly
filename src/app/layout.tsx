import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questly — learn anything, playfully",
  description:
    "Search any topic and get an instant AI-generated learning quest. Built for the AI Builders Hackathon 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {/* Brand-green progress bar on every route change */}
        <NextTopLoader
          color="#58cc02"
          height={4}
          showSpinner={false}
          shadow="0 0 12px #58cc02, 0 0 5px #58cc02"
        />
        {children}
        {/* Vercel Analytics — active automatically on Vercel deployment */}
        <Analytics />
      </body>
    </html>
  );
}
