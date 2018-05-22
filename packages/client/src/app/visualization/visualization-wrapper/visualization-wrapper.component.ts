import { 
  Component, 
  OnInit,

  OnChanges,
  SimpleChanges,

  Input
} from '@angular/core';
import { VisualizationDataService } from '../shared/visualization-data.service';

@Component({
  selector: 'app-visualization-wrapper',
  templateUrl: './visualization-wrapper.component.html',
  styleUrls: ['./visualization-wrapper.component.sass']
})
export class VisualizationWrapperComponent implements OnInit, OnChanges {
  @Input() selectedControl: string;

  constructor(private dataService: VisualizationDataService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedControl' in changes) {
      // TODO add actions for controlling animations on the visualization.
    }
  }

}
