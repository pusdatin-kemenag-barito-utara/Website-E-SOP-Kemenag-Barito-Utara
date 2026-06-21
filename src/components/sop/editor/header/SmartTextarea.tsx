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

      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1];
      const match = currentLine.match(/^(\d+)[\.\)]\s*/);

      if (match) {
        e.preventDefault();
        const nextNum = parseInt(match[1]) + 1;
        const insertText = `\n${nextNum}. `;
        const newValue = before + insertText + after;
        onValueChange(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + insertText.length;
        }, 0);
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
          "min-h-[80px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed resize-none transition-all focus:border-[#015C3A] focus:bg-white focus:ring-2 focus:ring-[#015C3A]/20 pr-10 shadow-inner px-4 py-3",
          className,
        )}
      />
      <button
        type="button"
        onClick={startNumbering}
        title="Mulai Daftar Berangka"
        className="absolute right-2.5 top-2.5 p-1 rounded-md bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <div className="absolute left-3 -bottom-4 opacity-0 group-hover:opacity-40 group-focus-within:opacity-100 transition-opacity">
        <span className="text-[7px] font-medium text-muted-foreground tracking-tight">
          Tekan ENTER untuk list otomatis
        </span>
      </div>
    </div>
  );
}
