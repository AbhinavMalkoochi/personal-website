import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abhinavmalkoochi.com"),
  title: {
    default: "Abhinav Malkoochi",
    template: "%s · Abhinav Malkoochi",
  },
  description: "Software, AI, projects, and notes by Abhinav Malkoochi.",
  openGraph: {
    title: "Abhinav Malkoochi",
    description: "Software, AI, projects, and notes by Abhinav Malkoochi.",
    url: "/",
    siteName: "Abhinav Malkoochi",
    type: "website",
    images: [
      {
        url: "/og.png",
        alt: "Abhinav Malkoochi — Software · AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinav Malkoochi",
    description: "Software, AI, projects, and notes by Abhinav Malkoochi.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
