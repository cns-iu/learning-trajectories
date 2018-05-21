import { Injectable, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { isFunction, assign } from 'lodash';

import {
  BoundField,
  DatumId, Datum, idSymbol, rawDataSymbol,
  RawChangeSet
} from '@ngx-dino/core';
import { Node, LayoutNode } from './node';
import { LinearNetworkService } from './linear-network.service';


export type SeparationFn = (node1: Node, node2: Node) => number;
export type Separation = number | SeparationFn;
export type SizeFn = (weight: number, node: Node) => number;
export type Size = number | SizeFn;


function defaultSeparation(): number {
  return 10; // FIXME
}

function defaultSize(weight: number): number {
  return weight * 40 * 40; // FIXME
}

function wrapSeparationValue(value: number): SeparationFn {
  return () => value;
}

function wrapSizeValue(value: number): SizeFn {
  return () => value;
}


@Injectable()
export class LinearNetworkLayoutService {
  private overflow = false;
  private maxWidth = 0;
  private separation: SeparationFn = defaultSeparation;
  private size: SizeFn = defaultSize;

  private currentNodes: Node[] = [];
  readonly nodes = new Subject<LayoutNode[]>();
  readonly width = new Subject<number>();

  constructor(private service: LinearNetworkService) {
    this.service.sortedNodes.subscribe((nodes) => {
      const {nodes: lnodes, width} = this.calculateLayout(nodes);

      this.currentNodes = nodes;
      this.nodes.next(lnodes);
      this.width.next(width);
    });
  }

  initFields(
    streamMap: Record<'node', Observable<RawChangeSet>>,
    idMap: Record<'node', BoundField<DatumId>>,
    fieldMap: Record<'weight' | 'order', BoundField<any>>
  ): void {
    this.service.init(streamMap, idMap, fieldMap);
  }

  updateFields(
    changes: SimpleChanges,
    streamMap: Record<'node', Observable<RawChangeSet>>,
    idMap: Record<'node', BoundField<DatumId>>,
    fieldMap: Record<'weight' | 'order', BoundField<any>>
  ): void {
    this.service.update(changes, streamMap, idMap, fieldMap);
  }

  updateLayout(
    overflow: boolean = false,
    maxWidth: number = 0,
    separation: Separation = defaultSeparation,
    size: Size = defaultSize
  ): void {
    this.overflow = overflow;
    this.maxWidth = maxWidth;
    this.separation = isFunction(separation) ?
      separation : wrapSeparationValue(separation);
    this.size = isFunction(size) ? size : wrapSizeValue(size);

    const {nodes, width} = this.calculateLayout(this.currentNodes);
    this.nodes.next(nodes);
    this.width.next(width);
  }


  private calculateLayout(nodes: Node[]): {nodes: LayoutNode[], width: number} {
    const lnodes = nodes.map((node) => {
      const {[idSymbol]: id} = node;
      const lnode = new Datum(id, node) as LayoutNode;
      assign(lnode, node);
      return lnode;
    });

    // Calculate size
    lnodes.forEach((lnode) => {
      const {weight, [rawDataSymbol]: node} = lnode;
      const size = this.size(weight, node);
      lnode.radius = Math.sqrt(size) / 2;
    });

    // Calculate position
    lnodes.forEach((lnode, index, array) => {
      if (index === 0) {
        lnode.x = lnode.radius;
      } else {
        const prev = array[index - 1];
        const offset = prev.x + prev.radius;
        const separation = this.separation(prev, lnode);

        lnode.x = offset + separation + lnode.radius;
      }
    });

    // Calculate width
    const lastNode = lnodes[lnodes.length - 1] || {x: 0, radius: 0};
    const width = lastNode.x + lastNode.radius;

    // Scale if not overflow
    if (!this.overflow && this.maxWidth > 0 && width > this.maxWidth) {
      const factor = this.maxWidth / width;
      lnodes.forEach((lnode) => {
        lnode.x *= factor;
        lnode.radius *= factor;
      });
    }

    return {nodes: lnodes, width: this.overflow ? width : this.maxWidth};
  }
}
