import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RemesaAI — Manda dinero a México en 2 minutos",
  description:
    "Voice-first stablecoin remittance US→Mexico. 0.15% fees vs 8% en Western Union. Powered by USDC on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-white">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent" />
          <div className="pointer-events-none absolute -left-32 top-32 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-64 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative">{children}</div>
        </div>
      </body>
    </html>
  );
}
