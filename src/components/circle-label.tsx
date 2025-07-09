import React from 'react';
import { CirclePackingData, ViewState } from '../types';
import { calculateTransform } from '../utils/circle-packing';

interface CircleLabelProps {
  node: CirclePackingData;
  viewState: ViewState;
  width: number;
  focusNode: CirclePackingData | null;
}

export const CircleLabel: React.FC<CircleLabelProps> = ({
  node,
  viewState,
  width,
  focusNode
}) => {
  const { x, y, r } = calculateTransform(node, [viewState.x, viewState.y, width / viewState.k], width);

  const isVisible = focusNode && node.parent === focusNode;
  const opacity = isVisible ? 1 : 0;

  if (r < 15) return null;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="10"
      fontFamily="sans-serif"
      fill="currentColor"
      style={{
        opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {node.data.name}
    </text>
  );
};