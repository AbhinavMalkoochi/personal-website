import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import InteractiveBackground from "./components/InteractiveBackground";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhinav Malkoochi | CS @ UTD",
  description: "CS student at UT Dallas, founding engineer at startups. Building at the intersection of AI, math, and elegant code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}>
        <InteractiveBackground />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="main-content flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
