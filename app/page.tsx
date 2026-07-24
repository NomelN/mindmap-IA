'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Données de la carte du hero — thème : « Apprendre le piano »       */
/* ------------------------------------------------------------------ */

const HERO_THEME = 'Apprendre le piano';

type Tone = 'center' | 'blue' | 'emerald' | 'amber' | 'rose';

const TONES: Record<Exclude<Tone, 'center'>, { bg: string; border: string; text: string; hex: string }> = {
  blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a', hex: '#2563eb' },
  emerald: { bg: '#ecfdf5', border: '#a7f3d0', text: '#064e3b', hex: '#059669' },
  amber: { bg: '#fffbeb', border: '#fde68a', text: '#78350f', hex: '#d97706' },
  rose: { bg: '#fff1f2', border: '#fecdd3', text: '#881337', hex: '#e11d48' },
};

interface SceneNode {
  id: string;
  label: string;
  x: number; // % du conteneur
  y: number;
  tone: Tone;
  size: 'lg' | 'md' | 'sm';
  delay: number; // secondes
}

const SCENE_NODES: SceneNode[] = [
  { id: 'center', label: HERO_THEME, x: 48, y: 50, tone: 'center', size: 'lg', delay: 1.5 },
  { id: 'b1', label: 'Théorie', x: 22, y: 22, tone: 'blue', size: 'md', delay: 1.9 },
  { id: 'b2', label: 'Pratique', x: 76, y: 20, tone: 'emerald', size: 'md', delay: 2.05 },
  { id: 'b3', label: 'Répertoire', x: 24, y: 78, tone: 'amber', size: 'md', delay: 2.2 },
  { id: 'b4', label: 'Rythme', x: 74, y: 78, tone: 'rose', size: 'md', delay: 2.35 },
  { id: 's1', label: 'Partitions', x: 18, y: 6, tone: 'blue', size: 'sm', delay: 2.6 },
  { id: 's2', label: 'Accords', x: 13, y: 38, tone: 'blue', size: 'sm', delay: 2.7 },
  { id: 's3', label: 'Gammes', x: 89, y: 6, tone: 'emerald', size: 'sm', delay: 2.8 },
  { id: 's4', label: '15 min / jour', x: 90, y: 34, tone: 'emerald', size: 'sm', delay: 2.9 },
  { id: 's5', label: 'Classique', x: 14, y: 64, tone: 'amber', size: 'sm', delay: 3.0 },
  { id: 's6', label: 'Pop & jazz', x: 19, y: 94, tone: 'amber', size: 'sm', delay: 3.1 },
  { id: 's7', label: 'Métronome', x: 91, y: 64, tone: 'rose', size: 'sm', delay: 3.2 },
  { id: 's8', label: 'Tempo lent', x: 88, y: 92, tone: 'rose', size: 'sm', delay: 3.3 },
];

const SCENE_EDGES: { from: string; to: string; delay: number }[] = [
  { from: 'center', to: 'b1', delay: 1.7 },
  { from: 'center', to: 'b2', delay: 1.85 },
  { from: 'center', to: 'b3', delay: 2.0 },
  { from: 'center', to: 'b4', delay: 2.15 },
  { from: 'b1', to: 's1', delay: 2.45 },
  { from: 'b1', to: 's2', delay: 2.55 },
  { from: 'b2', to: 's3', delay: 2.65 },
  { from: 'b2', to: 's4', delay: 2.75 },
  { from: 'b3', to: 's5', delay: 2.85 },
  { from: 'b3', to: 's6', delay: 2.95 },
  { from: 'b4', to: 's7', delay: 3.05 },
  { from: 'b4', to: 's8', delay: 3.15 },
];

function edgeTone(edge: { from: string; to: string }): Exclude<Tone, 'center'> {
  const target = SCENE_NODES.find((n) => n.id === edge.to);
  return (target && target.tone !== 'center' ? target.tone : 'blue') as Exclude<Tone, 'center'>;
}

/* ------------------------------------------------------------------ */
/*  Barre de thème avec effet machine à écrire                         */
/* ------------------------------------------------------------------ */

function ThemeChip() {
  // Texte complet par défaut : visible sans JS et avec reduced-motion
  const [text, setText] = useState(HERO_THEME);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setText('');
    const id = setInterval(() => {
      i += 1;
      setText(HERO_THEME.slice(0, i));
      if (i >= HERO_THEME.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/95 px-4 py-2.5 shadow-2xl">
      <svg className="h-4 w-4 shrink-0 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
      <span className="whitespace-nowrap text-sm font-medium text-zinc-100">{text}</span>
      <span className="h-4 w-0.5 shrink-0 bg-amber-300" style={{ animation: 'blink 1s steps(1) infinite' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scène : la carte mentale qui se construit                          */
/* ------------------------------------------------------------------ */

function MindMapScene({ compact = false }: { compact?: boolean }) {
  const nodes = compact ? SCENE_NODES.filter((n) => n.size !== 'sm') : SCENE_NODES;
  const edges = compact
    ? SCENE_EDGES.filter((e) => e.from === 'center')
    : SCENE_EDGES;

  return (
    <div className="relative h-full w-full">
      {/* Liens */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((edge) => {
          const from = SCENE_NODES.find((n) => n.id === edge.from)!;
          const to = SCENE_NODES.find((n) => n.id === edge.to)!;
          const cx = (from.x + to.x) / 2 + (to.y - from.y) * 0.15;
          const cy = (from.y + to.y) / 2 - (to.x - from.x) * 0.15;
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
              fill="none"
              stroke={TONES[edgeTone(edge)].hex}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.65}
              vectorEffect="non-scaling-stroke"
              style={{ animation: `edge-in 0.5s ease-out ${edge.delay}s both` }}
            />
          );
        })}
      </svg>

      {/* Nœuds */}
      {nodes.map((node) => {
        const tone = node.tone === 'center' ? null : TONES[node.tone];
        const isCenter = tone === null;
        return (
          <div
            key={node.id}
            className={node.size === 'md' ? 'animate-float-soft absolute' : 'absolute'}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isCenter ? 10 : 5,
              animationDelay: node.size === 'md' ? `${-node.delay}s` : undefined,
            }}
          >
            <div
              className={
                node.size === 'lg'
                  ? 'whitespace-nowrap rounded-xl border-2 px-5 py-2.5 text-base font-bold'
                  : node.size === 'md'
                    ? 'whitespace-nowrap rounded-xl border-2 px-4 py-2 text-sm font-semibold'
                    : 'whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium'
              }
              style={{
                animation: `node-appear 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) ${node.delay}s both`,
                backgroundColor: isCenter ? '#18181b' : tone!.bg,
                borderColor: isCenter ? '#52525b' : tone!.border,
                color: isCenter ? '#fafafa' : tone!.text,
                boxShadow: isCenter
                  ? '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.06)'
                  : `0 6px 24px rgba(0,0,0,0.45), 0 0 20px ${tone!.hex}26`,
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Fragments visuels de la section « Comment ça marche »              */
/* ------------------------------------------------------------------ */

function StepInputMock() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 py-2 pl-4 pr-2">
      <span className="text-sm text-zinc-300">Lancement produit</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300">
        <svg className="h-3.5 w-3.5 text-zinc-950" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </div>
  );
}

function StepClusterMock() {
  return (
    <div className="relative h-20 w-44">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 176 80" aria-hidden="true">
        <path d="M 88 40 Q 60 22 36 18" fill="none" stroke={TONES.emerald.hex} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
        <path d="M 88 40 Q 120 20 142 24" fill="none" stroke={TONES.rose.hex} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
        <path d="M 88 40 Q 62 60 40 62" fill="none" stroke={TONES.blue.hex} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-900">
        Idée
      </span>
      <span className="absolute left-4 top-1 rounded-md border px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: TONES.emerald.bg, borderColor: TONES.emerald.border, color: TONES.emerald.text }}>
        Plan
      </span>
      <span className="absolute right-1 top-3 rounded-md border px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: TONES.rose.bg, borderColor: TONES.rose.border, color: TONES.rose.text }}>
        Équipe
      </span>
      <span className="absolute bottom-1 left-5 rounded-md border px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: TONES.blue.bg, borderColor: TONES.blue.border, color: TONES.blue.text }}>
        Budget
      </span>
    </div>
  );
}

function StepExportMock() {
  return (
    <div className="flex items-center gap-3">
      {(['PNG', 'PDF'] as const).map((format) => (
        <span key={format} className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200">
          <svg className="h-4 w-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {format}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    number: '1',
    title: 'Posez votre thème',
    text: 'Un mot ou une phrase dans la barre : « Révisions du bac », « Lancement produit », « Apprendre le piano »…',
    visual: <StepInputMock />,
  },
  {
    number: '2',
    title: "L'IA structure",
    text: 'Quatre branches principales, des sous-branches organisées, une couleur par branche. Le tout en quelques secondes.',
    visual: <StepClusterMock />,
  },
  {
    number: '3',
    title: 'Ajustez, exportez',
    text: "Déplacez les nœuds librement, réorganisez la carte, puis exportez-la en PNG ou PDF haute résolution.",
    visual: <StepExportMock />,
  },
];

const CAPABILITIES = [
  {
    title: 'Génération par IA',
    text: "Un appel à DeepSeek ou OpenAI transforme votre thème en structure hiérarchique complète.",
  },
  {
    title: 'Éditeur drag & drop',
    text: 'Canvas fluide propulsé par React Flow : déplacez, zoomez, réorganisez sans friction.',
  },
  {
    title: 'Export PNG & PDF',
    text: "Rendu haute résolution de l'ensemble du canvas, prêt à partager ou à imprimer.",
  },
  {
    title: 'Cache intelligent',
    text: 'Un thème déjà exploré se rouvre instantanément : chaque carte générée est mémorisée.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#101114] text-zinc-100">
      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#101114]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300 text-base font-extrabold text-zinc-950">
              M
            </span>
            <span className="text-base font-bold text-zinc-50">Mind Map IA</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#fonctionnement" className="transition-colors hover:text-zinc-100">Comment ça marche</a>
            <a href="#capot" className="transition-colors hover:text-zinc-100">Sous le capot</a>
          </div>

          <Link
            href="/app"
            className="flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ouvrir l'éditeur
          </Link>
        </div>
      </nav>

      {/* Hero : le canvas est le héros */}
      <header className="canvas-grid relative overflow-hidden">
        {/* Vignette de profondeur */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 65% 40%, transparent 40%, rgba(0, 0, 0, 0.5) 100%)' }}
          aria-hidden="true"
        />

        {/* Carte animée — desktop, pleine hauteur à droite */}
        <div className="absolute bottom-0 right-0 top-0 hidden w-[56%] md:block" aria-hidden="true">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/5"
            style={{ background: 'linear-gradient(90deg, #101114 0%, rgba(16,17,20,0.3) 45%, transparent 100%)' }}
          />
          <div className="absolute left-1/2 top-24 z-20 -translate-x-1/2">
            <ThemeChip />
          </div>
          <div className="absolute inset-x-4 bottom-8 top-36">
            <MindMapScene />
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-6xl px-6">
          <div className="flex min-h-[100svh] flex-col justify-center pb-16 pt-28 md:max-w-[46%] md:pb-0 md:pt-16">
            <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl">
              Posez un thème.
              <br />
              La carte <span className="text-amber-300">se dessine</span>.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl">
              Mind Map IA génère une carte mentale complète — branches, sous-branches,
              couleurs — que vous ajustez librement et exportez en PNG ou PDF.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Générer ma première carte
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#fonctionnement"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-7 py-3.5 text-base font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Comment ça marche ?
              </a>
            </div>

            <p className="mt-6 text-sm text-zinc-400">
              Gratuit — aucune inscription requise.
            </p>

            {/* Carte animée — mobile, sous le texte */}
            <div className="relative mt-12 h-[340px] md:hidden" aria-hidden="true">
              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                <ThemeChip />
              </div>
              <div className="absolute inset-x-0 bottom-0 top-16">
                <MindMapScene compact />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Comment ça marche — la vraie séquence du produit */}
      <section id="fonctionnement" className="border-y border-white/5 bg-[#15161b] py-24 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Le flux complet tient en trois gestes — c'est exactement ce que fait l'éditeur, rien de plus.
          </p>

          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
            {STEPS.map((step) => (
              <div key={step.number}>
                <div className="flex h-24 items-center">{step.visual}</div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-xl font-extrabold text-amber-300">{step.number}</span>
                  <h3 className="text-xl font-bold text-zinc-50">{step.title}</h3>
                </div>
                <p className="mt-3 leading-relaxed text-zinc-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sous le capot — fonctionnalités réelles, sans survente */}
      <section id="capot" className="py-24 scroll-mt-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
              Sous le capot
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Pas de promesses en l'air : voici exactement ce que l'outil fait aujourd'hui.
            </p>
          </div>

          <ul className="divide-y divide-white/5 border-y border-white/5">
            {CAPABILITIES.map((cap) => (
              <li key={cap.title} className="flex flex-col gap-1.5 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                <h3 className="shrink-0 text-base font-bold text-zinc-50 sm:w-48">{cap.title}</h3>
                <p className="leading-relaxed text-zinc-400">{cap.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse, rgba(252, 211, 77, 0.08), transparent 65%)' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-zinc-50 md:text-5xl">
            Vos prochaines idées méritent mieux qu'une liste.
          </h2>
          <div className="mt-10">
            <Link
              href="/app"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Ouvrir l'éditeur
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-400">
            Ouvre directement l'éditeur — pas de compte à créer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-300 text-xs font-extrabold text-zinc-950">
              M
            </span>
            <span className="font-semibold text-zinc-300">Mind Map IA</span>
          </div>
          <p>© 2026 Mind Map IA</p>
        </div>
      </footer>
    </div>
  );
}
