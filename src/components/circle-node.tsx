import React, { useMemo } from 'react';
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

export const CircleNode: React.FC<CircleNodeProps> = React.memo(({
  node,
  viewState,
  width,
  colorScale,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // 缓存变换计算
  const transform = useMemo(() => {
    return calculateTransform(node, [viewState.x, viewState.y, width / viewState.k], width);
  }, [node, viewState.x, viewState.y, viewState.k, width]);

  // 缓存颜色计算
  const colors = useMemo(() => {
    const modernColors = [
      '#f8fafc', // gray-50
      '#e2e8f0', // gray-200  
      '#cbd5e1', // gray-300
      '#94a3b8', // gray-400
      '#64748b', // gray-500
      '#475569', // gray-600
    ];
    
    const fillColor = node.children ? modernColors[Math.min(node.depth, modernColors.length - 1)] : '#ffffff';
    const strokeColor = isHovered ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)';
    const strokeWidth = isHovered ? 2 : node.children ? 1 : 0;
    
    return { fillColor, strokeColor, strokeWidth };
  }, [node.children, node.depth, isHovered]);

  const handleClick = useMemo(() => (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(node);
  }, [onClick, node]);

  const { x, y, r } = transform;

  // 如果圆圈太小，不渲染
  if (r < 0.5) return null;

  return (
    <circle
      cx={x}
      cy={y}
      r={Math.max(0, r)}
      fill={colors.fillColor}
      stroke={colors.strokeColor}
      strokeWidth={colors.strokeWidth}
      style={{
        cursor: node.children ? 'pointer' : 'default',
        pointerEvents: node.children ? 'auto' : 'none',
        transition: isHovered ? 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        filter: isHovered ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.15))' : 'none'
      }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有真正相关的props变化时才重新渲染
  return (
    prevProps.node === nextProps.node &&
    prevProps.viewState.x === nextProps.viewState.x &&
    prevProps.viewState.y === nextProps.viewState.y &&
    prevProps.viewState.k === nextProps.viewState.k &&
    prevProps.width === nextProps.width &&
    prevProps.isHovered === nextProps.isHovered
  );
});