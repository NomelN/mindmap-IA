'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { getRandomColor } from '@/lib/utils';
import { Node } from '@xyflow/react';

export default function Toolbar() {
  const { nodes, edges, addNode, mindMapId, setMindMapId } = useMindMapStore();
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;

    const colors = getRandomColor();

    // Calculer une position aléatoire autour du centre
    const randomX = 300 + Math.random() * 400;
    const randomY = 100 + Math.random() * 400;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: randomX, y: randomY },
      data: {
        label: newNodeLabel,
        colorClass: colors.bg,
        borderClass: colors.border,
        textClass: colors.text,
      },
    };

    addNode(newNode);
    setNewNodeLabel('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNode();
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
            Mind Map
          </h1>
        </div>

        <div className="h-8 w-px bg-gray-300 mx-2" />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nouvelle idée..."
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            onClick={handleAddNode}
            disabled={!newNodeLabel.trim()}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + Ajouter
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
          disabled={isSaving}
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
