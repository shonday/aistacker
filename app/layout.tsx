import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIStacker | Free Developer & AI Tools Stack",
  description: "Fast, secure, and privacy-focused online developer tools. Format JSON, encode Base64, generate UUIDs, and more directly in your browser.",
  alternates: {
    canonical: "https://aistacker.dev",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t py-8 text-center text-slate-500 text-sm bg-white">
          <p>© {new Date().getFullYear()} AIStacker.dev - All tools run locally in your browser.</p>
        </footer>
      </body>
    </html>
  );
}