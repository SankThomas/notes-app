import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function extractTags(content) {
  const tagRegex = /#[\w-]+/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}

export function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}
