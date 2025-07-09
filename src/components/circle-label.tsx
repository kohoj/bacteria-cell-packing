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

  if (r < 20) return null;

  // Dynamic font size based on circle radius
  const fontSize = Math.max(10, Math.min(16, r / 6));

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
      fontWeight="500"
      fill="#374151"
      style={{
        opacity,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {node.data.name}
    </text>
  );
};