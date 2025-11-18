'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomNodeData {
  label: string;
  gradient?: string;
  borderColor?: string;
  level?: number;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const gradient = data.gradient || 'linear-gradient(to bottom right, #60a5fa, #2563eb)';
  const borderColor = data.borderColor || '#3b82f6';
  const level = data.level || 0;

  // Styles différents selon le niveau
  const getLevelStyles = () => {
    switch (level) {
      case 0: // Nœud central - grand et brillant
        return {
          padding: 'px-10 py-6',
          fontSize: 'text-2xl',
          minWidth: 'min-w-[280px]',
          border: 'border-4',
          shadow: 'shadow-2xl drop-shadow-2xl',
          fontWeight: 'font-bold',
          animation: 'animate-pulse',
        };
      case 1: // Branches principales - moyennes
        return {
          padding: 'px-7 py-4',
          fontSize: 'text-lg',
          minWidth: 'min-w-[200px]',
          border: 'border-3',
          shadow: 'shadow-xl',
          fontWeight: 'font-semibold',
          animation: '',
        };
      default: // Sous-branches - petites
        return {
          padding: 'px-5 py-3',
          fontSize: 'text-base',
          minWidth: 'min-w-[160px]',
          border: 'border-2',
          shadow: 'shadow-lg',
          fontWeight: 'font-medium',
          animation: '',
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <div
      style={{
        background: gradient,
        borderColor: borderColor,
        boxShadow: level === 0
          ? `0 0 30px ${borderColor}, 0 0 60px ${borderColor}40`
          : undefined,
      }}
      className={cn(
        'rounded-2xl transition-all duration-300 text-white',
        styles.padding,
        styles.minWidth,
        styles.border,
        styles.shadow,
        styles.animation,
        selected ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-105' : 'hover:scale-105',
        'backdrop-blur-sm'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />

      <div className={cn('text-center', styles.fontSize, styles.fontWeight)}>
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />
    </div>
  );
}

export default memo(CustomNode);
