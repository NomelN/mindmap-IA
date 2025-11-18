import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Palette de couleurs pour les nodes avec styles inline
export const nodeColors = [
  {
    name: 'blue',
    gradient: 'linear-gradient(to bottom right, #60a5fa, #2563eb)',
    border: '#3b82f6',
    hex: '#3b82f6'
  },
  {
    name: 'purple',
    gradient: 'linear-gradient(to bottom right, #c084fc, #9333ea)',
    border: '#a855f7',
    hex: '#a855f7'
  },
  {
    name: 'pink',
    gradient: 'linear-gradient(to bottom right, #f472b6, #db2777)',
    border: '#ec4899',
    hex: '#ec4899'
  },
  {
    name: 'orange',
    gradient: 'linear-gradient(to bottom right, #fb923c, #ea580c)',
    border: '#f97316',
    hex: '#f97316'
  },
  {
    name: 'green',
    gradient: 'linear-gradient(to bottom right, #4ade80, #16a34a)',
    border: '#22c55e',
    hex: '#22c55e'
  },
  {
    name: 'teal',
    gradient: 'linear-gradient(to bottom right, #2dd4bf, #0d9488)',
    border: '#14b8a6',
    hex: '#14b8a6'
  },
  {
    name: 'cyan',
    gradient: 'linear-gradient(to bottom right, #22d3ee, #0891b2)',
    border: '#06b6d4',
    hex: '#06b6d4'
  },
  {
    name: 'indigo',
    gradient: 'linear-gradient(to bottom right, #818cf8, #4f46e5)',
    border: '#6366f1',
    hex: '#6366f1'
  },
];

export function getRandomColor() {
  return nodeColors[Math.floor(Math.random() * nodeColors.length)];
}
