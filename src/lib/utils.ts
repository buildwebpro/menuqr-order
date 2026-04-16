export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function priceToCents(price: string | number): number {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return Math.round(num * 100);
}

export function centsToPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export function defaultOpeningHours(): OpeningHour[] {
  return DAYS_OF_WEEK.map((day) => ({
    day,
    open: "09:00",
    close: "21:00",
    isClosed: false,
  }));
}

export function parseOpeningHours(json: string | null): OpeningHour[] {
  if (!json) return defaultOpeningHours();
  try {
    return JSON.parse(json);
  } catch {
    return defaultOpeningHours();
  }
}
