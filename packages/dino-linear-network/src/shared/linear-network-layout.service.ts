import { Injectable, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/combineLatest';

import { Map } from 'immutable';
import { isFunction, assign } from 'lodash';

import {
  BoundField,
  DatumId, Datum, idSymbol, rawDataSymbol,
  RawChangeSet
} from '@ngx-dino/core';
import { Node, LayoutNode } from './node';
import { Edge, LayoutEdge } from './edge';
import {
  StreamSelectors, IdSelectors, FieldSelectors,
  LinearNetworkService
} from './linear-network.service';


export type SeparationFn = (node1: Node, node2: Node) => number;
export type Separation = number | SeparationFn;
export type SizeFn = (weight: number, node: Node) => number;
export type Size = number | SizeFn;


function defaultSeparation(): number {
  return 10;
}

function defaultSize(weight: number): number {
  return weight * 40 * 40;
}

function wrapSeparationValue(value: number): SeparationFn {
  return () => value;
}

function wrapSizeValue(value: number): SizeFn {
  return () => value;
}


@Injectable()
export class LinearNetworkLayoutService {
  private maxWidth = 0;
  private maxHeight = 0;
  private overflow = false;
  private separation: SeparationFn = defaultSeparation;
  private size: SizeFn = defaultSize;

  private currentNodes: Node[] = [];
  private currentEdges: Edge[] = [];
  readonly nodes = new Subject<LayoutNode[]>();
  readonly edges = new Subject<LayoutEdge[]>();
  readonly width = new Subject<number>();

  constructor(private service: LinearNetworkService) {
    this.service.sortedNodes.subscribe((nodes) => {
      const {nodes: lnodes, width} = this.calculateNodeLayout(nodes);

      this.currentNodes = nodes;
      this.nodes.next(lnodes);
      this.width.next(width);
    });
    this.service.sortedEdges.combineLatest(this.nodes).subscribe(([edges, nodes]) => {
      const {edges: ledges} = this.calculateEdgeLayout(nodes, edges);

      this.currentEdges = edges;
      this.edges.next(ledges);
    });
  }

  initFields(
    streamMap: Record<StreamSelectors, Observable<RawChangeSet>>,
    idMap: Record<IdSelectors, BoundField<DatumId>>,
    fieldMap: Record<FieldSelectors, BoundField<any>>
  ): void {
    this.service.init(streamMap, idMap, fieldMap);
  }

  updateFields(
    changes: SimpleChanges,
    streamMap: Record<StreamSelectors, Observable<RawChangeSet>>,
    idMap: Record<IdSelectors, BoundField<DatumId>>,
    fieldMap: Record<FieldSelectors, BoundField<any>>
  ): void {
    this.service.update(changes, streamMap, idMap, fieldMap);
  }

  updateLayout(
    maxWidth: number,
    maxHeight: number,
    overflow: boolean = false,
    separation: Separation = defaultSeparation,
    size: Size = defaultSize
  ): void {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.overflow = overflow;
    this.separation = isFunction(separation) ?
      separation : wrapSeparationValue(separation);
    this.size = isFunction(size) ? size : wrapSizeValue(size);

    const {nodes, width} = this.calculateNodeLayout(this.currentNodes);
    const {edges} = this.calculateEdgeLayout(nodes, this.currentEdges);
    this.nodes.next(nodes);
    this.edges.next(edges);
    this.width.next(width);
  }


  private calculateNodeLayout(
    nodes: Node[]
  ): {nodes: LayoutNode[], width: number} {
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

  private calculateEdgeLayout(
    nodes: LayoutNode[], edges: Edge[]
  ): {edges: LayoutEdge[]} {
    const nodeMap = Map<DatumId, LayoutNode>(nodes.map((node) => {
      return [node[idSymbol], node];
    }));

    const ledges = edges.map((edge) => {
      const {[idSymbol]: id} = edge;
      const ledge = new Datum(id, edge) as LayoutEdge;
      assign(ledge, edge);
      return ledge;
    });

    ledges.forEach((ledge) => {
      ledge.sourceNode = nodeMap.get(ledge.source);
      ledge.targetNode = nodeMap.get(ledge.target);
    });

    // Calculate path
    // FIXME handle paths going from target to source
    ledges.forEach((ledge) => {
      const diff = ledge.targetNode.x - ledge.sourceNode.x;
      const radius = diff / 2;
      const moveCmd = `M${ledge.sourceNode.x} ${this.maxHeight / 2}`;
      const arcCmd = `A${radius} ${radius} 0 0 1 ${ledge.targetNode.x} ${this.maxHeight / 2}`;

      ledge.path = moveCmd + arcCmd;
    });

    return {edges: ledges};
  }
}
