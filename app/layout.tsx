import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abhinav Malkoochi",
  description:
    "Abhinav Malkoochi is a CS graduate from UT Dallas building software, AI tools, and thoughtful digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        <ConvexClientProvider>
          <main className="main-content">
            {children}
          </main>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
