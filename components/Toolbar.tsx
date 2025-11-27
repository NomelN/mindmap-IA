'use client';

import { useState } from 'react';
import { useMindMapStore } from '@/lib/store';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import ConfirmModal from './ConfirmModal';

export default function Toolbar() {
  const { nodes, edges, setNodes, setEdges, mindMapId, setMindMapId } = useMindMapStore();
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { getNodes } = useReactFlow();

  const handleClear = () => {
    if (nodes.length > 0) {
      setShowConfirmModal(true);
    }
  };

  const confirmClear = () => {
    setNodes([]);
    setEdges([]);
    setTheme('');
    setMindMapId(null);
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

  const downloadImage = (dataUrl: string, extension: string) => {
    const a = document.createElement('a');
    a.setAttribute('download', `mindmap-${Date.now()}.${extension}`);
    a.setAttribute('href', dataUrl);
    a.click();
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      const nodesBounds = getNodesBounds(getNodes());
      const imageWidth = 1920;
      const imageHeight = 1080;

      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.1
      );

      const reactFlowElement = document.querySelector('.react-flow__viewport') as HTMLElement;

      if (reactFlowElement) {
        const dataUrl = await toPng(reactFlowElement, {
          backgroundColor: '#fafafa',
          width: imageWidth,
          height: imageHeight,
          style: {
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        });

        downloadImage(dataUrl, 'png');
      }
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Erreur lors de l\'export PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      const nodesBounds = getNodesBounds(getNodes());
      const imageWidth = 1920;
      const imageHeight = 1080;

      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.1
      );

      const reactFlowElement = document.querySelector('.react-flow__viewport') as HTMLElement;

      if (reactFlowElement) {
        const dataUrl = await toPng(reactFlowElement, {
          backgroundColor: '#fafafa',
          width: imageWidth,
          height: imageHeight,
          style: {
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        });

        // Create PDF using jsPDF
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [imageWidth, imageHeight]
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight);
        pdf.save(`mindmap-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-lg px-6 py-3 border border-zinc-200 flex items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Logo et titre - Cliquable pour retour accueil */}
        <Link href="/" className="flex items-center gap-2 pr-4 border-r border-zinc-200 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-sm">
            M
          </div>
          <span className="text-sm font-semibold text-zinc-800 hidden sm:block">Mind Map IA</span>
        </Link>

        {/* Barre de recherche */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Entrez un thème..."
              className="w-full pl-4 pr-10 py-2 text-sm bg-zinc-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-200 text-zinc-800 placeholder-zinc-400 transition-all"
              disabled={isGenerating}
            />
            {theme && (
              <button
                onClick={() => setTheme('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
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
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
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
        <div className="h-6 w-px bg-zinc-200 hidden md:block" />

        {/* Compteur */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
          <span className="font-semibold text-zinc-800">{nodes.length}</span>
          <span>nœuds</span>
        </div>

        {/* Séparateur */}
        <div className="h-6 w-px bg-zinc-200 hidden md:block" />

        {/* Boutons d'action */}
        <div className="flex items-center gap-1">
          {/* Bouton Effacer */}
          <button
            onClick={handleClear}
            disabled={nodes.length === 0}
            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Effacer la carte"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Bouton Exporter */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || nodes.length === 0}
              className="px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span className="hidden sm:inline">{isExporting ? 'Export...' : 'Exporter'}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menu d'export */}
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50">
                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Exporter en PNG
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Exporter en PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmClear}
        title="Effacer la mind map ?"
        message="Cette action est irréversible. Toutes vos modifications seront perdues."
      />
    </div>
  );
}
