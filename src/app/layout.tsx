import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOP Builder Digital",
  description: "Standard Operating Procedure Builder for Kemenag",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
