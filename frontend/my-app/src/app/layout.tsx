import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import { ReactNode } from "react";
import { ModalProvider } from "@/context/ModalContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="id" className={`${sora.variable}`}>
      <body className="font-sans bg-[#101415] text-[#f3f4f6] min-h-screen flex flex-col antialiased">
        <ModalProvider>
          <IntroLoader />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}