import { Datum } from '@ngx-dino/core';


export interface NodeData {
  weight: number;
  order: number;
  // TODO
}

export interface NodeLayoutData {
  x: number;
  radius: number;
}

export type Node = Datum<any> & NodeData;
export type LayoutNode = Datum<Node> & NodeData & NodeLayoutData;
