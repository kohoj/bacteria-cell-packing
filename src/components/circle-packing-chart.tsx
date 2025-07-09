import React, { useState, useEffect, useRef } from 'react';
import { CirclePackingData, HierarchyNode } from '../types';
import { useCirclePacking } from '../hooks/use-circle-packing';
import { CircleNode } from './circle-node';
import { CircleLabel } from './circle-label';

interface CirclePackingChartProps {
  data: HierarchyNode;
  className?: string;
}

export const CirclePackingChart: React.FC<CirclePackingChartProps> = ({
  data,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredNode, setHoveredNode] = useState<CirclePackingData | null>(null);
  
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

  if (!packedData) return null;

  const allNodes = packedData.descendants().slice(1);

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
          {allNodes.map((node: CirclePackingData, index: number) => (
            <CircleNode
              key={`${node.data.name}-${index}`}
              node={node}
              viewState={viewState}
              width={dimensions.width}
              colorScale={colorScale}
              isHovered={hoveredNode === node}
              onClick={handleNodeClick}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}
        </g>
        <g>
          {packedData.descendants().map((node: CirclePackingData, index: number) => (
            <CircleLabel
              key={`label-${node.data.name}-${index}`}
              node={node}
              viewState={viewState}
              width={dimensions.width}
              focusNode={focusNode}
            />
          ))}
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
};