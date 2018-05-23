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
  @Input() personSelected: string;

  constructor(private dataService: VisualizationDataService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedControl' in changes) {
      // TODO add actions for controlling animations on the visualization.
      console.log('selected animation control - ', changes.selectedControl.currentValue); // TODO remove when appropriate functionality has been added
    }

    if ('personSelected' in changes) {
      // TODO add actions for displaying linear network visualization for the selected person
      console.log('selected person value - ', changes.personSelected.currentValue); // TODO remove when appropriate functionality has been added
    }
  }

}
