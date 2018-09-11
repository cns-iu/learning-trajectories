import {
  Component, EventEmitter, Input, Output, ViewChild,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { assign, mapValues, pick } from 'lodash';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import { LinearNetworkComponent } from '@ngx-dino/linear-network';

import { PersonMetaData } from 'learning-trajectories-database';

import { VisualizationDataService } from '../shared/visualization-data.service';
import * as fields from '../shared/linear-network-fields';


@Component({
  selector: 'app-visualization-wrapper',
  templateUrl: './visualization-wrapper.component.html',
  styleUrls: ['./visualization-wrapper.component.sass']
})
export class VisualizationWrapperComponent implements OnInit, OnChanges {
  @Input() selectedControl: Observable<string>;
  @Input() personSelected: string;
  @Input() overflow = false; // visualization page overflow toggle
  @Input() includeUnused = false; // Show nodes with no edges

  @Output() animationEvents = new Subject<string>();
  @Output() nodeSizeFactorChange = new EventEmitter<number>();

  @ViewChild(LinearNetworkComponent) vis: LinearNetworkComponent;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;

  personMetaData: PersonMetaData;

  fields: {[key: string]: BoundField<any>};

  animationDuration = 5;

  constructor(private service: VisualizationDataService) {
    this.nodeStream = service.getNodes();
    this.edgeStream = service.getEdges();

    this.personMetaData = service.getPersonMetaData();

    const combinedFields = assign({}, fields, pick(service, [
      'nodeWeightField', 'edgeWeightField', 'edgeColorField'
    ]));
    this.fields = mapValues(combinedFields, (f) => f.getBoundField());

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedControl' in changes) {
      this.selectedControl.subscribe((event) => {
        switch (event) {
          case 'play':
            this.vis.startEdgeAnimation();
            break;

          case 'pause':
            this.vis.pauseEdgeAnimation();
            break;

          case 'stop':
            this.vis.stopEdgeAnimation();
            break;

          case 'forward':
          case 'backward':
            this.vis.stepEdgeAnimation(event);
            break;
        }
      });
    }

    if ('personSelected' in changes || 'includeUnused' in changes) {
      const filter = {
        personName: this.personSelected,
        includeUnused: this.includeUnused
      };

      this.nodeStream = this.service.getNodes(filter);
      this.edgeStream = this.service.getEdges(filter);
      this.personMetaData = this.service.getPersonMetaData(filter);
    }
  }

  onNodeSizeFactorChange(factor: number) {
    this.nodeSizeFactorChange.emit(factor);
  }
}
