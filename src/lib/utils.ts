import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIndonesianDate(dateString: string): string {
  if (!dateString || dateString === "-") return "-";

  try {
    const parsed = parseISO(dateString);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "dd MMMM yyyy", { locale: id });
  } catch {
    return "-";
  }
}
