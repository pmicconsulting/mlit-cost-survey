import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "国土交通省 適正原価に関する実態調査",
  description: "貨物自動車運送事業における適正原価の実態を調査し、持続可能な運送事業の発展に寄与するためのWEB調査システムです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
