'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { type Node, type Edge, useReactFlow } from '@xyflow/react';
import { useMindMapStore } from '@/lib/store';
import { dbMindMapToFlow, type DbMindMap } from '@/lib/mindmap-transform';
import ConfirmModal from './ConfirmModal';

interface MapSummary {
  id: string;
  title: string;
  theme: string | null;
  updatedAt: string;
  _count: { nodes: number };
}

interface MapsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export default function MapsPanel({ isOpen, onClose }: MapsPanelProps) {
  const { mindMapId, setNodes, setEdges, setMindMapId } = useMindMapStore();
  const { fitView } = useReactFlow();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [maps, setMaps] = useState<MapSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [mapToDelete, setMapToDelete] = useState<MapSummary | null>(null);

  const fetchMaps = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/mindmap');
      if (!response.ok) throw new Error('fetch failed');
      setMaps(await response.json());
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchMaps();
  }, [isOpen, fetchMaps]);

  // Fermeture au clavier (Échap)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleOpen = async (map: MapSummary) => {
    setOpeningId(map.id);
    try {
      const response = await fetch(`/api/mindmap/${map.id}`);
      if (!response.ok) throw new Error('fetch failed');
      const dbMindMap: DbMindMap = await response.json();

      const { nodes, edges } = dbMindMapToFlow(dbMindMap);
      setNodes(nodes as unknown as Node[]);
      setEdges(edges as unknown as Edge[]);
      setMindMapId(map.id);
      onClose();
      // Recentrer sur la carte fraîchement ouverte
      setTimeout(() => fitView({ padding: 0.2, maxZoom: 1, duration: 600 }), 80);
    } catch {
      alert("Impossible d'ouvrir cette carte. Réessayez.");
    } finally {
      setOpeningId(null);
    }
  };

  const confirmDelete = async () => {
    if (!mapToDelete) return;
    const { id } = mapToDelete;
    try {
      const response = await fetch(`/api/mindmap/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      setMaps((prev) => prev.filter((m) => m.id !== id));
      // La carte supprimée était ouverte : elle n'existe plus en base
      if (mindMapId === id) setMindMapId(null);
    } catch {
      alert('Impossible de supprimer cette carte. Réessayez.');
    } finally {
      setMapToDelete(null);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Mes cartes">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panneau */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-zinc-200">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">Mes cartes</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Fermer le panneau"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading && (
            <div className="space-y-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-zinc-100 p-4">
                  <div className="h-4 w-2/3 rounded bg-zinc-100" />
                  <div className="mt-2.5 h-3 w-1/3 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="mt-12 flex flex-col items-center text-center">
              <p className="text-sm text-zinc-600">
                Impossible de charger vos cartes.
              </p>
              <button
                onClick={fetchMaps}
                className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Réessayer
              </button>
            </div>
          )}

          {!isLoading && !error && maps.length === 0 && (
            <div className="mt-12 flex flex-col items-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-900">Aucune carte sauvegardée</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                Générez votre première carte avec un thème : elle apparaîtra ici automatiquement.
              </p>
            </div>
          )}

          {!isLoading && !error && maps.length > 0 && (
            <ul className="space-y-2">
              {maps.map((map) => {
                const isCurrent = map.id === mindMapId;
                const isOpening = openingId === map.id;
                return (
                  <li key={map.id}>
                    <div
                      className={`group flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                        isCurrent
                          ? 'border-zinc-900 bg-zinc-50'
                          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <button
                        onClick={() => handleOpen(map)}
                        disabled={isOpening}
                        className="flex-1 text-left disabled:cursor-wait"
                      >
                        <span className="block truncate text-sm font-semibold text-zinc-900">
                          {map.title}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          {isOpening ? (
                            'Ouverture…'
                          ) : (
                            <>
                              <span>{dateFormatter.format(new Date(map.updatedAt))}</span>
                              <span aria-hidden="true">·</span>
                              <span>{map._count.nodes} nœuds</span>
                              {isCurrent && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-medium text-zinc-900">Ouverte</span>
                                </>
                              )}
                            </>
                          )}
                        </span>
                      </button>
                      <button
                        onClick={() => setMapToDelete(map)}
                        className="rounded-full p-2 text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:text-zinc-400"
                        aria-label={`Supprimer la carte ${map.title}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <ConfirmModal
        isOpen={mapToDelete !== null}
        onClose={() => setMapToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer cette carte ?"
        message={`« ${mapToDelete?.title} » sera définitivement supprimée. Cette action est irréversible.`}
      />
    </div>,
    document.body
  );
}
