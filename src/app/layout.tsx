import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsListener } from "@/lib/analytics/listener";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Northlight — Smart Lighting",
    template: "%s · Northlight",
  },
  description:
    "Demo storefront for testing analytics & monitoring SDKs (session replay, events, occlusion, identify).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="antialiased">
        <AnalyticsListener />
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
