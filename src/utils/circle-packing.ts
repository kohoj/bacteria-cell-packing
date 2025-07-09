import * as d3 from 'd3';
import { HierarchyNode, CirclePackingData } from '../types';

export const createColorScale = (domain: [number, number] = [0, 5]) => {
  return d3.scaleLinear<string>()
    .domain(domain)
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);
};

// 预处理数据，让所有叶子节点具有相同的值
export const normalizeLeafNodes = (node: HierarchyNode): HierarchyNode => {
  const UNIFORM_LEAF_VALUE = 100; // 统一的叶子节点值

  const processNode = (n: HierarchyNode): HierarchyNode => {
    if (!n.children || n.children.length === 0) {
      // 叶子节点：设置统一值
      return {
        ...n,
        value: UNIFORM_LEAF_VALUE
      };
    } else {
      // 中间节点：递归处理子节点，并根据子节点数量设置值
      const processedChildren = n.children.map(child => processNode(child));
      return {
        ...n,
        children: processedChildren,
        value: undefined // 让d3根据子节点自动计算
      };
    }
  };

  return processNode(node);
};

export const createPackLayout = (width: number, height: number, padding: number = 3) => {
  return (data: HierarchyNode): CirclePackingData => {
    const pack = d3.pack<HierarchyNode>()
      .size([width, height])
      .padding(padding);

    // 预处理数据以确保叶子节点尺寸一致
    const normalizedData = normalizeLeafNodes(data);

    const root = d3.hierarchy(normalizedData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    return pack(root);
  };
};

export const interpolateZoom = (
  view: [number, number, number],
  target: [number, number, number]
) => {
  return d3.interpolateZoom(view, target);
};

// 优化的transform计算函数，添加了性能优化
export const calculateTransform = (
  node: CirclePackingData,
  view: [number, number, number],
  width: number
) => {
  const [viewX, viewY, viewScale] = view;
  
  // 快速计算缩放比例
  const k = width / viewScale;
  
  // 计算相对位置
  const dx = node.x - viewX;
  const dy = node.y - viewY;
  
  // 应用缩放变换
  const x = dx * k;
  const y = dy * k;
  const r = node.r * k;
  
  return { x, y, r, k };
};

// 新增：快速检查节点是否在视口内
export const isNodeInViewport = (
  node: CirclePackingData,
  viewState: { x: number; y: number; k: number },
  width: number,
  height: number,
  margin: number = 100
): boolean => {
  const transform = calculateTransform(node, [viewState.x, viewState.y, width / viewState.k], width);
  
  return (
    transform.x + transform.r > -margin &&
    transform.x - transform.r < width + margin &&
    transform.y + transform.r > -margin &&
    transform.y - transform.r < height + margin &&
    transform.r > 0.5
  );
};

// 新增：批量计算可见节点，提高性能
export const getVisibleNodes = (
  nodes: CirclePackingData[],
  viewState: { x: number; y: number; k: number },
  width: number,
  height: number,
  margin: number = 100
): CirclePackingData[] => {
  return nodes.filter(node => isNodeInViewport(node, viewState, width, height, margin));
};