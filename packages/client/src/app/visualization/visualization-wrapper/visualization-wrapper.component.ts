import {
  Component, Input, Output, ViewChild,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { assign, mapValues, pick } from 'lodash';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import { LinearNetworkComponent } from '@ngx-dino/linear-network';
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

  @ViewChild(LinearNetworkComponent) vis: LinearNetworkComponent;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;
  courseTitle: string;

  fields: {[key: string]: BoundField<any>};

  overflow = false;
  animationDuration = 5;
  @Output() animationEvents = new Subject<string>();

  constructor(private service: VisualizationDataService) {
    this.nodeStream = service.getNodes();
    this.edgeStream = service.getEdges();
    this.courseTitle = service.getTitle();

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
        }
      });
    }

    if ('personSelected' in changes) {
      const filter = {personName: changes.personSelected.currentValue};
      this.nodeStream = this.service.getNodes(filter);
      this.edgeStream = this.service.getEdges(filter);
      this.courseTitle = this.service.getTitle(filter);
    }
  }
}
