'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { nodeColors } from '@/lib/utils';

interface NodeEditorProps {
  nodeId: string;
  onClose: () => void;
}

export default function NodeEditor({ nodeId, onClose }: NodeEditorProps) {
  const { nodes, updateNode, deleteNode } = useMindMapStore();
  const node = nodes.find((n) => n.id === nodeId);

  const [label, setLabel] = useState<string>((node?.data?.label as string) || '');

  if (!node) return null;

  const handleSave = () => {
    updateNode(nodeId, {
      data: {
        ...node.data,
        label,
      },
    });
    onClose();
  };

  const handleDelete = () => {
    deleteNode(nodeId);
    onClose();
  };

  const handleColorChange = (color: typeof nodeColors[0]) => {
    updateNode(nodeId, {
      data: {
        ...node.data,
        // On stocke les classes Tailwind directement
        colorClass: color.bg,
        borderClass: color.border,
        textClass: color.text,
        borderColor: color.hex, // Pour la minimap
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-zinc-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-900">
            Éditer le nœud
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Texte
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  onClose();
                }
              }}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 placeholder-zinc-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-6 gap-2">
              {nodeColors.map((color, index) => {
                const isSelected =
                  (node.data as { borderColor?: string })?.borderColor === color.hex;
                return (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                      isSelected ? 'ring-2 ring-zinc-900 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Couleur ${color.name}`}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Sauvegarder
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
