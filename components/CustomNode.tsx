'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, Node, Edge } from '@xyflow/react';
import { cn, nodeColors } from '@/lib/utils';
import { useMindMapStore } from '@/lib/store';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  gradient?: string;
  borderColor?: string;
  colorClass?: string;
  borderClass?: string;
  textClass?: string;
  level?: number;
}

function CustomNode({ id, data, selected }: NodeProps<Node<CustomNodeData>>) {
  const borderColor = data.borderColor || '#3b82f6';
  const level = data.level || 0;
  const [isExpanding, setIsExpanding] = useState(false);

  // Développer cette branche avec l'IA : génère des sous-nœuds
  const handleExpand = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isExpanding) return;
    setIsExpanding(true);

    try {
      const { nodes, edges, addNode, addEdge } = useMindMapStore.getState();
      const me = nodes.find((n) => n.id === id);
      if (!me) return;

      const centralNode = nodes.find(
        (n) => ((n.data as CustomNodeData)?.level ?? 0) === 0
      );
      const theme =
        centralNode && centralNode.id !== id
          ? (centralNode.data as CustomNodeData).label
          : undefined;

      // Labels des enfants existants, pour éviter les doublons
      const existingChildren = edges
        .filter((e) => e.source === id)
        .map((e) => (nodes.find((n) => n.id === e.target)?.data as CustomNodeData)?.label)
        .filter(Boolean);

      const response = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: data.label, theme, existingChildren }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.error || 'Échec du développement de la branche');
        return;
      }

      const { children } = (await response.json()) as { children: { label: string }[] };

      // Direction d'expansion : on s'éloigne du nœud central
      const origin =
        centralNode && centralNode.id !== id
          ? centralNode.position
          : { x: me.position.x - 1, y: me.position.y };
      const baseAngle = Math.atan2(
        me.position.y - origin.y,
        me.position.x - origin.x
      );

      const radius = 230;
      const spread = (80 * Math.PI) / 180; // 80° d'éventail
      const count = children.length;
      const colorOffset = Math.floor(Math.random() * nodeColors.length);

      children.forEach((child, i) => {
        const angle =
          count > 1 ? baseAngle + (i - (count - 1) / 2) * (spread / (count - 1)) : baseAngle;

        // Niveau 0 (centre) : chaque enfant reçoit sa propre couleur, comme à la
        // génération ; sinon on hérite de la couleur de la branche
        const color =
          level === 0
            ? nodeColors[(colorOffset + i) % nodeColors.length]
            : null;

        const childData: CustomNodeData = {
          label: child.label,
          colorClass: color ? color.bg : data.colorClass,
          borderClass: color ? color.border : data.borderClass,
          textClass: color ? color.text : data.textClass,
          borderColor: color ? color.hex : borderColor,
          level: level + 1,
        };

        const childId = `node-${Date.now()}-${i}`;
        const newNode: Node = {
          id: childId,
          type: 'custom',
          position: {
            x: me.position.x + radius * Math.cos(angle),
            y: me.position.y + radius * Math.sin(angle),
          },
          data: childData,
        };

        const newEdge: Edge = {
          id: `edge-${id}-${childId}`,
          source: id,
          target: childId,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: childData.borderColor as string,
            strokeWidth: 2,
          },
        };

        addNode(newNode);
        addEdge(newEdge);
      });
    } catch (error) {
      console.error("Erreur lors de l'expansion:", error);
      alert('Échec du développement de la branche');
    } finally {
      setIsExpanding(false);
    }
  };

  // Styles différents selon le niveau
  const getLevelStyles = () => {
    switch (level) {
      case 0: // Nœud central - Dark & Bold
        return {
          container: 'bg-zinc-900 text-white border-zinc-900',
          padding: 'px-8 py-4',
          fontSize: 'text-xl',
          minWidth: 'min-w-[240px]',
          border: 'border-2',
          shadow: 'shadow-xl',
          fontWeight: 'font-bold',
        };
      case 1: // Branches principales - White & Bordered
        return {
          container: 'bg-white text-zinc-900 border-zinc-200',
          padding: 'px-6 py-3',
          fontSize: 'text-lg',
          minWidth: 'min-w-[180px]',
          border: 'border-2',
          shadow: 'shadow-md',
          fontWeight: 'font-semibold',
        };
      default: // Sous-branches - Minimalist
        return {
          container: 'bg-white text-zinc-700 border-zinc-200',
          padding: 'px-4 py-2',
          fontSize: 'text-base',
          minWidth: 'min-w-[140px]',
          border: 'border',
          shadow: 'shadow-sm',
          fontWeight: 'font-medium',
        };
    }
  };

  const styles = getLevelStyles();

  // Teinte issue de la couleur de branche (choisie via l'éditeur de nœud) :
  // en inline pour rester indépendant de la génération des classes Tailwind
  const tintStyle =
    level > 0
      ? {
          borderColor: `${borderColor}59`, // ~35 % d'opacité
          backgroundColor: `${borderColor}0d`, // ~5 % d'opacité
        }
      : undefined;

  return (
    <div
      className={cn(
        'group relative rounded-xl transition-all duration-300',
        styles.container,
        styles.padding,
        styles.minWidth,
        styles.border,
        styles.shadow,
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-lg',
      )}
      style={tintStyle}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-zinc-400 border-none"
      />

      <div className={cn('text-center', styles.fontSize, styles.fontWeight)}>
        {data.label}
      </div>

      {/* Développer avec l'IA */}
      <button
        onClick={handleExpand}
        disabled={isExpanding}
        className={cn(
          'nodrag nopan absolute -right-3.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow-md transition-all',
          'border-zinc-200 text-zinc-500 hover:scale-110 hover:text-zinc-900 hover:border-zinc-300',
          isExpanding
            ? 'opacity-100 cursor-wait'
            : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
        )}
        title="Développer cette branche avec l'IA"
        aria-label={`Développer « ${data.label} » avec l'IA`}
      >
        {isExpanding ? (
          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        )}
      </button>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-zinc-400 border-none"
      />
    </div>
  );
}

export default memo(CustomNode);
