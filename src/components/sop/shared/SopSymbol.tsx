import React from "react";
import { SymbolType } from "@/types/sop";
import { cn } from "@/lib/utils";

interface SopSymbolProps {
  type: SymbolType;
  className?: string;
  colorClassName?: string;
}

export function SopSymbol({
  type,
  className = "",
  colorClassName = "bg-[#39FF14]",
}: SopSymbolProps) {
  const baseClasses = cn(
    "border border-[#000] shadow-sm",
    colorClassName,
    className,
  );

  const printStyle = {
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  } as React.CSSProperties;

  switch (type) {
    case "terminator":
      return (
        <div
          className={cn("w-7 h-3.5 rounded-full", baseClasses)}
          style={printStyle}
        />
      );
    case "process":
      return <div className={cn("w-6 h-5", baseClasses)} style={printStyle} />;
    case "decision":
      return (
        <div
          className={cn("w-4 h-4 rotate-45", baseClasses)}
          style={printStyle}
        />
      );
    case "offpage":
      return (
        <div
          className={cn(
            "w-5 h-5 [clip-path:polygon(0%_0%,100%_0%,100%_70%,50%_100%,0%_70%)]",
            baseClasses,
          )}
          style={printStyle}
        />
      );
    case "offpage-up":
      return (
        <div
          className={cn(
            "w-5 h-5 [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)]",
            baseClasses,
          )}
          style={printStyle}
        />
      );
    default:
      return null;
  }
}
