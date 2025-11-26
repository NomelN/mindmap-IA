'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  gradient?: string;
  borderColor?: string;
  level?: number;
}

function CustomNode({ data, selected }: NodeProps<Node<CustomNodeData>>) {
  const gradient = data.gradient || 'linear-gradient(to bottom right, #60a5fa, #2563eb)';
  const borderColor = data.borderColor || '#3b82f6';
  const level = data.level || 0;

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

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        styles.container,
        styles.padding,
        styles.minWidth,
        styles.border,
        styles.shadow,
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-lg',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-zinc-400 border-none"
      />

      <div className={cn('text-center', styles.fontSize, styles.fontWeight)}>
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-zinc-400 border-none"
      />
    </div>
  );
}

export default memo(CustomNode);
