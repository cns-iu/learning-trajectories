import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { DinoLinearNetworkModule } from '@ngx-dino/linear-network';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,

    SharedModule, 
    
    DinoLinearNetworkModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class UiModule { }
