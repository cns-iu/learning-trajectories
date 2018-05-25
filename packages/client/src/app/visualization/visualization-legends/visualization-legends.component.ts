import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Map, OrderedMap } from 'immutable';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { assign, mapValues, pick } from 'lodash';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import { VisualizationDataService } from '../shared/visualization-data.service';
import * as fields from '../shared/linear-network-fields';


@Component({
  selector: 'app-visualization-legends',
  templateUrl: './visualization-legends.component.html',
  styleUrls: ['./visualization-legends.component.sass']
})
export class VisualizationLegendsComponent implements OnInit, OnChanges {
  @Input() personSelected: string;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;

  nodeLegendTitle = '# Event Interactions';
  nodeSizeRange: number[] = [10, 20];
  nodeLabelToColor: Map<string, string>;
  nodeShape = 'Node';
  nodeColorEncoding = 'Event Type';

  fields: {[key: string]: BoundField<any>};

  edgeLegendTitle = 'Absolute Distance';
  edgeSizeRange = [0.875, 3.5];
  edgeShape = 'Edge';
  edgeColorEncoding = 'Direction';
  edgeLabelToColor: Map<string, string>;

  constructor(private service: VisualizationDataService) {
    this.nodeStream = service.getNodes();
    this.edgeStream = service.getEdges();

    const combinedFields = assign({}, fields, pick(service, [
      'nodeIdField', 'edgeIdField',
      'nodeSizeField', 'nodeColorField',
      'edgeSizeField', 'edgeColorField'
    ]));

    this.fields = mapValues(combinedFields, (f: any) => f.getBoundField());

    this.nodeLabelToColor = OrderedMap([
      ['HTML Modules', '#90CBFB'],
      ['Video Modules', '#70B637'],
      ['Problem Modules', '#EFC96A'],
      ['Open Assessments Modules', '#8E1B86'],
      ['Word Cloud Modules', '#C24519'],
      ['Drag and Drop Problem Modules', '#FDFF7E']
    ]);

    this.edgeLabelToColor = OrderedMap([
      ['Forward Direction', 'lightblue'],
      ['Backward Direction', 'purple']
    ]);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('personSelected' in changes) {
      const filter = {personName: changes.personSelected.currentValue};
      this.nodeStream = this.service.getNodes(filter);
      this.edgeStream  = this.service.getEdges(filter);
    }
  }
}
