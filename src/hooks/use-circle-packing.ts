import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // 使用 useRef 来存储动画相关的状态
  const animationRef = useRef<{
    startTime: number;
    startView: ViewState;
    targetView: ViewState;
    duration: number;
    animationId?: number;
  } | null>(null);

  const colorScale = createColorScale();

  useEffect(() => {
    if (!data) return;

    const pack = createPackLayout(width, height);
    const root = pack(data);
    
    setPackedData(root);
    setFocusNode(root);
    
    // 设置初始视图状态，确保显示完整的图表
    const initialViewState = { 
      x: root.x, 
      y: root.y, 
      k: Math.min(width, height) / (root.r * 2.2) // 稍微缩小一些以留出边距
    };
    setViewState(initialViewState);
  }, [data, width, height]);

  // 平滑动画函数
  const animateToView = useCallback((targetView: ViewState, duration: number = 750) => {
    if (isAnimating) {
      // 如果正在动画，取消当前动画
      if (animationRef.current?.animationId) {
        cancelAnimationFrame(animationRef.current.animationId);
      }
    }

    setIsAnimating(true);
    
    const startTime = performance.now();
    const startView = { ...viewState };
    
    animationRef.current = {
      startTime,
      startView,
      targetView,
      duration
    };

    const animate = (currentTime: number) => {
      if (!animationRef.current) return;
      
      const elapsed = currentTime - animationRef.current.startTime;
      const progress = Math.min(elapsed / animationRef.current.duration, 1);
      
      // 使用 easeInOutCubic 缓动函数
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const easedProgress = easeInOutCubic(progress);
      
      // 插值计算当前视图状态
      const currentView: ViewState = {
        x: animationRef.current.startView.x + (animationRef.current.targetView.x - animationRef.current.startView.x) * easedProgress,
        y: animationRef.current.startView.y + (animationRef.current.targetView.y - animationRef.current.startView.y) * easedProgress,
        k: animationRef.current.startView.k + (animationRef.current.targetView.k - animationRef.current.startView.k) * easedProgress
      };
      
      setViewState(currentView);
      
      if (progress < 1) {
        animationRef.current.animationId = requestAnimationFrame(animate);
      } else {
        // 动画完成
        setViewState(animationRef.current.targetView);
        setIsAnimating(false);
        animationRef.current = null;
      }
    };
    
    animationRef.current.animationId = requestAnimationFrame(animate);
  }, [viewState, isAnimating]);

  const zoomToNode = useCallback((node: CirclePackingData, duration: number = 750) => {
    if (!node) return;

    setFocusNode(node);
    
    // 计算目标视图状态，确保节点完全可见且居中
    const padding = 1.2; // 增加一些padding
    const targetView = { 
      x: node.x, 
      y: node.y, 
      k: Math.min(width, height) / (node.r * 2 * padding)
    };
    
    animateToView(targetView, duration);
  }, [width, height, animateToView]);

  const handleNodeClick = useCallback((node: CirclePackingData) => {
    if (focusNode !== node && !isAnimating) {
      zoomToNode(node);
    }
  }, [focusNode, zoomToNode, isAnimating]);

  const handleBackgroundClick = useCallback(() => {
    if (packedData && focusNode !== packedData && !isAnimating) {
      zoomToNode(packedData);
    }
  }, [packedData, focusNode, zoomToNode, isAnimating]);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current?.animationId) {
        cancelAnimationFrame(animationRef.current.animationId);
      }
    };
  }, []);

  return {
    packedData,
    focusNode,
    viewState,
    colorScale,
    isAnimating,
    handleNodeClick,
    handleBackgroundClick,
    zoomToNode
  };
};