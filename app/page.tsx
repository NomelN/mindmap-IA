'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-zinc-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-zinc-900">MindMap IA</span>
          </div>
          <Link
            href="/app"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Essayer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nouveau • Propulsé par l'IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight">
            Transformez vos idées en
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              cartes mentales
            </span>
          </h1>

          <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            La plateforme la plus intuitive pour organiser vos pensées.
            Notre IA génère instantanément des structures complètes à partir d'un simple mot-clé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/app"
              className="group px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              Créer ma première mind map
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="px-8 py-4 border-2 border-zinc-200 text-zinc-700 text-lg font-semibold rounded-xl hover:border-zinc-300 hover:bg-zinc-50 transition-all">
              Voir une démo
            </button>
          </div>

          {/* Visual Demo */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-zinc-200 p-8 overflow-hidden">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="pt-8 flex items-center justify-center min-h-[400px]">
                {/* Central Node */}
                <div className="relative">
                  <div className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl">
                    Lancement Produit
                  </div>

                  {/* Branches */}
                  <div className="absolute -left-40 top-1/2 -translate-y-1/2">
                    <div className="w-32 h-0.5 bg-gradient-to-r from-blue-400 to-zinc-900"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border-2 border-blue-400 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg">
                      Marketing
                    </div>
                  </div>

                  <div className="absolute -right-40 top-1/2 -translate-y-1/2">
                    <div className="w-32 h-0.5 bg-gradient-to-l from-purple-400 to-zinc-900"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-2 border-purple-400 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg">
                      Développement
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-24">
                    <div className="h-16 w-0.5 bg-gradient-to-b from-emerald-400 to-zinc-900"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white border-2 border-emerald-400 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg">
                      Commercial
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-zinc-600">
              Des fonctionnalités puissantes pour libérer votre créativité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Génération IA</h3>
              <p className="text-zinc-600 leading-relaxed">
                Entrez simplement votre sujet et laissez notre intelligence artificielle créer une structure complète en quelques secondes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Personnalisation totale</h3>
              <p className="text-zinc-600 leading-relaxed">
                Modifiez, réorganisez et personnalisez chaque élément avec notre éditeur intuitif par glisser-déposer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Sauvegarde automatique</h3>
              <p className="text-zinc-600 leading-relaxed">
                Ne perdez jamais vos idées. Toutes vos créations sont automatiquement sauvegardées dans le cloud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à organiser vos idées ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Rejoignez des milliers d'utilisateurs qui transforment déjà leurs idées en réalité.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
          >
            Commencer gratuitement
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-zinc-900 text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-white font-bold text-lg">MindMap IA</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm">
            © 2024 MindMap IA. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
