import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoLinearNetworkModule } from 'dino-linear-network';
import { LegendModule } from '@ngx-dino/legend';

import { VisualizationWrapperComponent } from './visualization-wrapper/visualization-wrapper.component';
import { VisualizationLegendsComponent } from './visualization-legends/visualization-legends.component';

import { VisualizationDataService } from './shared/visualization-data.service';

@NgModule({
  imports: [
    CommonModule,
    DinoLinearNetworkModule,
    LegendModule
  ],
  exports: [
    VisualizationWrapperComponent,
    VisualizationLegendsComponent
  ],
  providers: [
    VisualizationDataService
  ],
  declarations: [VisualizationWrapperComponent, VisualizationLegendsComponent]
})
export class VisualizationModule { }
