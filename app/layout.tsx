import type { Metadata } from "next";
import { Cinzel_Decorative, Playfair_Display, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import InteractiveBackground from "./components/InteractiveBackground";
import { SimulationProvider } from "./context/SimulationContext";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
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
      <body className={`${cinzel.variable} ${playfair.variable} ${jetbrainsMono.variable} ${caveat.variable} antialiased`}>
        <ConvexClientProvider>
          <SimulationProvider>
            <InteractiveBackground />
            <main className="main-content">
              {children}
            </main>
          </SimulationProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
