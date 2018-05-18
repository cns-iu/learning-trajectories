import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinearNetworkComponent } from './linear-network/linear-network.component';

import { DataProcessorService } from '@ngx-dino/core';
import { LinearNetworkService } from './shared/linear-network.service';

@NgModule({
  imports: [CommonModule],
  exports: [LinearNetworkComponent],
  declarations: [LinearNetworkComponent],
  providers: [
    DataProcessorService,
    LinearNetworkService
  ]
})
export class DinoLinearNetworkModule { }
