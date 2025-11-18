'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';

export default function Toolbar() {
  const { nodes, edges, setNodes, setEdges, mindMapId, setMindMapId } = useMindMapStore();
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          title: 'Ma Mind Map',
          description: 'Mind map créée avec ReactFlow',
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
    <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 border-2 border-gray-200 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mind Map IA
          </h1>
        </div>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Entrez un thème (ex: Intelligence Artificielle)..."
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-80"
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={!theme.trim() || isGenerating}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⚙️</span>
                <span>Génération...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Générer</span>
              </>
            )}
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">{nodes.length}</span>
          <span>idées</span>
        </div>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <button
          onClick={handleSave}
          disabled={isSaving || nodes.length === 0}
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Sauvegarde...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Sauvegarder</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
