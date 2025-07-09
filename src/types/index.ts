export interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

export interface CirclePackingData {
  x: number;
  y: number;
  r: number;
  depth: number;
  data: HierarchyNode;
  parent?: CirclePackingData;
  children?: CirclePackingData[];
}

export interface ViewState {
  x: number;
  y: number;
  k: number;
}