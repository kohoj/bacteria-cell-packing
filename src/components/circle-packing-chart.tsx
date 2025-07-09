import React, { useState } from 'react';
import { CirclePackingData, HierarchyNode } from '../types';
import { useCirclePacking } from '../hooks/use-circle-packing';
import { CircleNode } from './circle-node';
import { CircleLabel } from './circle-label';

interface CirclePackingChartProps {
  data: HierarchyNode;
  width?: number;
  height?: number;
  className?: string;
}

export const CirclePackingChart: React.FC<CirclePackingChartProps> = ({
  data,
  width = 928,
  height = 928,
  className = ''
}) => {
  const [hoveredNode, setHoveredNode] = useState<CirclePackingData | null>(null);
  
  const {
    packedData,
    focusNode,
    viewState,
    colorScale,
    handleNodeClick,
    handleBackgroundClick
  } = useCirclePacking(data, width, height);

  if (!packedData) return null;

  const allNodes = packedData.descendants().slice(1);

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          display: 'block',
          background: colorScale(0),
          cursor: 'pointer'
        }}
        onClick={handleBackgroundClick}
      >
        <g>
          {allNodes.map((node, index) => (
            <CircleNode
              key={`${node.data.name}-${index}`}
              node={node}
              viewState={viewState}
              width={width}
              colorScale={colorScale}
              isHovered={hoveredNode === node}
              onClick={handleNodeClick}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}
        </g>
        <g>
          {packedData.descendants().map((node, index) => (
            <CircleLabel
              key={`label-${node.data.name}-${index}`}
              node={node}
              viewState={viewState}
              width={width}
              focusNode={focusNode}
            />
          ))}
        </g>
      </svg>
      
      {focusNode && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <h3 className="font-medium text-gray-800">{focusNode.data.name}</h3>
          {focusNode.data.value && (
            <p className="text-sm text-gray-600">Value: {focusNode.data.value}</p>
          )}
        </div>
      )}
    </div>
  );
};