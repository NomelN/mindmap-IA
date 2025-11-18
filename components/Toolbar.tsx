'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';

export default function Toolbar() {
  const { nodes, edges, setNodes, setEdges, mindMapId, setMindMapId } = useMindMapStore();
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleClear = () => {
    if (nodes.length > 0) {
      const confirm = window.confirm('Êtes-vous sûr de vouloir effacer la carte actuelle ?');
      if (confirm) {
        setNodes([]);
        setEdges([]);
        setTheme('');
        setMindMapId(null);
      }
    }
  };

  const handleGenerate = async () => {
    if (!theme.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (response.ok) {
        const data = await response.json();

        // Mettre à jour le mindMapId (depuis le cache ou nouvelle génération)
        if (data.mindMapId) {
          setMindMapId(data.mindMapId);
        }

        // Animation: ajouter les nodes progressivement
        const { nodes: generatedNodes, edges: generatedEdges } = data;

        // Réinitialiser d'abord
        setNodes([]);
        setEdges([]);

        // Ajouter les nodes avec animation
        for (let i = 0; i < generatedNodes.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150)); // Délai entre chaque node
          setNodes(generatedNodes.slice(0, i + 1));

          // Ajouter les edges correspondants
          const relevantEdges = generatedEdges.filter((edge: any) => {
            const sourceIndex = generatedNodes.findIndex((n: any) => n.id === edge.source);
            const targetIndex = generatedNodes.findIndex((n: any) => n.id === edge.target);
            return sourceIndex <= i && targetIndex <= i;
          });
          setEdges(relevantEdges);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('Erreur lors de la génération de la mind map');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerate();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = mindMapId ? `/api/mindmap/${mindMapId}` : '/api/mindmap';
      const method = mindMapId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: theme || 'Ma Mind Map',
          description: 'Mind map créée avec ReactFlow',
          theme: theme.toLowerCase().trim(),
          nodes,
          edges,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!mindMapId) {
          setMindMapId(data.id);
        }
        alert('Mind map sauvegardée avec succès !');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-3 border border-gray-200/50">
      <div className="flex items-center gap-3">
        {/* Logo et titre */}
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-sm">
            M
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">Mind Map IA</span>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Entrez un thème..."
              className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white"
              disabled={isGenerating}
            />
            {theme && (
              <button
                onClick={() => setTheme('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Bouton Générer */}
          <button
            onClick={handleGenerate}
            disabled={!theme.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">Génération...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Générer</span>
              </>
            )}
          </button>
        </div>

        {/* Séparateur */}
        <div className="h-8 w-px bg-gray-200 hidden md:block" />

        {/* Compteur */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
          <span className="font-semibold text-gray-800">{nodes.length}</span>
          <span>nœuds</span>
        </div>

        {/* Séparateur */}
        <div className="h-8 w-px bg-gray-200 hidden md:block" />

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          {/* Bouton Effacer */}
          <button
            onClick={handleClear}
            disabled={nodes.length === 0}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
            title="Effacer la carte"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Bouton Sauvegarder */}
          <button
            onClick={handleSave}
            disabled={isSaving || nodes.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            <span className="hidden sm:inline">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
