import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
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
          <SpotifyNowPlaying />
          <main className="main-content">
            {children}
          </main>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
