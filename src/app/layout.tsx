import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MenuQR – Restaurant Online Menu & QR Code Generator",
    template: "%s | MenuQR",
  },
  description:
    "Create a beautiful online menu for your restaurant in minutes. Share it with a QR code. Free to start.",
  keywords: ["restaurant menu", "online menu", "QR code menu", "digital menu"],
  openGraph: {
    type: "website",
    siteName: "MenuQR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
