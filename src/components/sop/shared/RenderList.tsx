import { cn } from "@/lib/utils";

interface RenderListProps {
  text: string;
  className?: string;
  itemClassName?: string;
  variant?: "ordered" | "plain";
}

export function RenderList({
  text,
  className = "",
  itemClassName = "",
  variant = "ordered",
}: RenderListProps) {
  if (!text) return null;
  const items = text.split("\n").filter((t) => t.trim() !== "");
  if (items.length === 0) return null;

  const isOrdered = variant === "ordered";

  return (
    <div className={cn("space-y-0.5", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "text-[8.5pt] font-medium text-black leading-tight flex gap-1",
            isOrdered ? "text-justify" : "text-left",
            itemClassName,
          )}
        >
          {isOrdered && <span className="min-w-[3mm]">{i + 1}.</span>}
          <span className="flex-1">
            {isOrdered ? item.replace(/^\d+[\.\)]\s*/, "") : item}
          </span>
        </div>
      ))}
    </div>
  );
}
