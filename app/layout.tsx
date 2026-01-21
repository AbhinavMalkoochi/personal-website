import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InteractiveBackground from "./components/InteractiveBackground";
import { SimulationProvider } from "./context/SimulationContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhinav Malkoochi",
  description: "Computer Science Graduate. Building in the AI space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SimulationProvider>
          <InteractiveBackground />
          <main className="main-content">
            {children}
          </main>
        </SimulationProvider>
      </body>
    </html>
  );
}
