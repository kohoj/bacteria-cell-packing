import { useState, useEffect, useCallback } from 'react';
import { HierarchyNode, CirclePackingData, ViewState } from '../types';
import { createPackLayout, createColorScale } from '../utils/circle-packing';

export const useCirclePacking = (
  data: HierarchyNode,
  width: number,
  height: number
) => {
  const [packedData, setPackedData] = useState<CirclePackingData | null>(null);
  const [focusNode, setFocusNode] = useState<CirclePackingData | null>(null);
  const [viewState, setViewState] = useState<ViewState>({ x: 0, y: 0, k: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  const colorScale = createColorScale();

  useEffect(() => {
    if (!data) return;

    const pack = createPackLayout(width, height);
    const root = pack(data);
    
    setPackedData(root);
    setFocusNode(root);
    setViewState({ x: root.x, y: root.y, k: width / (root.r * 2) });
  }, [data, width, height]);

  const zoomToNode = useCallback((node: CirclePackingData, duration: number = 750) => {
    if (!node || isAnimating) return;

    setIsAnimating(true);
    setFocusNode(node);

    const targetView = { x: node.x, y: node.y, k: width / (node.r * 2) };
    setViewState(targetView);

    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, [width, isAnimating]);

  const handleNodeClick = useCallback((node: CirclePackingData) => {
    if (focusNode !== node) {
      zoomToNode(node);
    }
  }, [focusNode, zoomToNode]);

  const handleBackgroundClick = useCallback(() => {
    if (packedData && focusNode !== packedData) {
      zoomToNode(packedData);
    }
  }, [packedData, focusNode, zoomToNode]);

  return {
    packedData,
    focusNode,
    viewState,
    colorScale,
    isAnimating,
    handleNodeClick,
    handleBackgroundClick
  };
};