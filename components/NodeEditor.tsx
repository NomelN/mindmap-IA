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

  const [label, setLabel] = useState(node?.data?.label || '');

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
        colorClass: color.bg,
        borderClass: color.border,
        textClass: color.text,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Éditer le nœud
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Texte
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-4 gap-2">
              {nodeColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className={`h-12 rounded-lg ${color.bg} border-2 ${color.border} hover:scale-110 transition-transform shadow-md`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sauvegarder
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
