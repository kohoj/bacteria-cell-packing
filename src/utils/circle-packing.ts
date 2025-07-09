import * as d3 from 'd3';
import { HierarchyNode, CirclePackingData } from '../types';

export const createColorScale = (domain: [number, number] = [0, 5]) => {
  return d3.scaleLinear<string>()
    .domain(domain)
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);
};

export const createPackLayout = (width: number, height: number, padding: number = 3) => {
  return (data: HierarchyNode): CirclePackingData => {
    const pack = d3.pack<HierarchyNode>()
      .size([width, height])
      .padding(padding);

    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    return pack(root) as CirclePackingData;
  };
};

export const interpolateZoom = (
  view: [number, number, number],
  target: [number, number, number]
) => {
  return d3.interpolateZoom(view, target);
};

export const calculateTransform = (
  node: CirclePackingData,
  view: [number, number, number],
  width: number
) => {
  const k = width / view[2];
  const x = (node.x - view[0]) * k;
  const y = (node.y - view[1]) * k;
  const r = node.r * k;
  
  return { x, y, r, k };
};