import React from 'react';
import { CirclePackingData, ViewState } from '../types';
import { calculateTransform } from '../utils/circle-packing';

interface CircleNodeProps {
  node: CirclePackingData;
  viewState: ViewState;
  width: number;
  colorScale: (depth: number) => string;
  isHovered: boolean;
  onClick: (node: CirclePackingData) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CircleNode: React.FC<CircleNodeProps> = ({
  node,
  viewState,
  width,
  colorScale,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const { x, y, r } = calculateTransform(node, [viewState.x, viewState.y, width / viewState.k], width);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(node);
  };

  // Modern color palette inspired by Apple/Linear/Raycast
  const getModernColor = (depth: number): string => {
    const colors = [
      '#f8fafc', // gray-50
      '#e2e8f0', // gray-200  
      '#cbd5e1', // gray-300
      '#94a3b8', // gray-400
      '#64748b', // gray-500
      '#475569', // gray-600
    ];
    return colors[Math.min(depth, colors.length - 1)];
  };

  const fillColor = node.children ? getModernColor(node.depth) : '#ffffff';
  const strokeColor = isHovered ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)';
  const strokeWidth = isHovered ? 2 : node.children ? 1 : 0;

  return (
    <circle
      cx={x}
      cy={y}
      r={Math.max(0, r)}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      style={{
        cursor: node.children ? 'pointer' : 'default',
        pointerEvents: node.children ? 'auto' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isHovered ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.15))' : 'none'
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};