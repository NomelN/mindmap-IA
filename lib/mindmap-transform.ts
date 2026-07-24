// Conversion d'une mind map stockée en base (Prisma) vers le format ReactFlow.
// Les edges sont stockés avec des indexes de nœuds (voir /api/generate) :
// on les résout ici vers les vrais ids.

interface DbNode {
  id: string;
  type: string;
  position: string; // JSON {x, y}
  data: string; // JSON
}

interface DbEdge {
  source: string; // index du nœud (string) ou id
  target: string;
  type: string | null;
  animated: boolean;
  style: string | null; // JSON
}

export interface DbMindMap {
  id: string;
  title: string;
  theme: string | null;
  nodes: DbNode[];
  edges: DbEdge[];
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    colorClass?: string;
    borderClass?: string;
    textClass?: string;
    borderColor?: string;
    level: number;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
  };
}

export function dbMindMapToFlow(mindMap: DbMindMap): { nodes: FlowNode[]; edges: FlowEdge[] } {
  // Trier les nodes par leur index pour maintenir l'ordre de génération
  const sortedNodes = [...mindMap.nodes].sort((a, b) => {
    const aData = JSON.parse(a.data);
    const bData = JSON.parse(b.data);
    return (aData.nodeIndex || 0) - (bData.nodeIndex || 0);
  });

  // Mapping index -> id de nœud pour résoudre les edges
  const indexToNodeId: { [key: string]: string } = {};

  const nodes: FlowNode[] = sortedNodes.map((node, index) => {
    const parsedData = JSON.parse(node.data);
    indexToNodeId[String(index)] = node.id;

    return {
      id: node.id,
      type: node.type,
      position: JSON.parse(node.position),
      data: {
        label: parsedData.label,
        colorClass: parsedData.colorClass,
        borderClass: parsedData.borderClass,
        textClass: parsedData.textClass,
        borderColor: parsedData.borderColor,
        level: parsedData.level,
      },
    };
  });

  const edges: FlowEdge[] = mindMap.edges.map((edge) => {
    const sourceNodeId = indexToNodeId[edge.source] || edge.source;
    const targetNodeId = indexToNodeId[edge.target] || edge.target;

    return {
      id: `edge-${sourceNodeId}-${targetNodeId}`,
      source: sourceNodeId,
      target: targetNodeId,
      type: edge.type || 'smoothstep',
      animated: edge.animated,
      style: edge.style
        ? JSON.parse(edge.style)
        : {
            stroke: '#a1a1aa',
            strokeWidth: 2,
          },
    };
  });

  return { nodes, edges };
}
