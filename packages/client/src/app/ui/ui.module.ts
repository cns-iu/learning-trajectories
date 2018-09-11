import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseService } from 'learning-trajectories-database';

import { SharedModule } from '../shared';
import { VisualizationModule } from '../visualization';

import { HomeComponent } from './home/home.component';
import { PersonSelectorComponent } from './person-selector/person-selector.component';
import { AnimationControlsComponent } from './animation-controls/animation-controls.component';

import { InputSelectorDataService } from './shared/input-selector-data.service';
import { CourseSelectorComponent } from './course-selector/course-selector.component';


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
    InputSelectorDataService,
    DatabaseService
  ],
  declarations: [HomeComponent, PersonSelectorComponent, AnimationControlsComponent, CourseSelectorComponent]
})
export class UiModule { }
