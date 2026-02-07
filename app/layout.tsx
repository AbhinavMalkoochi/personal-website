import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import InteractiveBackground from "./components/InteractiveBackground";
import ModeToggle from "./components/ModeToggle";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
import { SimulationProvider } from "./context/SimulationContext";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { Analytics } from "@vercel/analytics/next";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhinav Malkoochi",
  description: "Computer Science Graduate interested in AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ConvexClientProvider>
          <SimulationProvider>
            <InteractiveBackground />
            <ModeToggle />
            <SpotifyNowPlaying />
            <main className="main-content">
              {children}
            </main>
          </SimulationProvider>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
