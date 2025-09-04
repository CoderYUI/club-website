import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import Navbar2 from "@/components/navbar/navbar2";
import CustomCursor from "@/components/ui/CustomCursor";
import StairsWrapper from "@/components/stairs/StairsWrapper";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Linpack Club - VIT Bhopal University",
    template: "%s | Linpack Club"
  },
  description: "Official website of the Linpack Club at VIT Bhopal University. Access exclusive resources, register for events, generate certificates, and explore interactive learning materials for MATLAB and Overleaf.",
  keywords: ["MATLAB", "Overleaf", "VIT Bhopal", "Club", "Technical Club", "Student Club", "Certificate Generation", "Event Registration", "Research", "Signal Processing", "AI", "Robotics"],
  authors: [{ name: "Linpack Club" }],
  creator: "Linpack Club",
  publisher: "Linpack Club",
  metadataBase: new URL('https://linpack.vercel.app'),
  openGraph: {
    title: "Linpack Club - VIT Bhopal University",
    description: "Official website of the Linpack Club at VIT Bhopal University. Access exclusive resources, register for events, generate certificates, and explore interactive learning materials.",
    url: "https://linpack.vercel.app",
    siteName: "Linpack Club",
    images: [
      {
        url: "https://linpack.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "Linpack Club - VIT Bhopal University"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linpack Club - VIT Bhopal University",
    description: "Official website of the Linpack Club at VIT Bhopal University. Access exclusive resources, register for events, and explore interactive learning materials.",
    images: ["https://linpack.vercel.app/preview.png"],
    creator: "@LinpackClub"
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://linpack.vercel.app",
  },
  verification: {
    google: "your-google-site-verification-code-here", // Add your verification code here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Primary favicon */}
        <link rel="icon" href="/logo.png" />
        {/* Optional touch icons / manifest */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className}`}>
        <Providers>
          <CustomCursor />
          <div className="relative z-[9997]">
            <Navbar2 />
          </div>
          <Suspense fallback={<div>{children}</div>}>
            <StairsWrapper>
              {children}
            </StairsWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
