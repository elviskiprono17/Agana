import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agana | Legally Binding Micro-Agreements with Biometric KYC",
  description: "Instant biometric KYC micro-agreements for Kenya's informal and small claims economy. Protected under Cap 23 & Small Claims Act 2016.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-[#09090b] min-h-screen antialiased selection:bg-black selection:text-white">
        <div className="kenya-ribbon fixed top-0 left-0 right-0 z-50" />
        {children}
      </body>
    </html>
  );
}
