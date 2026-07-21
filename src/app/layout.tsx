import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Backdrop from "@/components/Backdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kyron — GTA Online Mod Menu",
  description:
    "Kyron is a feature-rich GTA Online mod menu with vehicle tools, protection systems, and a clean in-game UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <Backdrop />
        <div className="kyron-page flex flex-col min-h-full flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
