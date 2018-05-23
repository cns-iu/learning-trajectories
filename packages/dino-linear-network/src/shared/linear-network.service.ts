import { Injectable, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';
import { pickBy, mapKeys } from 'lodash';

import {
  BoundField,
  DatumId, idSymbol,
  RawChangeSet, ChangeSet,
  DataProcessor, DataProcessorService
} from '@ngx-dino/core';
import { Node } from './node';
import { Edge } from './edge';


export type StreamSelectors = 'node' | 'edge';
export type IdSelectors = 'node' | 'edge';
export type FieldSelectors =
  'nodeOrder' | 'nodeWeight' | 'nodeColor' | 'nodeTooltip' |
  'edgeOrder' | 'edgeWeight' | 'edgeSource' | 'edgeTarget' | 'edgeTooltip';

const calculatedNodeFieldMap = {};
const calculatedEdgeFieldMap = {};


function inputChanged(
  changes: SimpleChanges, ...suffixes: string[]
): boolean[] {
  const result = suffixes.map(() => false);
  if (suffixes.length !== 0) {
    // tslint:disable:forin
    for (const name in changes) {
      suffixes.forEach((suffix, index) => {
        if (!result[index] && name.endsWith(suffix)) {
          result[index] = true;
        }
      });
    }
  }

  return result;
}

function extractFields<K1 extends string, K2 extends string = ''>(
  fields: Record<K2, BoundField<any>>, prefix: string
): Record<K1, BoundField<any>> {
  const prefixLength = prefix.length;
  const pickedFields = pickBy(fields, (_, key) => key.startsWith(prefix));
  return mapKeys(pickedFields, (_, key) => {
    const nonPrefixed = key.slice(prefixLength);
    const first = nonPrefixed[0].toLowerCase();
    return first + nonPrefixed.slice(1);
  }) as any;
}

function nodeSorter(node1: Node, node2: Node): number {
  return node1.order - node2.order;
}

function edgeSorter(edge1: Edge, edge2: Edge): number {
  return edge1.order - edge2.order;
}


@Injectable()
export class LinearNetworkService {
  private nodeProcessor: DataProcessor<any, Node>;
  private nodeSubscription: Subscription;
  readonly sortedNodes = new Subject<Node[]>();

  private edgeProcessor: DataProcessor<any, Edge>;
  private edgeSubscription: Subscription;
  readonly sortedEdges = new Subject<Edge[]>();


  constructor(private service: DataProcessorService) {  }


  init(
    streamMap: Record<StreamSelectors, Observable<RawChangeSet>>,
    idMap: Record<IdSelectors, BoundField<DatumId>>,
    fieldMap: Record<FieldSelectors, BoundField<any>>
  ): void {
    this.updateNodes(
      true, true,
      streamMap.node, idMap.node,
      extractFields(fieldMap, 'node')
    );

    this.updateEdges(
      true, true,
      streamMap.edge, idMap.edge,
      extractFields(fieldMap, 'edge')
    );
  }

  update(
    changes: SimpleChanges,
    streamMap: Record<StreamSelectors, Observable<RawChangeSet>>,
    idMap: Record<IdSelectors, BoundField<DatumId>>,
    fieldMap: Record<FieldSelectors, BoundField<any>>
  ): void {
    const [streamChanged, fieldChanged] = inputChanged(
      changes, 'Stream', 'Field'
    );

    this.updateNodes(
      streamChanged, fieldChanged,
      streamMap.node, idMap.node,
      extractFields(fieldMap, 'node')
    );

    this.updateEdges(
      streamChanged, fieldChanged,
      streamMap.edge, idMap.edge,
      extractFields(fieldMap, 'edge')
    );
  }

  private updateNodes(
    streamChanged: boolean,
    fieldChanged: boolean,
    stream: Observable<RawChangeSet>,
    idField: BoundField<DatumId>,
    fieldMap: Record<any, BoundField<any>>
  ): void {
    if (streamChanged) {
      if (this.nodeSubscription) {
        this.nodeSubscription.unsubscribe();
      }

      this.nodeProcessor = this.service.createProcessor(
        stream, idField, fieldMap, calculatedNodeFieldMap
      );
      this.nodeSubscription = this.nodeProcessor.asObservable()
        .subscribe(this.processNodes.bind(this));
    } else if (fieldChanged) {
      this.nodeProcessor.updateFields(
        Map(fieldMap), Map(calculatedNodeFieldMap)
      );
    }
  }

  private updateEdges(
    streamChanged: boolean,
    fieldChanged: boolean,
    stream: Observable<RawChangeSet>,
    idField: BoundField<DatumId>,
    fieldMap: Record<any, BoundField<any>>
  ): void {
    if (streamChanged) {
      if (this.edgeSubscription) {
        this.edgeSubscription.unsubscribe();
      }

      this.edgeProcessor = this.service.createProcessor(
        stream, idField, fieldMap, calculatedEdgeFieldMap
      );
      this.edgeSubscription = this.edgeProcessor.asObservable()
        .subscribe(this.processEdges.bind(this));
    } else if (fieldChanged) {
      this.edgeProcessor.updateFields(
        Map(fieldMap), Map(calculatedEdgeFieldMap)
      );
    }
  }

  private processNodes(changes: ChangeSet<Node>): void {
    const sortedNodes = this.nodeProcessor.processedCache.cache.items
      .valueSeq().sort(nodeSorter).toArray() as Node[];
    this.sortedNodes.next(sortedNodes);
  }

  private processEdges(changes: ChangeSet<Edge>): void {
    const sortedEdges = this.edgeProcessor.processedCache.cache.items
      .valueSeq().sort(edgeSorter).toArray() as Edge[];
    this.sortedEdges.next(sortedEdges);
  }
}
