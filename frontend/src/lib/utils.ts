import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ID_MONTHS_MAP: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

export function formatIndonesianDate(dateString: string): string {
  if (!dateString || dateString.trim() === "" || dateString.trim() === "-") {
    return "-";
  }

  const str = dateString.trim();

  // If already in format "DD MMMM YYYY" with Indonesian month
  const parts = str.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(year) && ID_MONTHS_MAP[monthName] !== undefined) {
      // Capitalize month properly
      const capitalizedMonth = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
      return `${day.toString().padStart(2, "0")} ${capitalizedMonth} ${year}`;
    }
  }

  // If ISO "YYYY-MM-DD" or similar
  try {
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return format(d, "dd MMMM yyyy", { locale: id });
      }
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return format(d, "dd MMMM yyyy", { locale: id });
    }
  } catch {}

  // Fallback: return raw string if not empty
  return str;
}
