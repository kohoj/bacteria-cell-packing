import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CirclePackingData, HierarchyNode } from '../types';
import { useCirclePacking } from '../hooks/use-circle-packing';
import { CircleNode } from './circle-node';
import { CircleLabel } from './circle-label';
import { getVisibleNodes } from '../utils/circle-packing';

interface CirclePackingChartProps {
  data: HierarchyNode;
  className?: string;
}

export const CirclePackingChart: React.FC<CirclePackingChartProps> = React.memo(({
  data,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const {
    packedData,
    focusNode,
    viewState,
    colorScale,
    handleNodeClick,
    handleBackgroundClick
  } = useCirclePacking(data, dimensions.width, dimensions.height);

  // 缓存所有节点，避免每次渲染时重新计算
  const allNodes = useMemo(() => {
    if (!packedData) return [];
    return packedData.descendants().slice(1);
  }, [packedData]);

  // 使用优化的视口裁剪函数
  const visibleNodes = useMemo(() => {
    if (!allNodes.length) return [];
    return getVisibleNodes(allNodes, viewState, dimensions.width, dimensions.height, 100);
  }, [allNodes, viewState, dimensions.width, dimensions.height]);

  // 生成唯一的节点ID
  const getNodeId = useCallback((node: CirclePackingData, index: number) => {
    return `${node.data.name}-${node.depth}-${index}`;
  }, []);

  // 优化hover回调
  const handleMouseEnter = useCallback((node: CirclePackingData, index: number) => {
    const nodeId = getNodeId(node, index);
    setHoveredNodeId(nodeId);
  }, [getNodeId]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // 找到hovered节点对象
  const hoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    return visibleNodes.find((node, index) => getNodeId(node, index) === hoveredNodeId) || null;
  }, [hoveredNodeId, visibleNodes, getNodeId]);

  if (!packedData) return null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`${-dimensions.width / 2} ${-dimensions.height / 2} ${dimensions.width} ${dimensions.height}`}
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#fafafa',
          cursor: 'pointer'
        }}
        onClick={handleBackgroundClick}
        className="drop-shadow-sm"
      >
        <g>
          {visibleNodes.map((node: CirclePackingData, index: number) => {
            const nodeId = getNodeId(node, index);
            return (
              <CircleNode
                key={nodeId}
                node={node}
                viewState={viewState}
                width={dimensions.width}
                colorScale={colorScale}
                isHovered={hoveredNodeId === nodeId}
                onClick={handleNodeClick}
                onMouseEnter={() => handleMouseEnter(node, index)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>
        <g>
          {visibleNodes.map((node: CirclePackingData, index: number) => {
            const nodeId = getNodeId(node, index);
            return (
              <CircleLabel
                key={`label-${nodeId}`}
                node={node}
                viewState={viewState}
                width={dimensions.width}
                focusNode={focusNode}
              />
            );
          })}
        </g>
      </svg>
      
      {hoveredNode && (
        <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/20 animate-slide-up">
          <div className="text-sm font-medium text-gray-800">{hoveredNode.data.name}</div>
          {hoveredNode.data.value && (
            <div className="text-xs text-gray-500 mt-1">{hoveredNode.data.value}</div>
          )}
        </div>
      )}
    </div>
  );
});