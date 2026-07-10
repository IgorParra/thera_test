import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MSWProvider } from "@/mocks/MSWProvider";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ordens de Venda",
  description: "Gestão de ordens de venda, agendamento e transporte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MSWProvider>
          <Providers>
            <AppShell>{children}</AppShell>
            <Toaster />
          </Providers>
        </MSWProvider>
      </body>
    </html>
  );
}
