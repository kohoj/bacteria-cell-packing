import * as d3 from 'd3';

export interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

export type CirclePackingData = d3.HierarchyCircularNode<HierarchyNode>;

export interface ViewState {
  x: number;
  y: number;
  k: number;
}