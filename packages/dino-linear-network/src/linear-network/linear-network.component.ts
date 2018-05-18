import {
  Component, Input,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  BoundField,
  DatumId, idSymbol,
  RawChangeSet
} from '@ngx-dino/core';
import { Node } from '../shared/node';
import { LinearNetworkService } from '../shared/linear-network.service';


@Component({
  selector: 'dino-linear-network',
  templateUrl: './linear-network.component.html',
  styleUrls: ['./linear-network.component.sass'],
})
export class LinearNetworkComponent implements OnInit, OnChanges {
  @Input() nodeStream: Observable<RawChangeSet>;

  @Input() idField: BoundField<DatumId>;
  @Input() weightField: BoundField<number>;
  @Input() orderField: BoundField<number>;

  sortedNodes: Node[] = [{[idSymbol]: 1}, {[idSymbol]: 2}] as any;
  cumNodeWeights: number[];


  constructor(private service: LinearNetworkService) {
    service.sortedNodes.subscribe(this.processNodes.bind(this));
  }

  ngOnInit(): void {
    // FIXME Uncomment when inputs are available
    // this.service.init(
    //   this.getStreamMap(),
    //   this.getIdMap(),
    //   this.getFieldMap()
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.update(
      changes,
      this.getStreamMap(),
      this.getIdMap(),
      this.getFieldMap()
    );
  }


  trackByNodes(index: number, node: Node): DatumId {
    return node[idSymbol];
  }


  private getStreamMap() /* : Record<...> */ {
    return {
      node: this.nodeStream
    };
  }

  private getIdMap() /* : Record<...> */ {
    return {
      node: this.idField
    };
  }

  private getFieldMap() /* : Record<...> */ {
    return {
      weight: this.weightField,
      order: this.orderField
    };
  }


  private processNodes(sortedNodes: Node[]): void {
    this.sortedNodes = sortedNodes;
    this.cumNodeWeights = [];

    sortedNodes.reduce((cumWeight, node) => {
      this.cumNodeWeights.push(cumWeight);
      return cumWeight + node.weight;
    }, 0);
  }
}
