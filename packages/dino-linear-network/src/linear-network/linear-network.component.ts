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
import { LayoutNode } from '../shared/node';
import { LayoutEdge } from '../shared/edge';
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
import {constant} from '@ngx-dino/core/src/v2/operators/methods/generating/constant';

@Component({
  selector: 'dino-linear-network',
  templateUrl: './linear-network.component.html',
  styleUrls: ['./linear-network.component.sass'],
})
export class LinearNetworkComponent implements OnInit, OnChanges, DoCheck {
  // Node data input
  // TODO Remove testing stuff (temp data and fields) later
  @Input() nodeStream: Observable<RawChangeSet> = Observable.of(RawChangeSet.fromArray(Array(40).fill(0).map((_, index) => {
      return {id: index, order: index, weight: 1};
  })));

  @Input() nodeIdField: BoundField<DatumId> = simpleField<DatumId>({label: '', operator: access('id')}).getBoundField();
  @Input() nodeOrderField: BoundField<number> = simpleField<number>({label: '', operator: access('order')}).getBoundField();
  @Input() nodeWeightField: BoundField<number> = simpleField<number>({label: '', operator: access('weight')}).getBoundField();
  @Input() nodeLabelField: BoundField<string> = simpleField({label: '', operator: constant('')}).getBoundField();
  @Input() nodeColorField: BoundField<string> = simpleField({label: '', operator: constant('purple')}).getBoundField();
  @Input() nodeModuleNameField: BoundField<string> = simpleField({label: '', operator: constant('')}).getBoundField();
  @Input() nodeTimeSpentField: BoundField<String> = simpleField({label: '', operator: constant('')}).getBoundField();


  // Edge data input
  // TODO Remove testing stuff (temp data and fields) later
  @Input() edgeStream: Observable<RawChangeSet> = Observable.of(RawChangeSet.fromArray(Array(10).fill(0).map((_, index) => {
    return {id: index, order: index, source: index, target: index + 1};
  })));

  @Input() edgeIdField: BoundField<DatumId> = simpleField<DatumId>({label: '', operator: access('id')}).getBoundField();
  @Input() edgeOrderField: BoundField<number> = simpleField<number>({label: '', operator: access('order')}).getBoundField();
  @Input() edgeSourceField: BoundField<DatumId> = simpleField<DatumId>({label: '', operator: access('source')}).getBoundField();
  @Input() edgeTargetField: BoundField<DatumId> = simpleField<DatumId>({label: '', operator: access('target')}).getBoundField();
  @Input() edgeSourceModuleNameField: BoundField<string> = simpleField({label: '', operator: constant('')}).getBoundField();
  @Input() edgeTargetModuleNameField: BoundField<string> = simpleField({label: '', operator: constant('')}).getBoundField();


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
  edges: LayoutEdge[];


  constructor(private service: LinearNetworkLayoutService) {
    service.nodes.subscribe((nodes) => (this.nodes = nodes));
    service.edges.subscribe((edges) => (this.edges = edges));
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
      this.updateLayout(width, height);
    }
  }


  trackByNodes(index: number, node: LayoutNode): DatumId {
    return node[idSymbol];
  }

  trackByEdge(index: number, edge: LayoutEdge): DatumId {
    return edge[idSymbol];
  }


  private getStreamMap() /* : Record<...> */ {
    return {
      node: this.nodeStream,
      edge: this.edgeStream
    };
  }

  private getIdMap() /* : Record<...> */ {
    return {
      node: this.nodeIdField,
      edge: this.edgeIdField
    };
  }

  private getFieldMap() /* : Record<...> */ {
    return {
      nodeOrder: this.nodeOrderField,
      nodeWeight: this.nodeWeightField,
      nodeLabel: this.nodeLabelField,
      nodeColor: this.nodeColorField,
      nodeModuleName: this.nodeModuleNameField,
      nodeTimeSpent: this.nodeTimeSpentField,

      edgeOrder: this.edgeOrderField,
      edgeSource: this.edgeSourceField,
      edgeTarget: this.edgeTargetField,
      edgeSourceModuleName: this.edgeSourceModuleNameField,
      edgeTargetModuleName: this.edgeTargetModuleNameField
    };
  }

  // tslint:disable:member-ordering
  private updateLayout = throttle(function (
    this: LinearNetworkComponent, width: number, height
  ): void {
    this.service.updateLayout(
      width, height, this.overflow, this.separation, this.size
    );
  }, 100);
}
