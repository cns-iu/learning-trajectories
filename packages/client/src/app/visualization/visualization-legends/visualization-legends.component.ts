import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  ChangeDetectorRef
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Map, OrderedMap } from 'immutable';

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
  @Input() nodeSizeFactor: number;

  nodeStream: Observable<RawChangeSet>;
  edgeStream: Observable<RawChangeSet>;

  nodeLegendTitle = '# Interactions';
  nodeSizeRangeLimits: number[] = [10, 20];
  nodeSizeRange: number[] = this.nodeSizeRangeLimits;
  nodeLabelToColor: Map<string, string>;
  nodeShape = 'Node';
  nodeColorEncoding = 'Module Type';

  fields: {[key: string]: BoundField<any>};

  edgeLegendTitle = 'Absolute Distance';
  edgeSizeRange = [0.35, 0.35];
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

    // Not available right now
    this.edgeLabelToColor = OrderedMap([
      ['Forward Direction', 'blue'],
      ['Backward Direction', 'purple']
    ]);
  }

  ngOnInit() {
  }

  onNodeSizeFactorChange(factor: number) {
    if (factor !== this.nodeSizeFactor) {
      setTimeout(() => {
        this.nodeSizeFactor = factor;
        this.nodeSizeRange = this.nodeSizeRangeLimits.map(l => l * factor);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('personSelected' in changes) {
      const filter = {personName: changes.personSelected.currentValue};
      this.nodeStream = this.service.getNodes(filter);
      this.edgeStream = this.service.getEdges(filter);
    }
  }
}
