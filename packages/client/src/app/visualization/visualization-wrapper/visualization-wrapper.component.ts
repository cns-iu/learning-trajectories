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

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;
  fields: {[key: string]: BoundField<any>};

  constructor(private service: VisualizationDataService) {
    this.nodeStream = service.getNodes();
    this.edgeStream = service.getEdges();

    const combinedFields = assign({}, fields, pick(service, [
      'nodeWeightField', 'nodeColorField', 'edgeWeightField'
    ]));
    this.fields = mapValues(combinedFields, (f) => f.getBoundField());
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedControl' in changes) {
      // TODO add actions for controlling animations on the visualization.
    }
  }
}
