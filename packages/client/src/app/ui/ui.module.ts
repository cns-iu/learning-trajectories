import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { TrajectoriesVisualizationModule } from 'trajectories-visualization';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,

    SharedModule, 
    
    TrajectoriesVisualizationModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class UiModule { }
