import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirebaseInit from "@/components/FirebaseInit";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Ngebruk, Kecamatan Sumberpucung, Kabupaten Malang",
  description: "Website resmi Desa Ngebruk, Kecamatan Sumberpucung, Kabupaten Malang, Jawa Timur. Kampung Damai & Budaya Luhur, Harmoni Alam dan Kearifan Lokal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <FirebaseInit />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
