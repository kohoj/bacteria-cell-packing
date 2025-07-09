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

  return (
    <circle
      cx={x}
      cy={y}
      r={Math.max(0, r)}
      fill={node.children ? colorScale(node.depth) : 'white'}
      stroke={isHovered ? '#000' : 'none'}
      strokeWidth={isHovered ? 2 : 0}
      style={{
        cursor: node.children ? 'pointer' : 'default',
        pointerEvents: node.children ? 'auto' : 'none',
        transition: 'all 0.3s ease'
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};