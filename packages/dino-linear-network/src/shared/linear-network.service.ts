import { Injectable, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';
import { pick } from 'lodash';

import {
  BoundField,
  DatumId, idSymbol,
  RawChangeSet, ChangeSet,
  DataProcessor, DataProcessorService
} from '@ngx-dino/core';
import { Node } from './node';


const calculatedNodeFieldMap = {
};


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

function nodeSorter(node1: Node, node2: Node): number {
  return node1.order - node2.order;
}


@Injectable()
export class LinearNetworkService {
  private nodeProcessor: DataProcessor<any, Node>;
  private nodeSubscription: Subscription;
  public sortedNodes = new Subject<Node[]>();


  constructor(private service: DataProcessorService) {  }


  init(
    streamMap: Record<'node', Observable<RawChangeSet>>,
    idMap: Record<'node', BoundField<DatumId>>,
    fieldMap: Record<'weight' | 'order', BoundField<any>>
  ): void {
    this.updateNodes(
      true, true,
      streamMap.node, idMap.node,
      pick(fieldMap, ['weight', 'order'])
    );
  }

  update(
    changes: SimpleChanges,
    streamMap: Record<'node', Observable<RawChangeSet>>,
    idMap: Record<'node', BoundField<DatumId>>,
    fieldMap: Record<'weight' | 'order', BoundField<any>>
  ): void {
    const [streamChanged, fieldChanged] = inputChanged(
      changes, 'Stream', 'Field'
    );

    this.updateNodes(
      streamChanged, fieldChanged,
      streamMap.node, idMap.node,
      pick(fieldMap, ['weight', 'order'])
    );
  }

  private updateNodes(
    streamChanged: boolean,
    fieldChanged: boolean,
    stream: Observable<RawChangeSet>,
    idField: BoundField<DatumId>,
    fieldMap: Record<'weight' | 'order', BoundField<any>>
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

  private processNodes(changes: ChangeSet<Node>): void {
    const sortedNodes = this.nodeProcessor.processedCache.cache.items
      .valueSeq().sort(nodeSorter).toArray() as Node[];
    this.sortedNodes.next(sortedNodes);
  }
}