import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { UiModule } from './ui';
import { DatabaseService, GindaDatabaseService, GraphQLDatabaseService } from 'learning-trajectories-database';

import { AppComponent } from './app.component';

const temp = new GraphQLDatabaseService();

@NgModule({
  imports: [
    BrowserModule,
    UiModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: DatabaseService, useClass: GindaDatabaseService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
