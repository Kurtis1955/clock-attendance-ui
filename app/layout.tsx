import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/hoc/providers";
import SessionGuard from "@/hoc/SessionGuard";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Biometric Hub | Management Platform",
  description:
    "Enterprise biometric device and attendance management platform for ZKTeco and multi-vendor environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} h-full font-sans antialiased`}>
        <Providers>
          <SessionGuard>{children}</SessionGuard>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
