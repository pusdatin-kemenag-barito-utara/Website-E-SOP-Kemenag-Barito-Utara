import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ListOrdered } from "lucide-react";

interface SmartTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange: (value: string) => void;
}

export function SmartTextarea({
  onValueChange,
  className,
  value,
  ...props
}: SmartTextareaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const val = textarea.value;
      const before = val.substring(0, start);
      const after = val.substring(start);

      // Check the current line for numbering
      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1];
      const match = currentLine.match(/^(\d+)[\.\)]\s*/);

      if (match) {
        e.preventDefault();
        const nextNum = parseInt(match[1]) + 1;
        const insertText = `\n${nextNum}. `;
        const newValue = before + insertText + after;
        onValueChange(newValue);

        // Adjust cursor position after render
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + insertText.length;
        }, 0);
      } else if (currentLine.trim() === "" && lines.length > 1) {
        // If previous line had numbering but current is empty, maybe user wants to start numbering
        const prevLine = lines[lines.length - 2];
        const prevMatch = prevLine.match(/^(\d+)[\.\)]\s*/);
        if (prevMatch) {
          // This is a bit complex for a simple textarea, let's just do manual start
        }
      }
    }
  };

  const startNumbering = () => {
    const currentVal = String(value || "");
    if (!currentVal.match(/^1\.\s/)) {
      onValueChange("1. " + currentVal);
    }
  };

  return (
    <div className="relative group">
      <Textarea
        {...props}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "pr-10", // Space for the list toggle icon
          className,
        )}
      />
      <button
        type="button"
        onClick={startNumbering}
        title="Mulai Daftar Berangka"
        className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="absolute left-4 -bottom-5 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
        <span className="text-[9px] font-bold text-blue-500/60 uppercase tracking-tighter">
          Tip: Tekan Enter untuk penomoran otomatis
        </span>
      </div>
    </div>
  );
}
