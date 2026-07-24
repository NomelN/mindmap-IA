'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  ControlButton,
  MiniMap,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import { makeChildNode, makeFreeNode } from '@/lib/node-factory';
import CustomNode from './CustomNode';
import Toolbar from './Toolbar';
import NodeEditor from './NodeEditor';

const nodeTypes = {
  custom: CustomNode,
};

const edgeOptions = {
  animated: true,
  style: {
    stroke: '#a1a1aa', // zinc-400
    strokeWidth: 2,
  },
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-600 shadow-sm">
      {children}
    </kbd>
  );
}

function KeyboardHint() {
  return (
    <div className="hidden md:flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-xs text-zinc-500 shadow-sm backdrop-blur">
      <span className="flex items-center gap-1.5"><Kbd>Tab</Kbd> enfant</span>
      <span className="text-zinc-300">·</span>
      <span className="flex items-center gap-1.5"><Kbd>Entrée</Kbd> frère</span>
      <span className="text-zinc-300">·</span>
      <span className="flex items-center gap-1.5"><Kbd>Suppr</Kbd> supprimer</span>
      <span className="text-zinc-300">·</span>
      <span>double-clic pour éditer</span>
    </div>
  );
}

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, addEdge: addStoreEdge, addNodeWithEdge } =
    useMindMapStore();
  const { screenToFlowPosition } = useReactFlow();
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      // Récupérer la couleur du nœud source pour teinter le lien
      const sourceNode = useMindMapStore
        .getState()
        .nodes.find((n) => n.id === params.source);
      const sourceColor = (sourceNode?.data as { borderColor?: string })?.borderColor || '#a1a1aa';

      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: sourceColor, strokeWidth: 2 },
      } as Edge;
      addStoreEdge(newEdge);
    },
    [addStoreEdge]
  );

  // Crée un enfant du nœud donné et ouvre l'éditeur pour le nommer aussitôt
  const createChild = useCallback(
    (parent: Node) => {
      const siblingIndex = useMindMapStore
        .getState()
        .edges.filter((e) => e.source === parent.id).length;
      const { node, edge } = makeChildNode(parent, siblingIndex);
      addNodeWithEdge(node, edge);
      setEditingNodeId(node.id);
    },
    [addNodeWithEdge]
  );

  // Crée un frère (= enfant du même parent) ; sans parent, retombe sur un enfant
  const createSibling = useCallback(
    (selected: Node) => {
      const state = useMindMapStore.getState();
      const parentEdge = state.edges.find((e) => e.target === selected.id);
      const parent = parentEdge
        ? state.nodes.find((n) => n.id === parentEdge.source)
        : null;
      createChild(parent ?? selected);
    },
    [createChild]
  );

  const addNodeAtCenter = useCallback(() => {
    const state = useMindMapStore.getState();
    const selected = state.nodes.find((n) => n.selected);
    if (selected) {
      createChild(selected);
      return;
    }
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    const node = makeFreeNode(center, state.nodes.length === 0, state.nodes.length);
    addNodeWithEdge(node, null);
    setEditingNodeId(node.id);
  }, [screenToFlowPosition, createChild, addNodeWithEdge]);

  // Double-clic sur le fond (pas sur un nœud) : nouveau nœud à cet endroit
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('react-flow__pane')) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const state = useMindMapStore.getState();
      const node = makeFreeNode(position, state.nodes.length === 0, state.nodes.length);
      addNodeWithEdge(node, null);
      setEditingNodeId(node.id);
    },
    [screenToFlowPosition, addNodeWithEdge]
  );

  // Raccourcis clavier : Tab = enfant, Entrée = frère (Suppr géré par React Flow)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
        return;
      }
      if (editingNodeId) return; // une modale d'édition est ouverte

      const selected = useMindMapStore.getState().nodes.filter((n) => n.selected);
      if (selected.length !== 1) return;

      if (event.key === 'Tab') {
        event.preventDefault();
        createChild(selected[0]);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        createSibling(selected[0]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingNodeId, createChild, createSibling]);

  return (
    <div className="w-full h-screen bg-zinc-50" onDoubleClick={handleDoubleClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(_, node) => setEditingNodeId(node.id)}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        deleteKeyCode={['Delete', 'Backspace']}
        zoomOnDoubleClick={false}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e4e4e7" />
        <Controls
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          showInteractive={false}
        >
          <ControlButton onClick={addNodeAtCenter} title="Ajouter un nœud">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </ControlButton>
        </Controls>
        <MiniMap
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          nodeColor={(node: Node) =>
            (node.data as { borderColor?: string })?.borderColor || '#3b82f6'
          }
          maskColor="rgb(240, 240, 255, 0.6)"
        />
        <Panel position="top-center">
          <Toolbar />
        </Panel>
        <Panel position="bottom-center">
          <KeyboardHint />
        </Panel>
      </ReactFlow>

      {editingNodeId && (
        <NodeEditor nodeId={editingNodeId} onClose={() => setEditingNodeId(null)} />
      )}
    </div>
  );
}

export default function MindMapCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
