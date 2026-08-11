import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { AnalyticsListener } from "@/lib/analytics/listener";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

// Self-hosted (latin subset) — next/font/google downloads at build time and
// its CDN flakiness kept breaking CI builds.
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-v24-latin-regular.woff2", weight: "400" },
    { path: "../fonts/poppins-v24-latin-500.woff2", weight: "500" },
    { path: "../fonts/poppins-v24-latin-600.woff2", weight: "600" },
    { path: "../fonts/poppins-v24-latin-700.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
});

const roboto = localFont({
  src: [
    { path: "../fonts/roboto-v51-latin-regular.woff2", weight: "400" },
    { path: "../fonts/roboto-v51-latin-500.woff2", weight: "500" },
  ],
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
