import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";

const inter = Kanit({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Stock Checker",
  description: "Check your stock easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}
