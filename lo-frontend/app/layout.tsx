import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// one font for the whole app
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lights Off",
  description: "A sleep tracker for people whose nights don't follow the clock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
