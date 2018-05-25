import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoLinearNetworkModule } from '@ngx-dino/linear-network';
import { DinoLegendModule } from '@ngx-dino/legend';

import { VisualizationWrapperComponent } from './visualization-wrapper/visualization-wrapper.component';
import { VisualizationLegendsComponent } from './visualization-legends/visualization-legends.component';

import { VisualizationDataService } from './shared/visualization-data.service';
import { DatabaseService } from 'learning-trajectories-database';

@NgModule({
  imports: [
    CommonModule,

    DinoLinearNetworkModule,
    DinoLegendModule
  ],
  exports: [
    VisualizationWrapperComponent,
    VisualizationLegendsComponent
  ],
  providers: [
    VisualizationDataService,
    DatabaseService
  ],
  declarations: [VisualizationWrapperComponent, VisualizationLegendsComponent]
})
export class VisualizationModule { }
