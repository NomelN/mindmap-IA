import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Palette de couleurs pour les nodes avec styles inline
// Palette de couleurs pour les nodes (Sober & Modern)
export const nodeColors = [
  {
    name: 'zinc',
    bg: 'bg-zinc-100',
    border: 'border-zinc-300',
    text: 'text-zinc-900',
    hex: '#52525b'
  },
  {
    name: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    hex: '#2563eb'
  },
  {
    name: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    hex: '#059669'
  },
  {
    name: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    hex: '#d97706'
  },
  {
    name: 'rose',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    hex: '#e11d48'
  },
  {
    name: 'violet',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-900',
    hex: '#7c3aed'
  },
];

export function getRandomColor() {
  return nodeColors[Math.floor(Math.random() * nodeColors.length)];
}
