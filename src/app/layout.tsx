import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "StartupCopilot - Transform Ideas Into Startups",
  description: "AI-powered platform for entrepreneurs. Generate business plans, analyze markets, and get expert guidance to turn your vision into a thriving business.",
  keywords: ["startup", "business plan", "AI", "entrepreneur", "market analysis", "business documents"],
  authors: [{ name: "StartupCopilot Team" }],
  creator: "StartupCopilot",
  publisher: "StartupCopilot",
  openGraph: {
    title: "StartupCopilot - Transform Ideas Into Startups",
    description: "AI-powered platform for entrepreneurs. Generate business plans, analyze markets, and get expert guidance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartupCopilot - Transform Ideas Into Startups",
    description: "AI-powered platform for entrepreneurs. Generate business plans, analyze markets, and get expert guidance.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
