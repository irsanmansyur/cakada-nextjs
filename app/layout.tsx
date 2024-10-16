import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JSI APPS",
  description: "Selamat datang di JSI APPS",
  openGraph: {
    images: [process.env.NEXT_PUBLIC_DOMAIN + "/jsilogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className + " w-screen"}>{children}</body>
    </html>
  );
}
