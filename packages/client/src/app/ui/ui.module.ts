import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { VisualizationModule } from '../visualization';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
  
    SharedModule,
    VisualizationModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class UiModule { }
