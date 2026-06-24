import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ToastProvider from "./components/ToastProvider";
import MouseSpotlight from "./components/MouseSpotlight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-M7SHGMX8";
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: "Abhinav Singh / Software Engineer",
  description:
    "Personal site of Abhinav Singh — software engineer, writer. Field notes, essays, and experiments on the web.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <MouseSpotlight />
            {children}
          </ToastProvider>
        </ThemeProvider>
        {isProduction && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
