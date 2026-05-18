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
    icon: <Zap className="w-5 h-5" />,
    color: "bg-amber-500",
    tools: [
      {
        id: "compress",
        name: "Compress PDF",
        description: "Reduce file size while optimizing for maximal quality.",
        icon: <Zap className="w-6 h-6" />,
        href: "/tools/compress",
        active: true,
      },
    ],
  },
  {
    name: "Converting",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-blue-500",
    tools: [
      {
        id: "pdf-to-word",
        name: "PDF to Word",
        description: "Convert PDF documents to editable Word files.",
        icon: <FileText className="w-6 h-6" />,
        href: "/tools/pdf-to-word",
        active: false,
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Extract images or save each page as a separate image.",
        icon: <FileSearch className="w-6 h-6" />,
        href: "/tools/pdf-to-jpg",
        active: false,
      },
    ],
  },
  {
    name: "Security & Edit",
    icon: <Lock className="w-5 h-5" />,
    color: "bg-red-500",
    tools: [
      {
        id: "merge",
        name: "Merge PDF",
        description: "Combine multiple PDF files into one single document.",
        icon: <Merge className="w-6 h-6" />,
        href: "/tools/merge",
        active: false,
      },
      {
        id: "split",
        name: "Split PDF",
        description: "Separate one page or a whole set for easy conversion.",
        icon: <Split className="w-6 h-6" />,
        href: "/tools/split",
        active: false,
      },
      {
        id: "sign",
        name: "Sign PDF",
        description: "Add your signature to any PDF document quickly.",
        icon: <FileSignature className="w-6 h-6" />,
        href: "/tools/sign",
        active: false,
      },
    ],
  },
];

export default function ToolsDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            PDF Utility <span className="text-emerald-600 font-black">Platform</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Kemenag Barut Official
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Every tool you need to <span className="text-emerald-600 italic">optimize</span> PDFs.
          </h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
            All-in-one PDF platform. Fast, secure, and easy to use directly in your browser.
          </p>
        </div>

        <div className="space-y-16">
          {toolCategories.map((category) => (
            <section key={category.name} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("p-2 rounded-xl text-white shadow-lg", category.color)}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                  {category.name}
                </h3>
                <div className="flex-1 h-[1px] bg-slate-200 ml-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.active ? tool.href : "#"}
                    className={cn(
                      "group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300",
                      tool.active 
                        ? "hover:shadow-xl hover:shadow-emerald-100 hover:border-emerald-200 hover:-translate-y-1 cursor-pointer" 
                        : "opacity-60 grayscale cursor-not-allowed"
                    )}
                  >
                    {!tool.active && (
                      <div className="absolute top-4 right-4 px-2 py-0.5 bg-slate-100 rounded-full">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Coming Soon</span>
                      </div>
                    )}
                    
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-md",
                      tool.active ? "bg-slate-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {tool.icon}
                    </div>

                    <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {tool.description}
                    </p>

                    {tool.active && (
                      <div className="mt-6 flex items-center text-xs font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        Get Started <MoveLeft className="w-3 h-3 ml-2 rotate-180" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 bg-white p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Part of SOP Builder Ecosystem &copy; 2024
            </p>
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security First</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Side Process</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Kemenag</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
