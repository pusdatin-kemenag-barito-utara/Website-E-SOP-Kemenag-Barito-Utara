import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sop.kemenag-baritoutara.com";

export const viewport: Viewport = {
  themeColor: "#015C3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "E-SOP Digital | Kemenag Kabupaten Barito Utara",
    template: "%s | E-SOP Digital Kemenag Barito Utara",
  },
  description:
    "Portal Resmi Sistem Informasi dan Penyusunan Standar Operasional Prosedur (SOP) Digital Kantor Kementerian Agama Kabupaten Barito Utara.",
  keywords: [
    "SOP Digital",
    "Kemenag Barito Utara",
    "Standar Operasional Prosedur",
    "Kementerian Agama RI",
    "E-SOP Kemenag",
    "Muara Teweh",
    "Pelayanan Publik Kemenag",
    "Kabupaten Barito Utara",
    "Tata Naskah Dinas Kemenag",
  ],
  authors: [{ name: "Kantor Kementerian Agama Kabupaten Barito Utara", url: "https://baritoutara.kemenag.go.id" }],
  creator: "Kantor Kementerian Agama Kabupaten Barito Utara",
  publisher: "Kementerian Agama Republik Indonesia",
  category: "government",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/sop.png", type: "image/png" },
      { url: "/sop.png", sizes: "192x192", type: "image/png" },
      { url: "/sop.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/sop.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "E-SOP Digital | Kemenag Kabupaten Barito Utara",
    description:
      "Portal Resmi Sistem Informasi Penyusunan Standar Operasional Prosedur (SOP) Digital Kantor Kementerian Agama Kabupaten Barito Utara.",
    siteName: "E-SOP Digital Kemenag Barito Utara",
    images: [
      {
        url: "/sop.png",
        width: 512,
        height: 512,
        alt: "Logo E-SOP Digital Kemenag Barito Utara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-SOP Digital | Kemenag Kabupaten Barito Utara",
    description:
      "Portal Resmi Sistem Informasi Penyusunan Standar Operasional Prosedur (SOP) Digital Kantor Kementerian Agama Kabupaten Barito Utara.",
    images: ["/sop.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "E-SOP Digital Kemenag Barito Utara",
    url: siteUrl,
    description:
      "Sistem Informasi Penyusunan dan Manajemen Standar Operasional Prosedur (SOP) Digital Kantor Kementerian Agama Kabupaten Barito Utara.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    provider: {
      "@type": "GovernmentOrganization",
      name: "Kantor Kementerian Agama Kabupaten Barito Utara",
      url: "https://baritoutara.kemenag.go.id",
      logo: `${siteUrl}/sop.png`,
    },
  };

  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-jakarta antialiased selection:bg-[#015C3A]/20 selection:text-[#015C3A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
