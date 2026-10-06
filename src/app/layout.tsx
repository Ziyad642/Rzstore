import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "RZ Store - Your Everyday Needs",
    template: "%s | RZ Store",
  },
  description:
    "RZ Store (PT RZ E-Commerce Group) - Belanja kebutuhan harian, fashion, gadget, elektronik, dan perabot rumah terlengkap dengan promo gratis ongkir dan pengiriman cepat.",
  keywords: [
    "RZ Store",
    "marketplace indonesia",
    "belanja online",
    "elektronik murah",
    "fashion original",
    "gadget terlengkap",
    "gratis ongkir",
  ],
  authors: [{ name: "PT RZ E-Commerce Group" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rzstore.com",
    title: "RZ Store - Your Everyday Needs",
    description: "Platform e-commerce terpercaya untuk aneka produk kebutuhan harian Anda.",
    siteName: "RZ Store",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "RZ Store Logo",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#172033] overflow-x-hidden w-full max-w-full">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden w-full max-w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
