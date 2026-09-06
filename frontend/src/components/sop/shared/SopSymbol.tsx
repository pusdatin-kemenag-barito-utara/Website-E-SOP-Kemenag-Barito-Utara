import React from "react";
import type { SymbolType } from "@/types/sop";
import { cn } from "@/lib/utils";

interface SopSymbolProps {
  type: SymbolType;
  className?: string;
  colorClassName?: string;
}

export function SopSymbol({
  type,
  className = "",
  colorClassName = "fill-[#39FF14]", // Use fill for SVG
}: SopSymbolProps) {
  const commonProps = {
    stroke: "#000",
    strokeWidth: "1.5",
    className: cn(
      colorClassName,
      "filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]",
    ),
  };

  const svgBaseClasses = cn("overflow-visible", className);

  switch (type) {
    case "terminator":
      return (
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          className={svgBaseClasses}
        >
          <rect x="1" y="1" width="30" height="14" rx="7" {...commonProps} />
        </svg>
      );
    case "process":
      return (
        <svg
          width="28"
          height="20"
          viewBox="0 0 28 20"
          className={svgBaseClasses}
        >
          <rect x="1" y="1" width="26" height="18" {...commonProps} />
        </svg>
      );
    case "decision":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={svgBaseClasses}
        >
          <path d="M10 1 L19 10 L10 19 L1 10 Z" {...commonProps} />
        </svg>
      );
    case "offpage":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={svgBaseClasses}
        >
          <path d="M1 1 L19 10 L19 14 L10 19 L1 14 Z" className="hidden" />{" "}
          {/* Template */}
          <path
            d="M1 1 L19 10 L19 14 L10 19 L1 14 Z"
            {...commonProps}
            className="hidden"
          />
          {/* Pentagon point down */}
          <path d="M1 1 H19 V14 L10 19 L1 14 Z" {...commonProps} />
        </svg>
      );
    case "offpage-up":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={svgBaseClasses}
        >
          {/* Pentagon point up */}
          <path d="M10 1 L19 6 V19 H1 V6 Z" {...commonProps} />
        </svg>
      );
    default:
      return null;
  }
}
