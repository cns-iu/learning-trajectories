import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LinearNetworkComponent } from './linear-network/linear-network.component';

import { DataProcessorService } from '@ngx-dino/core';
import { LinearNetworkService } from './shared/linear-network.service';
import { LinearNetworkLayoutService } from './shared/linear-network-layout.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule, BrowserAnimationsModule
  ],
  exports: [LinearNetworkComponent],
  declarations: [LinearNetworkComponent],
  providers: [
    DataProcessorService,
    LinearNetworkService, LinearNetworkLayoutService
  ]
})
export class DinoLinearNetworkModule { }
