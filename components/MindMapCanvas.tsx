'use client';

import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  addEdge,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import CustomNode from './CustomNode';
import Toolbar from './Toolbar';

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

function FlowContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addEdge: addStoreEdge,
  } = useMindMapStore();

  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#a1a1aa', // zinc-400
          strokeWidth: 2,
        },
      } as Edge;
      addStoreEdge(newEdge);
    },
    [addStoreEdge]
  );

  // Centrer automatiquement quand les nodes changent
  useEffect(() => {
    if (nodes.length > 0) {
      // Petit délai pour s'assurer que les nodes sont rendus
      setTimeout(() => {
        fitView({
          padding: 0.2,
          duration: 800,
          maxZoom: 1,
        });
      }, 100);
    }
  }, [nodes.length, fitView]);

  return (
    <>
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#e4e4e7" // zinc-200
      />
      <Controls
        className="bg-white rounded-lg shadow-lg border border-gray-200"
        showInteractive={false}
      />
      <MiniMap
        className="bg-white rounded-lg shadow-lg border border-gray-200"
        nodeColor={(node: Node) => {
          // Extraire la couleur du borderColor
          const borderColor = (node.data as any)?.borderColor;
          return borderColor || '#3b82f6';
        }}
        maskColor="rgb(240, 240, 255, 0.6)"
      />
      <Panel position="top-center">
        <Toolbar />
      </Panel>
    </>
  );
}

export default function MindMapCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
  } = useMindMapStore();

  return (
    <div className="w-full h-screen bg-zinc-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <FlowContent />
      </ReactFlow>
    </div>
  );
}
