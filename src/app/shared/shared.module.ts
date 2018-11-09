import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NouisliderModule } from 'ng2-nouislider';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,

    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,

    NouisliderModule
  ],
  exports: [
    BrowserAnimationsModule,
    CommonModule,

    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,

    NouisliderModule
  ],
  declarations: []
})
export class SharedModule { }
