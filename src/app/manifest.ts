import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E-SOP Digital | Kemenag Barito Utara",
    short_name: "E-SOP",
    description:
      "Portal Sistem Informasi dan Penyusunan Standar Operasional Prosedur (SOP) Digital Kantor Kementerian Agama Kabupaten Barito Utara.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#015C3A",
    icons: [
      {
        src: "/sop.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/sop.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
