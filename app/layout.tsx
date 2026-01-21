import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import { SimulationProvider } from "./context/SimulationContext";

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
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}>
        <SimulationProvider>
          <InteractiveBackground />
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </SimulationProvider>
      </body>
    </html>
  );
}
