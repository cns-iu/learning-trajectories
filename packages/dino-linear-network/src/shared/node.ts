import { Datum } from '@ngx-dino/core';


export interface NodeData {
  order: number;
  weight: number;

  label: string;
  color: string;
  moduleName: string;
  timeSpent: string;
}

export interface NodeLayoutData {
  x: number;
  radius: number;
}

export type Node = Datum<any> & NodeData;
export type LayoutNode = Datum<Node> & NodeData & NodeLayoutData;
