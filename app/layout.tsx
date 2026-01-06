import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business OS",
  description: "All-in-one Business Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* Sidebar - ثابت */}
          <Sidebar />

          {/* Main content (بعد از سایدبار) */}
          <div className="ml-64 min-h-screen flex flex-col">
            {/* Top Navbar */}
            <TopNavbar />
            {/* Page Content */}
            <main className="flex-1 p-6">
              {children}
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
