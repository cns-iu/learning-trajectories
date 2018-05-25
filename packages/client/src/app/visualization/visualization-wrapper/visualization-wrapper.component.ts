import {
  Component, Input,
  OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { assign, mapValues, pick } from 'lodash';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import { VisualizationDataService } from '../shared/visualization-data.service';
import * as fields from '../shared/linear-network-fields';

@Component({
  selector: 'app-visualization-wrapper',
  templateUrl: './visualization-wrapper.component.html',
  styleUrls: ['./visualization-wrapper.component.sass']
})
export class VisualizationWrapperComponent implements OnInit, OnChanges {
  @Input() selectedControl: string;
  @Input() personSelected: string;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;
  courseTitle: string;

  fields: {[key: string]: BoundField<any>};

  overflow = false; // visualization page overflow toggle

  constructor(private service: VisualizationDataService) {
    this.nodeStream = service.getNodes();
    this.edgeStream = service.getEdges();
    this.courseTitle = service.getTitle();

    const combinedFields = assign({}, fields, pick(service, [
      'nodeWeightField', 'nodeColorField',
      'edgeWeightField', 'edgeColorField'
    ]));
    this.fields = mapValues(combinedFields, (f) => f.getBoundField());
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedControl' in changes) {
      // TODO add actions for controlling animations on the visualization.
      console.log('selected animation control - ', changes.selectedControl.currentValue); // TODO remove when appropriate functionality has been added
    }

    if ('personSelected' in changes) {
      const filter = {personName: changes.personSelected.currentValue};
      this.nodeStream = this.service.getNodes(filter);
      this.edgeStream = this.service.getEdges(filter);
      this.courseTitle = this.service.getTitle(filter);
    }
  }
}
