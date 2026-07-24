import { create } from 'zustand';
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

interface MindMapStore {
  nodes: Node[];
  edges: Edge[];
  mindMapId: string | null;
  // Modifications non persistées en base (déclenche l'autosave)
  isDirty: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  addNodeWithEdge: (node: Node, edge: Edge | null) => void;
  updateNode: (nodeId: string, data: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setMindMapId: (id: string | null) => void;
  markClean: () => void;
}

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: [],
  edges: [],
  mindMapId: null,
  isDirty: false,

  onNodesChange: (changes) => {
    // Seuls les vrais changements comptent comme modification :
    // les événements de sélection/dimensions ne doivent pas déclencher de sauvegarde
    const isRealChange = changes.some(
      (change) => change.type === 'position' || change.type === 'remove'
    );
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      ...(isRealChange && { isDirty: true }),
    });
  },

  onEdgesChange: (changes) => {
    const isRealChange = changes.some((change) => change.type === 'remove');
    set({
      edges: applyEdgeChanges(changes, get().edges),
      ...(isRealChange && { isDirty: true }),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
      isDirty: true,
    });
  },

  addEdge: (edge) => {
    set({
      edges: [...get().edges, edge],
      isDirty: true,
    });
  },

  // Ajoute un nœud (et son lien optionnel) en le sélectionnant seul :
  // permet d'enchaîner les raccourcis clavier depuis le nouveau nœud.
  addNodeWithEdge: (node, edge) => {
    set((state) => ({
      nodes: [
        ...state.nodes.map((n) => (n.selected ? { ...n, selected: false } : n)),
        node,
      ],
      edges: edge ? [...state.edges, edge] : state.edges,
      isDirty: true,
    }));
  },

  updateNode: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, ...data } : node
      ),
      isDirty: true,
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      isDirty: true,
    });
  },

  // Chargements (génération, ouverture d'une carte) : n'activent pas isDirty
  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  setMindMapId: (id) => set({ mindMapId: id }),

  markClean: () => set({ isDirty: false }),
}));
