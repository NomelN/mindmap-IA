'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
}

// Floating particles component - using fixed positions to avoid hydration mismatch
function FloatingParticles() {
  // Pre-defined positions to avoid SSR/client mismatch
  const particles = [
    { left: 5, top: 10, delay: 0.2, duration: 4 },
    { left: 15, top: 30, delay: 1.5, duration: 5 },
    { left: 25, top: 60, delay: 0.8, duration: 6 },
    { left: 35, top: 20, delay: 2.1, duration: 4.5 },
    { left: 45, top: 80, delay: 0.5, duration: 5.5 },
    { left: 55, top: 40, delay: 1.2, duration: 4.2 },
    { left: 65, top: 70, delay: 2.5, duration: 5.8 },
    { left: 75, top: 15, delay: 0.3, duration: 6.2 },
    { left: 85, top: 50, delay: 1.8, duration: 4.8 },
    { left: 95, top: 85, delay: 2.8, duration: 5.2 },
    { left: 10, top: 45, delay: 3.1, duration: 4.3 },
    { left: 20, top: 75, delay: 0.9, duration: 5.7 },
    { left: 30, top: 25, delay: 2.3, duration: 6.1 },
    { left: 40, top: 55, delay: 1.1, duration: 4.6 },
    { left: 50, top: 90, delay: 3.5, duration: 5.3 },
    { left: 60, top: 35, delay: 0.6, duration: 6.4 },
    { left: 70, top: 65, delay: 2.7, duration: 4.9 },
    { left: 80, top: 5, delay: 1.4, duration: 5.6 },
    { left: 90, top: 95, delay: 3.2, duration: 4.1 },
    { left: 98, top: 22, delay: 0.4, duration: 5.9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30 animate-pulse-glow"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated Mind Map Demo
function AnimatedMindMapDemo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const nodes = [
    { id: 'center', label: 'Stratégie 2025', x: '50%', y: '50%', delay: 0, color: 'from-blue-600 to-purple-600' },
    { id: 'n1', label: 'Marketing', x: '20%', y: '30%', delay: 0.3, color: 'from-pink-500 to-rose-500' },
    { id: 'n2', label: 'Produit', x: '80%', y: '30%', delay: 0.4, color: 'from-violet-500 to-purple-500' },
    { id: 'n3', label: 'Équipe', x: '20%', y: '70%', delay: 0.5, color: 'from-emerald-500 to-teal-500' },
    { id: 'n4', label: 'Finance', x: '80%', y: '70%', delay: 0.6, color: 'from-amber-500 to-orange-500' },
    { id: 'n5', label: 'SEO', x: '5%', y: '20%', delay: 0.8, color: 'from-cyan-500 to-blue-500', size: 'small' },
    { id: 'n6', label: 'Réseaux', x: '10%', y: '45%', delay: 0.9, color: 'from-fuchsia-500 to-pink-500', size: 'small' },
    { id: 'n7', label: 'Features', x: '92%', y: '20%', delay: 1.0, color: 'from-indigo-500 to-violet-500', size: 'small' },
    { id: 'n8', label: 'UX/UI', x: '90%', y: '45%', delay: 1.1, color: 'from-purple-500 to-fuchsia-500', size: 'small' },
  ];

  const connections = [
    { from: 'center', to: 'n1', delay: 0.2 },
    { from: 'center', to: 'n2', delay: 0.3 },
    { from: 'center', to: 'n3', delay: 0.4 },
    { from: 'center', to: 'n4', delay: 0.5 },
    { from: 'n1', to: 'n5', delay: 0.7 },
    { from: 'n1', to: 'n6', delay: 0.8 },
    { from: 'n2', to: 'n7', delay: 0.9 },
    { from: 'n2', to: 'n8', delay: 1.0 },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />

      {/* Container */}
      <div className="relative w-full h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
        {/* Window controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>

        {/* Toolbar mockup */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-100/80 border-b border-zinc-200/50 flex items-center justify-center">
          <span className="text-sm text-zinc-500 font-medium">mindmap-ia.app/editor</span>
        </div>

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pt-12" style={{ zIndex: 1 }}>
          {isVisible && connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-draw-line"
                style={{
                  animationDelay: `${conn.delay}s`,
                  opacity: 0,
                  animation: `fade-in-up 0.5s ease-out ${conn.delay}s forwards`
                }}
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isVisible ? 'animate-node-appear' : 'opacity-0'
              }`}
            style={{
              left: node.x,
              top: node.y,
              animationDelay: `${node.delay}s`,
              zIndex: node.id === 'center' ? 10 : 5
            }}
          >
            <div
              className={`
                ${node.size === 'small' ? 'px-3 py-1.5 text-xs' : node.id === 'center' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'}
                bg-gradient-to-r ${node.color} text-white font-semibold rounded-xl shadow-lg
                hover:scale-110 transition-transform cursor-pointer
                ${node.id === 'center' ? 'glow-blue' : ''}
              `}
            >
              {node.label}
            </div>
          </div>
        ))}

        {/* Sparkle effects */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-yellow-400 rounded-full animate-pulse-glow opacity-60" />
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse-glow opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 left-32 w-2 h-2 bg-blue-400 rounded-full animate-pulse-glow opacity-60" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  return (
    <div
      className="group relative bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Gradient blob on hover */}
      <div className={`absolute -inset-px bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

      <div className="relative">
        {/* Icon */}
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
        <p className="text-zinc-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Stats Component
function StatsSection() {
  const stats = [
    { value: 10000, label: 'Utilisateurs actifs', suffix: '+' },
    { value: 50000, label: 'Mind maps créées', suffix: '+' },
    { value: 99, label: 'Satisfaction client', suffix: '%' },
    { value: 24, label: 'Support disponible', suffix: '/7' },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <StatItem key={i} {...stat} isVisible={isVisible} delay={i * 0.1} />
      ))}
    </div>
  );
}

function StatItem({
  value,
  label,
  suffix,
  isVisible,
  delay
}: {
  value: number;
  label: string;
  suffix: string;
  isVisible: boolean;
  delay: number;
}) {
  const { count, start } = useCountUp(value, 2000);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(start, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, start, delay]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text-animated mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-zinc-600 font-medium">{label}</div>
    </div>
  );
}

// Testimonial Card
function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  delay
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  delay: number;
}) {
  return (
    <div
      className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl border border-white/50 shadow-xl animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-zinc-700 text-lg leading-relaxed mb-6">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {avatar}
        </div>
        <div>
          <div className="font-bold text-zinc-900">{author}</div>
          <div className="text-zinc-500 text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[128px] animate-aurora" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[128px] animate-aurora" style={{ animationDelay: '-7s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[128px] animate-aurora" style={{ animationDelay: '-14s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold text-zinc-900">MindMap IA</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Fonctionnalités</a>
                <a href="#demo" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Démo</a>
                <a href="#testimonials" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Avis</a>
              </div>

              <Link
                href="/app"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 btn-shine"
              >
                Essayer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 text-sm font-semibold mb-8 animate-fade-in-up">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nouveau • Propulsé par l'IA
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-zinc-900 mb-8 tracking-tight animate-fade-in-up stagger-1">
              Transformez vos idées en
              <span className="block mt-2 gradient-text-animated">
                cartes mentales
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up stagger-2">
              La plateforme la plus intuitive pour organiser vos pensées.
              <span className="text-zinc-900 font-semibold"> Notre IA génère instantanément </span>
              des structures complètes à partir d'un simple mot-clé.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-3">
              <Link
                href="/app"
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-3 btn-shine"
              >
                <span>Créer ma première mind map</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#demo"
                className="px-10 py-5 bg-white/80 backdrop-blur-lg border-2 border-zinc-200 text-zinc-700 text-lg font-semibold rounded-2xl hover:border-zinc-300 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Voir la démo
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-500 animate-fade-in-up stagger-4">
              <div className="flex -space-x-3">
                {['S', 'M', 'L', 'A', 'P'].map((letter, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-zinc-900">+10,000</span> utilisateurs nous font confiance
              </div>
            </div>
          </div>

          {/* Demo Section */}
          <div id="demo" className="mt-8 animate-fade-in-up stagger-5">
            <AnimatedMindMapDemo />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <StatsSection />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fonctionnalités
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Des fonctionnalités puissantes pour libérer votre créativité et organiser vos idées efficacement.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Génération IA Instantanée"
              description="Entrez simplement votre sujet et laissez notre IA créer une structure complète en quelques secondes. Magic !"
              gradient="from-blue-500 to-cyan-500"
              delay={0}
            />
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
              title="Personnalisation Totale"
              description="Modifiez, réorganisez et personnalisez chaque élément avec notre éditeur intuitif par glisser-déposer."
              gradient="from-purple-500 to-pink-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
              title="Export PDF & PNG"
              description="Exportez vos créations en haute qualité pour les partager ou les imprimer. Compatible avec tous vos outils."
              gradient="from-emerald-500 to-teal-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
              title="Sauvegarde Cloud"
              description="Ne perdez jamais vos idées. Toutes vos créations sont automatiquement sauvegardées et synchronisées."
              gradient="from-orange-500 to-amber-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              title="Collaboration (Bientôt)"
              description="Travaillez en équipe en temps réel sur vos mind maps. Partagez, commentez et co-créez ensemble."
              gradient="from-rose-500 to-red-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              title="100% Sécurisé"
              description="Vos données sont protégées avec un chiffrement de bout en bout. Votre vie privée est notre priorité."
              gradient="from-indigo-500 to-violet-500"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Découvrez ce que nos utilisateurs disent de MindMap IA.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="MindMap IA a révolutionné ma façon de préparer mes cours. En quelques minutes, j'ai une structure complète pour mes leçons."
              author="Sophie Martin"
              role="Professeure de lycée"
              avatar="SM"
              delay={0}
            />
            <TestimonialCard
              quote="L'IA est bluffante ! J'utilise cet outil quotidiennement pour organiser mes projets et brainstormer avec mon équipe."
              author="Thomas Dubois"
              role="Chef de projet"
              avatar="TD"
              delay={0.1}
            />
            <TestimonialCard
              quote="Simple, rapide et efficace. La meilleure application de mind mapping que j'ai utilisée. Et l'export PDF est parfait !"
              author="Marie Laurent"
              role="Étudiante en médecine"
              avatar="ML"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

        {/* Floating particles */}
        <FloatingParticles />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 text-glow">
            Prêt à organiser vos idées ?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui transforment déjà leurs idées en réalité.
            <span className="text-white font-semibold"> C'est gratuit !</span>
          </p>

          <Link
            href="/app"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white text-zinc-900 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            <span>Commencer maintenant</span>
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-6 text-white/60 text-sm">
            Aucune carte de crédit requise • Commencez en 30 secondes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-zinc-950 text-zinc-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold text-white">MindMap IA</span>
              </Link>
              <p className="text-zinc-500 max-w-md leading-relaxed">
                La plateforme de mind mapping propulsée par l'intelligence artificielle. Transformez vos idées en structures visuelles en quelques secondes.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Démo</a></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Commencer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-zinc-500">
              © 2025 MindMap IA. Tous droits réservés.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
