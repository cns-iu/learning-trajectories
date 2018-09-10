import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseService } from 'learning-trajectories-database';

import { SharedModule } from '../shared';
import { VisualizationModule } from '../visualization';

import { HomeComponent } from './home/home.component';
import { PersonSelectorComponent } from './person-selector/person-selector.component';
import { AnimationControlsComponent } from './animation-controls/animation-controls.component';

import { PersonSelectorDataService } from './shared/person-selector-data.service';


@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    VisualizationModule
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    PersonSelectorDataService,
    DatabaseService
  ],
  declarations: [HomeComponent, PersonSelectorComponent, AnimationControlsComponent]
})
export class UiModule { }
