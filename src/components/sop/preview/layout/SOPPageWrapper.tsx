import React from "react";

interface SOPPageWrapperProps {
  children: React.ReactNode;
  pageIdx: number;
  totalVisiblePages: number;
}

export function SOPPageWrapper({
  children,
  pageIdx,
  totalVisiblePages,
}: SOPPageWrapperProps) {
  return (
    <div
      className="bg-white shadow-2xl print:shadow-none border border-slate-200 print:border-none mx-auto origin-top transition-transform duration-500 relative z-10 print-page mb-12 print:mb-0 overflow-hidden"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "10mm",
        backgroundColor: "white",
        color: "black",
        boxSizing: "border-box",
      }}
    >
      <div className="absolute right-4 text-[7pt] font-bold text-[#000] top-3">
        Halaman {pageIdx + 1} dari {totalVisiblePages}
      </div>
      {children}
    </div>
  );
}
