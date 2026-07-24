'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMindMapStore } from '@/lib/store';

type Status = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

const SAVE_DEBOUNCE_MS = 1500;

export default function AutoSave() {
  const { nodes, edges, isDirty } = useMindMapStore();
  const [status, setStatus] = useState<Status>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    const state = useMindMapStore.getState();
    const { nodes: savedNodes, edges: savedEdges, mindMapId } = state;

    // Rien à créer : un canvas vide sans carte associée
    if (!mindMapId && savedNodes.length === 0) {
      state.markClean();
      setStatus('idle');
      return;
    }

    // Le titre suit le nœud central (mis à jour même après renommage)
    const centralNode = savedNodes.find(
      (n) => ((n.data as { level?: number })?.level ?? 0) === 0
    );
    const title =
      (centralNode?.data as { label?: string })?.label || 'Nouvelle carte';

    setStatus('saving');
    try {
      const response = await fetch(
        mindMapId ? `/api/mindmap/${mindMapId}` : '/api/mindmap',
        {
          method: mindMapId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, nodes: savedNodes, edges: savedEdges }),
        }
      );

      if (!response.ok) throw new Error('save failed');

      if (!mindMapId) {
        const created = await response.json();
        useMindMapStore.getState().setMindMapId(created.id);
      }

      // Ne marquer propre que si rien n'a bougé pendant la requête ;
      // sinon isDirty reste vrai et l'effet reprogramme une sauvegarde
      const latest = useMindMapStore.getState();
      if (latest.nodes === savedNodes && latest.edges === savedEdges) {
        latest.markClean();
        setStatus('saved');
      }
    } catch (error) {
      console.error('Erreur de sauvegarde automatique:', error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    setStatus('pending');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, SAVE_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, isDirty, save]);

  if (status === 'idle') return null;

  if (status === 'error') {
    return (
      <button
        onClick={save}
        className="hidden md:flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-100 transition-colors"
        title="La sauvegarde a échoué — cliquez pour réessayer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Échec — réessayer
      </button>
    );
  }

  return (
    <div
      className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100"
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && (
        <>
          <svg className="w-3.5 h-3.5 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Sauvegarde…
        </>
      )}
      {status === 'pending' && (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
          Modifié
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Sauvegardé
        </>
      )}
    </div>
  );
}
