import type { Metadata } from "next";
import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "recode",
    template: "%s - Your personal snippet brain",
  },
  description:
    "recode helps you save, search, and share your code snippets without friction.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "recode - Your personal snippet brain",
    description:
      "recode helps you save, search, and share your code snippets without friction.",
  },
  twitter: {
    title: "recode - Your personal snippet brain",
    description:
      "recode helps you save, search, and share your code snippets without friction.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        style={
          {
            "--font-geist-sans": GeistSans.style.fontFamily,
            "--font-geist-mono": GeistMono.style.fontFamily,
          } as React.CSSProperties
        }
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
