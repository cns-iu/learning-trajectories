import {
  Component, Input, ViewChild,
  OnInit, OnChanges, DoCheck,
  SimpleChanges, ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { throttle } from 'lodash';

import {
  BoundField,
  DatumId, idSymbol,
  RawChangeSet
} from '@ngx-dino/core';
import { Node, LayoutNode } from '../shared/node';
import {
  Separation, Size, LinearNetworkLayoutService
} from '../shared/linear-network-layout.service';


// For testing
// TODO Remove later
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {simpleField} from '@ngx-dino/core';
import {access} from '@ngx-dino/core/src/v2/operators/methods/extracting/access';

@Component({
  selector: 'dino-linear-network',
  templateUrl: './linear-network.component.html',
  styleUrls: ['./linear-network.component.sass'],
})
export class LinearNetworkComponent implements OnInit, OnChanges, DoCheck {
  // Data input
  // TODO Remove testing stuff (temp data and fields) later
  @Input() nodeStream: Observable<RawChangeSet> = Observable.of(RawChangeSet.fromArray(Array(40).fill(0).map((_, index) => {
      return {id: index, order: index, weight: 1};
  })));

  @Input() idField: BoundField<DatumId> = simpleField<DatumId>({label: '', operator: access('id')}).getBoundField();
  @Input() weightField: BoundField<number> = simpleField<number>({label: '', operator: access('weight')}).getBoundField();
  @Input() orderField: BoundField<number> = simpleField<number>({label: '', operator: access('order')}).getBoundField();

  // Layout configuration
  @Input() overflow: boolean;
  @Input() separation: Separation;
  @Input() size: Size;


  // Elements
  @ViewChild('container') svg: ElementRef;
  width = 0;
  height = 0;


  // Data
  nodes: LayoutNode[];


  constructor(private service: LinearNetworkLayoutService) {
    service.nodes.subscribe((nodes) => (this.nodes = nodes));
    service.width.subscribe((width) => (this.width = width));
  }

  ngOnInit(): void {
    this.service.initFields(
      this.getStreamMap(),
      this.getIdMap(),
      this.getFieldMap()
    );
    console.log(this); // TODO Remove me later
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.updateFields(
      changes,
      this.getStreamMap(),
      this.getIdMap(),
      this.getFieldMap()
    );
  }

  ngDoCheck(): void {
    let update = false;

    // Detect svg size change
    const {svg: { nativeElement: {
      width: {animVal: {value: width = 0} = {}} = {},
      height: {animVal: {value: height = 0} = {}} = {}
    } = {}} = {}} = this;

    if (!this.overflow && this.width !== width) {
      update = true;
      this.width = width;
    }
    if (this.height !== height) {
      update = true;
      this.height = height;
    }

    // Update layout
    if (update) {
      this.updateLayout(width);
    }
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

  // tslint:disable:member-ordering
  private updateLayout = throttle(function (
    this: LinearNetworkComponent, width: number
  ): void {
    this.service.updateLayout(this.overflow, width, this.separation, this.size);
  }, 100);
}
