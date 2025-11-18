'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomNodeData {
  label: string;
  colorClass?: string;
  borderClass?: string;
  textClass?: string;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const colorClass = data.colorClass || 'bg-gradient-to-br from-blue-400 to-blue-600';
  const borderClass = data.borderClass || 'border-blue-500';
  const textClass = data.textClass || 'text-white';

  return (
    <div
      className={cn(
        'px-6 py-4 rounded-2xl shadow-xl border-2 min-w-[180px] transition-all duration-300',
        colorClass,
        borderClass,
        selected ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-105' : 'hover:scale-105',
        'backdrop-blur-sm'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />

      <div className={cn('font-semibold text-center text-base', textClass)}>
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
