import React, { useMemo } from 'react';
import { CirclePackingData, ViewState } from '../types';
import { calculateTransform } from '../utils/circle-packing';

interface CircleLabelProps {
  node: CirclePackingData;
  viewState: ViewState;
  width: number;
  focusNode: CirclePackingData | null;
}

export const CircleLabel: React.FC<CircleLabelProps> = React.memo(({
  node,
  viewState,
  width,
  focusNode
}) => {
  // 缓存变换计算
  const transform = useMemo(() => {
    return calculateTransform(node, [viewState.x, viewState.y, width / viewState.k], width);
  }, [node, viewState.x, viewState.y, viewState.k, width]);

  // 缓存可见性和样式计算
  const labelStyle = useMemo(() => {
    const { r } = transform;
    const isVisible = focusNode && node.parent === focusNode;
    const opacity = isVisible ? 1 : 0;
    const fontSize = Math.max(10, Math.min(16, r / 6));
    
    return { isVisible, opacity, fontSize, shouldRender: r >= 20 };
  }, [transform, focusNode, node.parent]);

  const { x, y } = transform;

  // 如果圆圈太小或不可见，不渲染
  if (!labelStyle.shouldRender) return null;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={labelStyle.fontSize}
      fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
      fontWeight="500"
      fill="#374151"
      style={{
        opacity: labelStyle.opacity,
        transition: labelStyle.isVisible ? 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {node.data.name}
    </text>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有真正相关的props变化时才重新渲染
  return (
    prevProps.node === nextProps.node &&
    prevProps.viewState.x === nextProps.viewState.x &&
    prevProps.viewState.y === nextProps.viewState.y &&
    prevProps.viewState.k === nextProps.viewState.k &&
    prevProps.width === nextProps.width &&
    prevProps.focusNode === nextProps.focusNode
  );
});