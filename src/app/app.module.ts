import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UiModule } from './ui';
import { DatabaseService, GraphQLDatabaseService } from 'learning-trajectories-database';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    UiModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: DatabaseService, useClass: GraphQLDatabaseService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
