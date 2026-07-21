import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoExam AI — AI-Powered Assessment Platform",
  description:
    "Upload educational material and instantly generate question papers, answer keys and AI-assisted student evaluation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#0B0B0C] antialiased`}>
        {children}
      </body>
    </html>
  );
}
