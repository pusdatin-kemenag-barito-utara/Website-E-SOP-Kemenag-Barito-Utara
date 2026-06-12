"use client";

"use client";

import React from "react";
import { 
  Zap, 
  FileText, 
  Lock, 
  ArrowLeft, 
  FileSearch, 
  FileSignature, 
  Split, 
  Merge,
  MoveLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    name: "Optimizing",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-amber-500",
    tools: [
      {
        id: "compress",
        name: "Compress PDF",
        description: "Reduce file size while optimizing for maximal quality.",
        icon: <Zap className="w-5 h-5" />,
        href: "/tools/compress",
        active: true,
      },
    ],
  },
  {
    name: "Converting",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-blue-500",
    tools: [
      {
        id: "pdf-to-word",
        name: "PDF to Word",
        description: "Convert PDF documents to editable Word files.",
        icon: <FileText className="w-5 h-5" />,
        href: "/tools/pdf-to-word",
        active: false,
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Extract images or save each page as a separate image.",
        icon: <FileSearch className="w-5 h-5" />,
        href: "/tools/pdf-to-jpg",
        active: false,
      },
    ],
  },
  {
    name: "Security & Edit",
    icon: <Lock className="w-4 h-4" />,
    color: "bg-red-500",
    tools: [
      {
        id: "merge",
        name: "Merge PDF",
        description: "Combine multiple PDF files into one single document.",
        icon: <Merge className="w-5 h-5" />,
        href: "/tools/merge",
        active: false,
      },
      {
        id: "split",
        name: "Split PDF",
        description: "Separate one page or a whole set for easy conversion.",
        icon: <Split className="w-5 h-5" />,
        href: "/tools/split",
        active: false,
      },
      {
        id: "sign",
        name: "Sign PDF",
        description: "Add your signature to any PDF document quickly.",
        icon: <FileSignature className="w-5 h-5" />,
        href: "/tools/sign",
        active: false,
      },
    ],
  },
];

export default function ToolsDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <header className="h-14 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-tight">
            PDF Utility <span className="text-primary">Platform</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[8px] font-semibold text-primary tracking-wide">
            Kemenag Barut Official
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
            Every tool you need to <span className="text-primary">optimize</span> PDFs.
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            All-in-one PDF platform. Fast, secure, and easy to use directly in your browser.
          </p>
        </div>

        <div className="space-y-12">
          {toolCategories.map((category) => (
            <section key={category.name}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className={cn("p-1.5 rounded-lg text-white shadow-sm", category.color)}>
                  {category.icon}
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  {category.name}
                </h3>
                <div className="flex-1 h-px bg-border ml-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.active ? tool.href : "#"}
                    className={cn(
                      "group relative bg-card p-5 rounded-xl border border-border shadow-sm transition-all duration-200",
                      tool.active 
                        ? "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer" 
                        : "opacity-50 grayscale cursor-not-allowed"
                    )}
                  >
                    {!tool.active && (
                      <div className="absolute top-3 right-3 px-1.5 py-0.5 bg-muted rounded-md">
                        <span className="text-[7px] font-medium text-muted-foreground tracking-wide">Coming Soon</span>
                      </div>
                    )}
                    
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200",
                      tool.active ? "bg-muted text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {tool.icon}
                    </div>

                    <h4 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>

                    {tool.active && (
                      <div className="mt-4 flex items-center text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                        Get Started <MoveLeft className="w-3 h-3 ml-1 rotate-180" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-card p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <p className="text-[9px] font-medium text-muted-foreground tracking-wide">
              Part of SOP Builder Ecosystem &copy; 2024
            </p>
          </div>
          <div className="flex gap-6">
            <span className="text-[9px] font-medium text-muted-foreground tracking-wide">Security First</span>
            <span className="text-[9px] font-medium text-muted-foreground tracking-wide">Client Side Process</span>
            <span className="text-[9px] font-medium text-muted-foreground tracking-wide">Official Kemenag</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
