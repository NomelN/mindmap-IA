import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Palette de couleurs pour les nodes
export const nodeColors = [
  { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', border: 'border-blue-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', border: 'border-purple-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', border: 'border-pink-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', border: 'border-orange-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-green-400 to-green-600', border: 'border-green-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-teal-400 to-teal-600', border: 'border-teal-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600', border: 'border-cyan-500', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', border: 'border-indigo-500', text: 'text-white' },
];

export function getRandomColor() {
  return nodeColors[Math.floor(Math.random() * nodeColors.length)];
}
