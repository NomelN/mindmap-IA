'use client';

import { useCallback, useEffect, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/lib/store';
import { getRandomColor } from '@/lib/utils';
import CustomNode from './CustomNode';
import Toolbar from './Toolbar';
import NodeEditor from './NodeEditor';

const nodeTypes = {
  custom: CustomNode,
};

const edgeOptions = {
  animated: true,
  style: {
    stroke: '#6366f1',
    strokeWidth: 2,
  },
};

export default function MindMapCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addEdge: addStoreEdge,
    setNodes,
    setEdges,
  } = useMindMapStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#6366f1',
          strokeWidth: 2,
        },
      } as Edge;
      addStoreEdge(newEdge);
    },
    [addStoreEdge]
  );

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Initialiser avec un node central si vide
  useEffect(() => {
    if (nodes.length === 0) {
      const colors = getRandomColor();
      const centralNode: Node = {
        id: '1',
        type: 'custom',
        position: { x: 400, y: 200 },
        data: {
          label: 'Idée Centrale',
          colorClass: colors.bg,
          borderClass: colors.border,
          textClass: colors.text,
        },
      };
      setNodes([centralNode]);
    }
  }, [nodes.length, setNodes]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        minZoom={0.2}
        maxZoom={4}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#cbd5e1"
        />
        <Controls
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          showInteractive={false}
        />
        <MiniMap
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          nodeColor={(node) => {
            // Extraire la couleur principale du gradient
            const colorClass = node.data?.colorClass || '';
            if (colorClass.includes('blue')) return '#3b82f6';
            if (colorClass.includes('purple')) return '#a855f7';
            if (colorClass.includes('pink')) return '#ec4899';
            if (colorClass.includes('orange')) return '#f97316';
            if (colorClass.includes('green')) return '#22c55e';
            if (colorClass.includes('teal')) return '#14b8a6';
            if (colorClass.includes('cyan')) return '#06b6d4';
            if (colorClass.includes('indigo')) return '#6366f1';
            return '#3b82f6';
          }}
          maskColor="rgb(240, 240, 255, 0.6)"
        />
        <Panel position="top-center">
          <Toolbar />
        </Panel>
      </ReactFlow>

      {selectedNodeId && (
        <NodeEditor
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
