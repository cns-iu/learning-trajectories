import { Datum } from '@ngx-dino/core';


export interface NodeData {
  weight: number;
  order: number;
  // TODO
}

export type Node = Datum<any> & NodeData;
