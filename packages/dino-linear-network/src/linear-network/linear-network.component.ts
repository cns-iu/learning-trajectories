import {
  Component, Input, Output, ViewChild, ViewChildren,
  OnInit, OnChanges, DoCheck, AfterViewInit,
  SimpleChanges, ElementRef, QueryList, ViewEncapsulation, EventEmitter
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { throttle } from 'lodash';

import {
  BoundField,
  DatumId, idSymbol,
  RawChangeSet
} from '@ngx-dino/core';
import { LayoutNode } from '../shared/node';
import { LayoutEdge } from '../shared/edge';
import {
  Separation, Size, EdgeHeight, LinearNetworkLayoutService
} from '../shared/linear-network-layout.service';
import { AnimationEvent, EdgeAnimator } from '../shared/animation';


@Component({
  selector: 'dino-linear-network',
  templateUrl: './linear-network.component.html',
  styleUrls: ['./linear-network.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class LinearNetworkComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {
  // Node data input
  @Input() nodeStream: Observable<RawChangeSet>;

  @Input() nodeIdField: BoundField<DatumId>;
  @Input() nodeOrderField: BoundField<number>;
  @Input() nodeWeightField: BoundField<number>;
  @Input() nodeColorField: BoundField<string>;
  @Input() nodeTooltipField: BoundField<string>;


  // Edge data input
  @Input() edgeStream: Observable<RawChangeSet>;

  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeOrderField: BoundField<number>;
  @Input() edgeWeightField: BoundField<number>;
  @Input() edgeSourceField: BoundField<DatumId>;
  @Input() edgeTargetField: BoundField<DatumId>;
  @Input() edgeColorField: BoundField<string>;
  @Input() edgeTooltipField: BoundField<string>;


  // Layout configuration
  @Input() overflow = false;
  @Input() separation: Separation;
  @Input() size: Size;
  @Input() edgeHeight: EdgeHeight = '85%';

  @Output() nodeSizeFactorChange = new EventEmitter();

  // Elements
  @ViewChild('container') svg: ElementRef;
  @ViewChildren('edges') edgeElements: QueryList<ElementRef>;
  width = 0;
  height = 0;

  nodeSizeFactor = 1;

  // Data
  nodes: LayoutNode[];
  edges: LayoutEdge[];


  // Animation
  @Input() animDuration = 5; // In seconds
  @Output() animEvents = new Subject<AnimationEvent>();
  private animEdgeState: EdgeAnimator;


  constructor(private service: LinearNetworkLayoutService) {
    service.nodes.subscribe((nodes) => {
      return (this.nodes = nodes);
    });
    service.edges.subscribe((edges) => {
      this.edges = edges;
      this.stopEdgeAnimation();
    });
    service.width.subscribe((width) => (this.width = width));
  }

  ngOnInit(): void {
    this.service.initFields(
      this.getStreamMap(),
      this.getIdMap(),
      this.getFieldMap()
    );
  }

  ngAfterViewInit(): void {
    this.animEdgeState = new EdgeAnimator(this.edgeElements);
    this.animEdgeState.duration = this.animDuration;
    this.animEdgeState.events.subscribe((event) => this.animEvents.next(event));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.updateFields(
      changes,
      this.getStreamMap(),
      this.getIdMap(),
      this.getFieldMap()
    );

    if ('animDuration' in changes && this.animEdgeState) {
      this.animEdgeState.duration = this.animDuration;
    }
  }

  ngDoCheck(): void {
    let update = false;

    // Detect svg size change
    const {svg: { nativeElement: {
      width: {animVal: {value: width = 0} = {}} = {},
      height: {animVal: {value: height = 0} = {}} = {}
    } = {}} = {}} = this;

    if (this.width !== width) {
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

    if (this.nodeSizeFactor !== this.service.nodeSizeFactor) {
      this.nodeSizeFactor = this.service.nodeSizeFactor;
      this.nodeSizeFactorChange.emit(this.service.nodeSizeFactor);
    }
  }


  trackByNode(index: number, node: LayoutNode): DatumId {
    return node[idSymbol];
  }

  trackByEdge(index: number, edge: LayoutEdge): DatumId {
    return edge[idSymbol];
  }


  edgeTooltipPosition(edge: LayoutEdge): string {
    return edge.fromX <= edge.toX ? 'above' : 'below';
  }


  // Animations
  startEdgeAnimation(): void {
    if (this.animEdgeState) {
      this.animEdgeState.start();
    }
  }

  pauseEdgeAnimation(): void {
    if (this.animEdgeState) {
      this.animEdgeState.pause();
    }
  }

  stopEdgeAnimation(): void {
    if (this.animEdgeState) {
      this.animEdgeState.stop();
    }
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
      nodeColor: this.nodeColorField,
      nodeTooltip: this.nodeTooltipField,

      edgeOrder: this.edgeOrderField,
      edgeWeight: this.edgeWeightField,
      edgeSource: this.edgeSourceField,
      edgeTarget: this.edgeTargetField,
      edgeColor: this.edgeColorField,
      edgeTooltip: this.edgeTooltipField
    };
  }

  // tslint:disable:member-ordering
  private updateLayout = throttle(function (
    this: LinearNetworkComponent, width: number, height
  ): void {
    this.service.updateLayout(
      width, height, this.overflow, this.separation, this.size,
      this.edgeHeight
    );
  }, 100);
}
