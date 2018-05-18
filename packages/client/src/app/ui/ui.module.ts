import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { VisualizationModule } from '../visualization';

import { HomeComponent } from './home/home.component';
import { PersonSelectorComponent } from './person-selector/person-selector.component';
import { AnimationControlsComponent } from './animation-controls/animation-controls.component';

@NgModule({
  imports: [
    CommonModule,
  
    SharedModule,
    VisualizationModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent, PersonSelectorComponent, AnimationControlsComponent]
})
export class UiModule { }
