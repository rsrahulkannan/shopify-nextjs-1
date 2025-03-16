import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "E-commerce";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "NextJS E-commerce with Shopify";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  keywords: ["e-commerce", "online shopping", "products", "fashion", "electronics"],
  authors: [{ name: "Rahul RS", url: siteUrl }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/e-commerce.jpeg`,
        width: 275,
        height: 173,
        alt: siteTitle,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}