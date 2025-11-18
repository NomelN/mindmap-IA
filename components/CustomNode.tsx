'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface CustomNodeData {
  label: string;
  gradient?: string;
  borderColor?: string;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const gradient = data.gradient || 'linear-gradient(to bottom right, #60a5fa, #2563eb)';
  const borderColor = data.borderColor || '#3b82f6';

  return (
    <div
      style={{
        background: gradient,
        borderColor: borderColor,
      }}
      className={cn(
        'px-6 py-4 rounded-2xl shadow-xl border-2 min-w-[180px] transition-all duration-300 text-white',
        selected ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-105' : 'hover:scale-105',
        'backdrop-blur-sm'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />

      <div className="font-semibold text-center text-base">
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
