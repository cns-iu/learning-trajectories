import { DatumId, Datum } from '@ngx-dino/core';
import { LayoutNode } from './node';


export interface EdgeData {
  order: number;
  weight: number;
  source: DatumId;
  target: DatumId;

  sourceModuleName: string;
  targetModuleName: string;
}

export interface EdgeLayoutData {
  sourceNode: LayoutNode;
  targetNode: LayoutNode;

  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  xRadius: number;
  yRadius: number;
  sweepFlag: 0 | 1;

  path: string;
}

export type Edge = Datum<any> & EdgeData;
export type LayoutEdge = Datum<Edge> & EdgeData & EdgeLayoutData;
